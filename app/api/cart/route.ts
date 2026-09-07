import { auth } from "@/auth";

import {
getCart,
saveCart,
clearCart,
} from "@/lib/repositories/cart";

import { getProductById } from "@/lib/repositories/products";

import type { Product } from "@/lib/types";

const MAX_ITEM_QUANTITY = 100;

export async function GET() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
    );
}

const items = await getCart(session.user.id);

return Response.json(items);
} catch (error) {
console.error("Cart GET error:", error);

return Response.json(
    { error: "Failed to load cart." },
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
    !("items" in body) ||
    !Array.isArray(body.items)
) {
    return Response.json(
    { error: "Invalid cart data." },
    { status: 400 }
    );
}

const items = body.items;

const productIds = new Set<number>();

const savedItems: {
    product: Product;
    quantity: number;
}[] = [];

for (const item of items) {
    if (
    !item ||
    typeof item !== "object" ||
    !("product" in item) ||
    !item.product ||
    typeof item.product !== "object" ||
    !("quantity" in item) ||
    typeof item.quantity !== "number" ||
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0 ||
    item.quantity > MAX_ITEM_QUANTITY
    ) {
    return Response.json(
        { error: "Invalid cart item." },
        { status: 400 }
    );
    }

    const product = item.product;

    if (
    !("id" in product) ||
    typeof product.id !== "number" ||
    !Number.isInteger(product.id) ||
    product.id <= 0 ||
    productIds.has(product.id)
    ) {
    return Response.json(
        { error: "Invalid cart item." },
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
        error: "One or more products in your cart are unavailable.",
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
        { error: "Failed to save cart." },
        { status: 500 }
    );
    }

    savedItems.push({
    product: {
        id: databaseProductId,
        name: databaseProduct.name,
        description: databaseProduct.description,
        price: databasePrice,
        image: databaseProduct.image,
        category: databaseProduct.category,
    },
    quantity: item.quantity,
    });
}

const result = await saveCart(
    session.user.id,
    savedItems
);

return Response.json(result);
} catch (error) {
console.error("Cart PUT error:", error);

return Response.json(
    { error: "Failed to save cart." },
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

await clearCart(session.user.id);

return Response.json([]);
} catch (error) {
console.error("Cart DELETE error:", error);

return Response.json(
    { error: "Failed to clear cart." },
    { status: 500 }
);
}
}