import {
GetCommand,
PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { dynamodb } from "@/lib/dynamodb";

const TABLE_NAME = "users";

export type User = {
id: string;
email: string;
name: string;
passwordHash: string;
role: "user" | "admin";
};

export async function getUserById(
id: string
): Promise<User | null> {
const result = await dynamodb.send(
    new GetCommand({
    TableName: TABLE_NAME,
    Key: {
        id,
    },
    })
);

return (result.Item as User | undefined) ?? null;
}

export async function createUser(
user: User
): Promise<User> {
await dynamodb.send(
    new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
    ConditionExpression: "attribute_not_exists(id)",
    })
);

return user;
}