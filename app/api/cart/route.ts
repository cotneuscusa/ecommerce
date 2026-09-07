import { auth } from "@/auth";
import {
getCart,
saveCart,
clearCart,
} from "@/lib/repositories/cart";

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

const body = await request.json();

if (!Array.isArray(body.items)) {
    return Response.json(
    { error: "Invalid cart data." },
    { status: 400 }
    );
}

for (const item of body.items) {
    if (
    !item ||
    typeof item !== "object" ||
    !item.product ||
    typeof item.product !== "object" ||
    typeof item.product.id !== "number" ||
    !Number.isInteger(item.product.id) ||
    item.product.id <= 0 ||
    typeof item.product.name !== "string" ||
    item.product.name.trim() === "" ||
    typeof item.product.description !== "string" ||
    item.product.description.trim() === "" ||
    typeof item.product.price !== "number" ||
    !Number.isFinite(item.product.price) ||
    item.product.price < 0 ||
    typeof item.product.image !== "string" ||
    item.product.image.trim() === "" ||
    typeof item.product.category !== "string" ||
    item.product.category.trim() === "" ||
    typeof item.quantity !== "number" ||
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0
    ) {
    return Response.json(
        { error: "Invalid cart item." },
        { status: 400 }
    );
    }
}

const items = await saveCart(
    session.user.id,
    body.items
);

return Response.json(items);
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