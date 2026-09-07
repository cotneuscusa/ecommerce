import { auth } from "@/auth";

import {
getWishlist,
saveWishlist,
clearWishlist,
} from "@/lib/repositories/wishlist";

export async function GET() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
    );
}

const products = await getWishlist(session.user.id);

return Response.json(products);
} catch (error) {
console.error("Wishlist GET error:", error);

return Response.json(
    { error: "Failed to load wishlist." },
    { status: 500 }
);
}
}

export async function PUT(request: Request) {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
    );
}

const body = await request.json();

if (!Array.isArray(body.products)) {
    return Response.json(
    { error: "Invalid wishlist data." },
    { status: 400 }
    );
}

for (const product of body.products) {
    if (
    !product ||
    typeof product !== "object" ||
    typeof product.id !== "number" ||
    !Number.isInteger(product.id) ||
    product.id <= 0 ||
    typeof product.name !== "string" ||
    product.name.trim() === "" ||
    typeof product.description !== "string" ||
    product.description.trim() === "" ||
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    product.price < 0 ||
    typeof product.image !== "string" ||
    product.image.trim() === "" ||
    typeof product.category !== "string" ||
    product.category.trim() === ""
    ) {
    return Response.json(
        { error: "Invalid wishlist product." },
        { status: 400 }
    );
    }
}

const products = await saveWishlist(
    session.user.id,
    body.products
);

return Response.json(products);
} catch (error) {
console.error("Wishlist PUT error:", error);

return Response.json(
    { error: "Failed to save wishlist." },
    { status: 500 }
);
}
}

export async function DELETE() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
    );
}

await clearWishlist(session.user.id);

return Response.json([]);
} catch (error) {
console.error("Wishlist DELETE error:", error);

return Response.json(
    { error: "Failed to clear wishlist." },
    { status: 500 }
);
}
}