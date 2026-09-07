import {
GetCommand,
PutCommand,
DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { dynamodb } from "@/lib/dynamodb";
import type { Product } from "@/lib/types";

const TABLE_NAME = "carts";

export type CartItem = {
product: Product;
quantity: number;
};

export async function getCart(
userId: string
): Promise<CartItem[]> {
const result = await dynamodb.send(
    new GetCommand({
    TableName: TABLE_NAME,
    Key: {
        userId,
    },
    })
);

return (result.Item?.items ?? []) as CartItem[];
}

export async function saveCart(
userId: string,
items: CartItem[]
): Promise<CartItem[]> {
await dynamodb.send(
    new PutCommand({
    TableName: TABLE_NAME,
    Item: {
        userId,
        items,
        updatedAt: new Date().toISOString(),
    },
    })
);

return items;
}

export async function clearCart(
userId: string
): Promise<void> {
await dynamodb.send(
    new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
        userId,
    },
    })
);
}