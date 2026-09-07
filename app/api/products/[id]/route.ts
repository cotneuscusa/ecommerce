import { auth } from "@/auth";

import {
getProduct,
updateProductFromInput,
deleteProductById,
} from "@/lib/services/product-service";

type RouteProps = {
params: Promise<{
id: string;
}>;
};

export async function GET(
request: Request,
{ params }: RouteProps
) {
try {
const { id } = await params;

const product = await getProduct(id);

if (!product) {
    return Response.json(
    { error: "Product not found" },
    { status: 404 }
    );
}

return Response.json(product);
} catch (error) {
console.error("Product GET error:", error);

return Response.json(
    { error: "Failed to fetch product" },
    { status: 500 }
);
}
}

export async function PUT(
request: Request,
{ params }: RouteProps
) {
const session = await auth();

if (!session?.user?.id) {
return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
);
}

if (session.user.role !== "admin") {
return Response.json(
    {
    error:
        "You do not have permission to update products.",
    },
    { status: 403 }
);
}

try {
const { id } = await params;
const product = await request.json();

if (
    !product.name ||
    !product.description ||
    product.price === undefined ||
    !product.image ||
    !product.category
) {
    return Response.json(
    { error: "Missing product fields" },
    { status: 400 }
    );
}

if (
    typeof product.name !== "string" ||
    typeof product.description !== "string" ||
    typeof product.image !== "string" ||
    typeof product.category !== "string" ||
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    product.price < 0
) {
    return Response.json(
    { error: "Invalid product data" },
    { status: 400 }
    );
}

const existingProduct =
    await getProduct(id);

if (!existingProduct) {
    return Response.json(
    { error: "Product not found" },
    { status: 404 }
    );
}

const updatedProduct =
    await updateProductFromInput(id, {
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    });

if (!updatedProduct) {
    return Response.json(
    { error: "Failed to update product" },
    { status: 500 }
    );
}

return Response.json(updatedProduct);
} catch (error) {
console.error("Product PUT error:", error);

return Response.json(
    { error: "Failed to update product" },
    { status: 500 }
);
}
}

export async function DELETE(
request: Request,
{ params }: RouteProps
) {
const session = await auth();

if (!session?.user?.id) {
return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
);
}

if (session.user.role !== "admin") {
return Response.json(
    {
    error:
        "You do not have permission to delete products.",
    },
    { status: 403 }
);
}

try {
const { id } = await params;

const deleted = await deleteProductById(id);

if (!deleted) {
    return Response.json(
    { error: "Product not found" },
    { status: 404 }
    );
}

return Response.json({
    message: "Product deleted successfully",
});
} catch (error) {
console.error("Product DELETE error:", error);

return Response.json(
    { error: "Failed to delete product" },
    { status: 500 }
);
}
}