import { auth } from "@/auth";

import {
getUserWishlist,
saveUserWishlist,
clearUserWishlist,
} from "@/lib/services/wishlist-api-service";

import type { Product } from "@/lib/types";

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

const products = await getUserWishlist(
    session.user.id
);

return Response.json({
    products,
});
} catch (error) {
console.error(
    "Wishlist GET error:",
    error
);

return Response.json(
    {
    error: "Failed to load wishlist.",
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
        error:
        "Invalid JSON request body.",
    },
    { status: 400 }
    );
}

if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray(
    (body as { products?: unknown })
        .products
    )
) {
    return Response.json(
    {
        error:
        "Invalid wishlist information.",
    },
    { status: 400 }
    );
}

const products = (
    body as {
    products: Product[];
    }
).products;

const savedProducts =
    await saveUserWishlist(
    session.user.id,
    products
    );

return Response.json({
    products: savedProducts,
});
} catch (error) {
if (error instanceof Error) {
    if (
    error.message ===
        "Your wishlist contains too many items." ||
    error.message ===
        "Invalid wishlist product."
    ) {
    return Response.json(
        {
        error: error.message,
        },
        { status: 400 }
    );
    }
}

console.error(
    "Wishlist PUT error:",
    error
);

return Response.json(
    {
    error:
        "Failed to update wishlist.",
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

await clearUserWishlist(
    session.user.id
);

return Response.json({
    message:
    "Wishlist cleared successfully.",
});
} catch (error) {
console.error(
    "Wishlist DELETE error:",
    error
);

return Response.json(
    {
    error:
        "Failed to clear wishlist.",
    },
    { status: 500 }
);
}
}