import {
GetCommand,
PutCommand,
DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { dynamodb } from "@/lib/dynamodb";
import type { Product } from "@/lib/types";

const TABLE_NAME = "wishlists";

export async function getWishlist(
userId: string
): Promise<Product[]> {
const result = await dynamodb.send(
    new GetCommand({
    TableName: TABLE_NAME,
    Key: {
        userId,
    },
    })
);

return (result.Item?.products ?? []) as Product[];
}

export async function saveWishlist(
userId: string,
products: Product[]
): Promise<Product[]> {
await dynamodb.send(
    new PutCommand({
    TableName: TABLE_NAME,
    Item: {
        userId,
        products,
        updatedAt: new Date().toISOString(),
    },
    })
);

return products;
}

export async function clearWishlist(
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