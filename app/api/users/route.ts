import bcrypt from "bcryptjs";
import {
createUser,
getUserById,
} from "@/lib/repositories/users";

export async function POST(request: Request) {
try {
let body: unknown;

try {
    body = await request.json();
} catch {
    return Response.json(
    { error: "Invalid JSON." },
    { status: 400 }
    );
}

if (!body || typeof body !== "object") {
    return Response.json(
    { error: "Invalid request data." },
    { status: 400 }
    );
}

const data = body as {
    email?: unknown;
    name?: unknown;
    password?: unknown;
};

const email =
    typeof data.email === "string"
    ? data.email.trim().toLowerCase()
    : "";

const name =
    typeof data.name === "string"
    ? data.name.trim()
    : "";

const password =
    typeof data.password === "string"
    ? data.password
    : "";

if (!email || !name || !password) {
    return Response.json(
    {
        error: "Name, email, and password are required.",
    },
    { status: 400 }
    );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    return Response.json(
    { error: "Please provide a valid email address." },
    { status: 400 }
    );
}

if (password.length < 8) {
    return Response.json(
    {
        error: "Password must be at least 8 characters.",
    },
    { status: 400 }
    );
}

const existingUser = await getUserById(email);

if (existingUser) {
    return Response.json(
    {
        error: "A user with this email already exists.",
    },
    { status: 409 }
    );
}

const passwordHash = await bcrypt.hash(
    password,
    12
);

const user = {
    id: email,
    email,
    name,
    passwordHash,
    role: "user" as const,
};

const createdUser = await createUser(user);

return Response.json(
    {
    message: "User created successfully.",
    user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
    },
    },
    { status: 201 }
);
} catch (error) {
if (
    error instanceof Error &&
    error.name === "ConditionalCheckFailedException"
) {
    return Response.json(
    {
        error: "A user with this email already exists.",
    },
    { status: 409 }
    );
}

console.error("User creation error:", error);

return Response.json(
    { error: "Failed to create user." },
    { status: 500 }
);
}
}