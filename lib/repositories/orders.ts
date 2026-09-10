import {
GetCommand,
QueryCommand,
TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

import { dynamodb } from "@/lib/dynamodb";

const ORDERS_TABLE_NAME = "orders";
const CARTS_TABLE_NAME = "carts";
const USER_ORDERS_INDEX = "UserOrdersIndex";

export type OrderItem = {
product: {
    id: number;
    name: string;
    price: number;
    image: string;
};
quantity: number;
};

export type Order = {
id: string;
userId: string;
customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postal: string;
};
items: OrderItem[];
total: number;
status: string;
createdAt: string;
};

export async function createOrderAndClearCart(
order: Order
): Promise<Order> {
try {
    await dynamodb.send(
    new TransactWriteCommand({
        TransactItems: [
        {
            Put: {
            TableName: ORDERS_TABLE_NAME,
            Item: order,
            ConditionExpression: "attribute_not_exists(id)",
            },
        },
        {
            Delete: {
            TableName: CARTS_TABLE_NAME,
            Key: {
                userId: order.userId,
            },
            ConditionExpression: "attribute_exists(userId)",
            },
        },
        ],
    })
    );

    return order;
} catch (error) {
    /*
    * If another request with the same idempotency key already
    * created this order, the conditional Put will fail.
    *
    * Retrieve the existing order and return it instead of
    * creating a duplicate.
    */
    const existingOrder = await getOrderById(order.id);

    if (existingOrder && existingOrder.userId === order.userId) {
    return existingOrder;
    }

    throw error;
}
}

async function getOrderById(
orderId: string
): Promise<Order | null> {
const result = await dynamodb.send(
    new GetCommand({
    TableName: ORDERS_TABLE_NAME,
    Key: {
        id: orderId,
    },
    })
);

return (result.Item as Order | undefined) ?? null;
}

export async function getOrdersByUserId(
userId: string
): Promise<Order[]> {
if (
    typeof userId !== "string" ||
    userId.trim() === ""
) {
    throw new Error("Invalid user ID.");
}

const result = await dynamodb.send(
    new QueryCommand({
    TableName: ORDERS_TABLE_NAME,
    IndexName: USER_ORDERS_INDEX,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
        ":userId": userId,
    },
    ScanIndexForward: false,
    })
);

return (result.Items ?? []) as Order[];
}