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
    _request: Request,
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

    let product: unknown;

    try {
        product = await request.json();
    } catch {
        return Response.json(
        { error: "Invalid JSON." },
        { status: 400 }
        );
    }

    if (
        !product ||
        typeof product !== "object" ||
        !("name" in product) ||
        !("description" in product) ||
        !("price" in product) ||
        !("image" in product) ||
        !("category" in product)
    ) {
        return Response.json(
        { error: "Invalid product data." },
        { status: 400 }
        );
    }

    const productData = product as {
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
    };
    
    const updatedProduct = await updateProductFromInput(id, productData);

    if (!updatedProduct) {
        return Response.json(
        { error: "Product not found" },
        { status: 404 }
        );
    }

    return Response.json(updatedProduct);
    } catch (error) {
    if (
        error instanceof Error &&
        error.message === "Invalid product data."
    ) {
        return Response.json(
        { error: error.message },
        { status: 400 }
        );
    }

    console.error("Product PUT error:", error);

    return Response.json(
        { error: "Failed to update product" },
        { status: 500 }
    );
    }
    }

    export async function DELETE(
    _request: Request,
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
