import {
PutCommand,
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

function validateOrder(order: Order): void {
if (!order || typeof order !== "object") {
    throw new Error("Invalid order.");
}

if (
    typeof order.id !== "string" ||
    order.id.trim() === ""
) {
    throw new Error("Invalid order ID.");
}

if (
    typeof order.userId !== "string" ||
    order.userId.trim() === ""
) {
    throw new Error("Invalid user ID.");
}

if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new Error("Order must contain at least one item.");
}

if (
    !Number.isFinite(order.total) ||
    order.total < 0
) {
    throw new Error("Invalid order total.");
}

if (
    typeof order.status !== "string" ||
    order.status.trim() === ""
) {
    throw new Error("Invalid order status.");
}

if (
    typeof order.createdAt !== "string" ||
    order.createdAt.trim() === ""
) {
    throw new Error("Invalid order creation date.");
}

for (const item of order.items) {
    if (!item || typeof item !== "object") {
    throw new Error("Invalid order item.");
    }

    if (
    !item.product ||
    typeof item.product !== "object"
    ) {
    throw new Error("Invalid order product.");
    }

    if (
    !Number.isInteger(item.product.id) ||
    item.product.id <= 0
    ) {
    throw new Error("Invalid product ID.");
    }

    if (
    typeof item.product.name !== "string" ||
    item.product.name.trim() === ""
    ) {
    throw new Error("Invalid product name.");
    }

    if (
    !Number.isFinite(item.product.price) ||
    item.product.price < 0
    ) {
    throw new Error("Invalid product price.");
    }

    if (
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0
    ) {
    throw new Error("Invalid item quantity.");
    }
}
}

export async function createOrderAndClearCart(
order: Order
): Promise<Order> {
validateOrder(order);

await dynamodb.send(
    new TransactWriteCommand({
    TransactItems: [
        {
        Put: {
            TableName: ORDERS_TABLE_NAME,
            Item: order,
            ConditionExpression:
            "attribute_not_exists(id)",
        },
        },
        {
        Delete: {
            TableName: CARTS_TABLE_NAME,
            Key: {
            userId: order.userId,
            },
        },
        },
    ],
    })
);

return order;
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
    KeyConditionExpression:
        "userId = :userId",
    ExpressionAttributeValues: {
        ":userId": userId,
    },
    ScanIndexForward: false,
    })
);

return (result.Items ?? []) as Order[];
}