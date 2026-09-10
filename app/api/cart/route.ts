import { auth } from "@/auth";

import {
getUserCart,
saveUserCart,
clearUserCart,
} from "@/lib/services/cart-api-service";

export async function GET() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    {
        error: "You must be logged in.",
    },
    { status: 401 }
    );
}

const items = await getUserCart(
    session.user.id
);

return Response.json({ items });
} catch (error) {
console.error("Cart GET error:", error);

return Response.json(
    {
    error: "Failed to load cart.",
    },
    { status: 500 }
);
}
}

export async function PUT(
request: Request
) {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    {
        error: "You must be logged in.",
    },
    { status: 401 }
    );
}

let body: unknown;

try {
    body = await request.json();
} catch {
    return Response.json(
    {
        error: "Invalid JSON request body.",
    },
    { status: 400 }
    );
}

if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray(
    (body as { items?: unknown }).items
    )
) {
    return Response.json(
    {
        error: "Invalid cart information.",
    },
    { status: 400 }
    );
}

const items = (
    body as {
    items: unknown[];
    }
).items;

const savedItems = await saveUserCart(
    session.user.id,
    items as never[]
);

return Response.json({
    items: savedItems,
});
} catch (error) {
if (error instanceof Error) {
    if (
    error.message ===
    "Your cart contains too many items."
    ) {
    return Response.json(
        { error: error.message },
        { status: 400 }
    );
    }

    if (
    error.message === "Invalid cart item."
    ) {
    return Response.json(
        { error: error.message },
        { status: 400 }
    );
    }
}

console.error("Cart PUT error:", error);

return Response.json(
    {
    error: "Failed to update cart.",
    },
    { status: 500 }
);
}
}

export async function DELETE() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    {
        error: "You must be logged in.",
    },
    { status: 401 }
    );
}

await clearUserCart(
    session.user.id
);

return Response.json({
    message: "Cart cleared successfully.",
});
} catch (error) {
console.error(
    "Cart DELETE error:",
    error
);

return Response.json(
    {
    error: "Failed to clear cart.",
    },
    { status: 500 }
);
}
}