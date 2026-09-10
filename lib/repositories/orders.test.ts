import {
beforeEach,
describe,
expect,
it,
vi,
} from "vitest";

const { mockedSend } = vi.hoisted(() => ({
mockedSend: vi.fn(),
}));

vi.mock("@/lib/dynamodb", () => ({
dynamodb: {
send: mockedSend,
},
}));

vi.mock("@aws-sdk/lib-dynamodb", () => ({
GetCommand: class {
input: unknown;

constructor(input: unknown) {
    this.input = input;
}
},

QueryCommand: class {
input: unknown;

constructor(input: unknown) {
    this.input = input;
}
},

TransactWriteCommand: class {
input: unknown;

constructor(input: unknown) {
    this.input = input;
}
},
}));

import {
createOrderAndClearCart,
getOrdersByUserId,
type Order,
} from "./orders";

const order: Order = {
id: "order-123",
userId: "user-1",
customer: {
name: "Test User",
email: "user@example.com",
address: "Test Address",
city: "Test City",
postal: "12345",
},
items: [
{
    product: {
    id: 1,
    name: "Test Product",
    price: 10,
    image: "test.jpg",
    },
    quantity: 2,
},
],
total: 20,
status: "pending",
createdAt: "2026-01-01T00:00:00.000Z",
};

describe("orders repository", () => {
beforeEach(() => {
vi.clearAllMocks();
});

it("creates an order and clears the cart in one transaction", async () => {
mockedSend.mockResolvedValueOnce({});

const result =
    await createOrderAndClearCart(order);

expect(result).toEqual(order);
expect(mockedSend).toHaveBeenCalledTimes(1);

const command =
    mockedSend.mock.calls[0][0];

expect(command.input).toEqual({
    TransactItems: [
    {
        Put: {
        TableName: "orders",
        Item: order,
        ConditionExpression:
            "attribute_not_exists(id)",
        },
    },
    {
        Delete: {
        TableName: "carts",
        Key: {
            userId: "user-1",
        },
        ConditionExpression:
            "attribute_exists(userId)",
        },
    },
    ],
});
});

it("returns the existing order when the transaction fails and the order already exists", async () => {
mockedSend
    .mockRejectedValueOnce(
    new Error("Transaction failed")
    )
    .mockResolvedValueOnce({
    Item: order,
    });

const result =
    await createOrderAndClearCart(order);

expect(result).toEqual(order);
expect(mockedSend).toHaveBeenCalledTimes(2);

const lookupCommand =
    mockedSend.mock.calls[1][0];

expect(lookupCommand.input).toEqual({
    TableName: "orders",
    Key: {
    id: "order-123",
    },
});
});

it("does not return an order belonging to another user", async () => {
const differentUserOrder: Order = {
    ...order,
    userId: "user-2",
};

mockedSend
    .mockRejectedValueOnce(
    new Error("Transaction failed")
    )
    .mockResolvedValueOnce({
    Item: differentUserOrder,
    });

await expect(
    createOrderAndClearCart(order)
).rejects.toThrow(
    "Transaction failed"
);

expect(mockedSend).toHaveBeenCalledTimes(2);
});

it("queries orders using the user's order index", async () => {
mockedSend.mockResolvedValueOnce({
    Items: [order],
});

const result =
    await getOrdersByUserId("user-1");

expect(result).toEqual([order]);
expect(mockedSend).toHaveBeenCalledTimes(1);

const command =
    mockedSend.mock.calls[0][0];

expect(command.input).toEqual({
    TableName: "orders",
    IndexName: "UserOrdersIndex",
    KeyConditionExpression:
    "userId = :userId",
    ExpressionAttributeValues: {
    ":userId": "user-1",
    },
    ScanIndexForward: false,
});
});

it("rejects an empty user ID", async () => {
await expect(
    getOrdersByUserId("")
).rejects.toThrow(
    "Invalid user ID."
);

expect(
    mockedSend
).not.toHaveBeenCalled();
});

it("rejects a whitespace-only user ID", async () => {
await expect(
    getOrdersByUserId("   ")
).rejects.toThrow(
    "Invalid user ID."
);

expect(
    mockedSend
).not.toHaveBeenCalled();
});
});