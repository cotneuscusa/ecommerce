import { auth } from "@/auth";
import {
getProducts,
createProductFromInput,
} from "@/lib/services/product-service";

export async function GET() {
try {
const products = await getProducts();

return Response.json(products);
} catch (error) {
console.error("Products GET error:", error);

return Response.json(
    { error: "Failed to fetch products" },
    { status: 500 }
);
}
}

export async function POST(request: Request) {
const session = await auth();

if (!session?.user?.id) {
return Response.json(
    {
    error: "You must be logged in to create a product.",
    },
    { status: 401 }
);
}

if (session.user.role !== "admin") {
return Response.json(
    {
    error: "You do not have permission to create products.",
    },
    { status: 403 }
);
}

try {
const product = await request.json();

if (!product || typeof product !== "object") {
    return Response.json(
    { error: "Invalid product data" },
    { status: 400 }
    );
}

const createdProduct = await createProductFromInput({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
});

return Response.json(
    createdProduct,
    { status: 201 }
);
} catch (error) {
if (error instanceof Error) {
    if (error.message === "Invalid product data.") {
    return Response.json(
        { error: error.message },
        { status: 400 }
    );
    }

    if (
    error.name ===
    "ConditionalCheckFailedException"
    ) {
    return Response.json(
        {
        error:
            "A product with this ID already exists.",
        },
        { status: 409 }
    );
    }
}

console.error(
    "Products POST error:",
    error
);

return Response.json(
    { error: "Failed to create product" },
    { status: 500 }
);
}
}