import { auth } from "@/auth";

import {
getWishlist,
saveWishlist,
clearWishlist,
} from "@/lib/repositories/wishlist";

import { getProductById } from "@/lib/repositories/products";

import type { Product } from "@/lib/types";

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

let body: unknown;

try {
    body = await request.json();
} catch {
    return Response.json(
    { error: "Invalid JSON." },
    { status: 400 }
    );
}

if (
    !body ||
    typeof body !== "object" ||
    !("products" in body) ||
    !Array.isArray(body.products)
) {
    return Response.json(
    { error: "Invalid wishlist data." },
    { status: 400 }
    );
}

const products = body.products;
const productIds = new Set<number>();
const savedProducts: Product[] = [];

for (const product of products) {
    if (
    !product ||
    typeof product !== "object" ||
    !("id" in product) ||
    typeof product.id !== "number" ||
    !Number.isInteger(product.id) ||
    product.id <= 0 ||
    productIds.has(product.id)
    ) {
    return Response.json(
        { error: "Invalid wishlist product." },
        { status: 400 }
    );
    }

    productIds.add(product.id);

    const databaseProduct = await getProductById(
    String(product.id)
    );

    if (!databaseProduct) {
    return Response.json(
        {
        error:
            "One or more products in your wishlist are unavailable.",
        },
        { status: 400 }
    );
    }

    const databaseProductId = Number(databaseProduct.id);
    const databasePrice = Number(databaseProduct.price);

    if (
    !Number.isInteger(databaseProductId) ||
    databaseProductId <= 0 ||
    !Number.isFinite(databasePrice) ||
    databasePrice < 0 ||
    typeof databaseProduct.name !== "string" ||
    databaseProduct.name.trim() === "" ||
    typeof databaseProduct.description !== "string" ||
    databaseProduct.description.trim() === "" ||
    typeof databaseProduct.image !== "string" ||
    databaseProduct.image.trim() === "" ||
    typeof databaseProduct.category !== "string" ||
    databaseProduct.category.trim() === ""
    ) {
    console.error(
        "Invalid product data in database:",
        databaseProduct
    );

    return Response.json(
        { error: "Failed to save wishlist." },
        { status: 500 }
    );
    }

    savedProducts.push({
    id: databaseProductId,
    name: databaseProduct.name,
    description: databaseProduct.description,
    price: databasePrice,
    image: databaseProduct.image,
    category: databaseProduct.category,
    });
}

const saved = await saveWishlist(
    session.user.id,
    savedProducts
);

return Response.json(saved);
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