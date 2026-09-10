import { createUserFromInput } from "@/lib/services/user-service";

export async function POST(
request: Request
) {
try {
let body: unknown;

try {
    body = await request.json();
} catch {
    return Response.json(
    {
        error: "Invalid JSON.",
    },
    { status: 400 }
    );
}

if (
    !body ||
    typeof body !== "object"
) {
    return Response.json(
    {
        error: "Invalid request data.",
    },
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
    ? data.email
    : "";

const name =
    typeof data.name === "string"
    ? data.name
    : "";

const password =
    typeof data.password === "string"
    ? data.password
    : "";

const createdUser =
    await createUserFromInput({
    email,
    name,
    password,
    });

return Response.json(
    {
    message:
        "User created successfully.",
    user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
    },
    },
    { status: 201 }
);
} catch (error) {
if (error instanceof Error) {
    if (
    error.message ===
    "Name, email, and password are required."
    ) {
    return Response.json(
        {
        error: error.message,
        },
        { status: 400 }
    );
    }

    if (
    error.message ===
    "Please provide a valid email address."
    ) {
    return Response.json(
        {
        error: error.message,
        },
        { status: 400 }
    );
    }

    if (
    error.message ===
    "Password must be at least 8 characters."
    ) {
    return Response.json(
        {
        error: error.message,
        },
        { status: 400 }
    );
    }

    if (
    error.message ===
    "A user with this email already exists."
    ) {
    return Response.json(
        {
        error: error.message,
        },
        { status: 409 }
    );
    }

    if (
    error.name ===
    "ConditionalCheckFailedException"
    ) {
    return Response.json(
        {
        error:
            "A user with this email already exists.",
        },
        { status: 409 }
    );
    }
}

console.error(
    "User creation error:",
    error
);

return Response.json(
    {
    error:
        "Failed to create user.",
    },
    { status: 500 }
);
}
}