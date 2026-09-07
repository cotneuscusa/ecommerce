import { auth } from "@/auth";
import { createOrderFromCart } from "@/lib/services/order-service";
import { orderSchema } from "@/lib/validation/order-schema";

export async function POST(request: Request) {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    {
        error: "You must be logged in to place an order.",
    },
    { status: 401 }
    );
}

const body = await request.json();

const validation = orderSchema.safeParse(body);

if (!validation.success) {
    return Response.json(
    {
        error: "Invalid order information.",
        details: validation.error.flatten(),
    },
    { status: 400 }
    );
}

const order = await createOrderFromCart({
    userId: session.user.id,
    customer: validation.data.customer,
});

return Response.json(
    {
    message: "Order created successfully.",
    order,
    },
    { status: 201 }
);
} catch (error) {
if (error instanceof Error) {
    if (error.message === "Your cart is empty.") {
    return Response.json(
        { error: error.message },
        { status: 400 }
    );
    }

    if (error.message.includes("was not found.")) {
    return Response.json(
        { error: error.message },
        { status: 400 }
    );
    }

    if (error.message === "Invalid product price.") {
    console.error(
        "Invalid product price:",
        error
    );

    return Response.json(
        { error: "Failed to create order." },
        { status: 500 }
    );
    }

    if (error.message === "Invalid order total.") {
    console.error(
        "Invalid order total:",
        error
    );

    return Response.json(
        { error: "Failed to create order." },
        { status: 500 }
    );
    }
}

console.error(
    "Order creation error:",
    error
);

return Response.json(
    {
    error: "Failed to create order.",
    },
    { status: 500 }
);
}
}