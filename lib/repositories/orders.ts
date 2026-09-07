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

export async function createOrderAndClearCart(
order: Order
): Promise<Order> {
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