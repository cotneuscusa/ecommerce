import { auth } from "@/auth";
import {
getCart,
saveCart,
clearCart,
} from "@/lib/repositories/cart";

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
    productIds.has(product.id) ||
    !("name" in product) ||
    typeof product.name !== "string" ||
    product.name.trim() === "" ||
    !("description" in product) ||
    typeof product.description !== "string" ||
    product.description.trim() === "" ||
    !("price" in product) ||
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    product.price < 0 ||
    !("image" in product) ||
    typeof product.image !== "string" ||
    product.image.trim() === "" ||
    !("category" in product) ||
    typeof product.category !== "string" ||
    product.category.trim() === ""
    ) {
    return Response.json(
        { error: "Invalid cart item." },
        { status: 400 }
    );
    }

    productIds.add(product.id);
}

const savedItems = await saveCart(
    session.user.id,
    items as Parameters<typeof saveCart>[1]
);

return Response.json(savedItems);
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