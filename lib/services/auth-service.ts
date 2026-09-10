import bcrypt from "bcryptjs";

import { getUserById } from "@/lib/repositories/users";
import type { User } from "@/lib/repositories/users";

export async function authenticateUser(
email: string,
password: string
): Promise<{
id: string;
name: string;
email: string;
role: "user" | "admin";
} | null> {
const normalizedEmail =
email.trim().toLowerCase();

if (!normalizedEmail || !password) {
return null;
}

const user =
await getUserById(normalizedEmail);

if (!user || !user.passwordHash) {
return null;
}

const passwordMatches =
await bcrypt.compare(
    password,
    user.passwordHash
);

if (!passwordMatches) {
return null;
}

return {
id: String(user.id),
name: String(user.name),
email: String(user.email),
role:
    user.role === "admin"
    ? "admin"
    : "user",
};
}

export async function getCurrentUser(
userId: string
): Promise<User | null> {
if (
typeof userId !== "string" ||
userId.trim() === ""
) {
return null;
}

return getUserById(userId);
}