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

for (const product of products) {
    if (
    !product ||
    typeof product !== "object" ||
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
        { error: "Invalid wishlist product." },
        { status: 400 }
    );
    }

    productIds.add(product.id);
}

const savedProducts = await saveWishlist(
    session.user.id,
    products as Parameters<typeof saveWishlist>[1]
);

return Response.json(savedProducts);
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