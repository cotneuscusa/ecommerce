import {
GetCommand,
PutCommand,
ScanCommand,
UpdateCommand,
DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { dynamodb } from "@/lib/dynamodb";

const TABLE_NAME = "products";

type ProductData = {
id: string;
name: string;
description: string;
price: number;
image: string;
category: string;
};

export async function getAllProducts(): Promise<ProductData[]> {
const result = await dynamodb.send(
new ScanCommand({
    TableName: TABLE_NAME,
})
);

return (result.Items ?? []) as ProductData[];
}

export async function getProductById(
id: string
): Promise<ProductData | null> {
const result = await dynamodb.send(
new GetCommand({
    TableName: TABLE_NAME,
    Key: {
    id,
    },
})
);

return (
(result.Item as ProductData | undefined) ??
null
);
}

export async function createProduct(
product: ProductData
): Promise<ProductData> {
await dynamodb.send(
new PutCommand({
    TableName: TABLE_NAME,
    Item: product,
    ConditionExpression:
    "attribute_not_exists(id)",
})
);

return product;
}

export async function updateProduct(
id: string,
product: Omit<ProductData, "id">
): Promise<ProductData | null> {
const result = await dynamodb.send(
new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
    id,
    },
    UpdateExpression:
    "SET #name = :name, #description = :description, #price = :price, #image = :image, #category = :category",
    ExpressionAttributeNames: {
    "#name": "name",
    "#description": "description",
    "#price": "price",
    "#image": "image",
    "#category": "category",
    },
    ExpressionAttributeValues: {
    ":name": product.name,
    ":description": product.description,
    ":price": product.price,
    ":image": product.image,
    ":category": product.category,
    },
    ConditionExpression:
    "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
})
);

return (
(result.Attributes as ProductData | undefined) ??
null
);
}

export async function deleteProduct(
id: string
): Promise<boolean> {
const result = await dynamodb.send(
new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
    id,
    },
    ReturnValues: "ALL_OLD",
})
);

return Boolean(result.Attributes);
}