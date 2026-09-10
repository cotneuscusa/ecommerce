import bcrypt from "bcryptjs";

import {
createUser,
getUserById,
type User,
} from "@/lib/repositories/users";

type CreateUserInput = {
email: string;
name: string;
password: string;
};

export async function createUserFromInput(
input: CreateUserInput
): Promise<User> {
const email =
typeof input.email === "string"
    ? input.email.trim().toLowerCase()
    : "";

const name =
typeof input.name === "string"
    ? input.name.trim()
    : "";

const password =
typeof input.password === "string"
    ? input.password
    : "";

if (!email || !name || !password) {
throw new Error(
    "Name, email, and password are required."
);
}

const emailPattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
throw new Error(
    "Please provide a valid email address."
);
}

if (password.length < 8) {
throw new Error(
    "Password must be at least 8 characters."
);
}

const existingUser =
await getUserById(email);

if (existingUser) {
throw new Error(
    "A user with this email already exists."
);
}

const passwordHash =
await bcrypt.hash(password, 12);

const user: User = {
id: email,
email,
name,
passwordHash,
role: "user",
};

return createUser(user);
}