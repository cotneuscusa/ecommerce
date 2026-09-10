import { auth } from "@/auth";
import { getUserOrders } from "@/lib/services/order-query-service";

export async function GET() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    {
        error: "You must be logged in.",
    },
    { status: 401 }
    );
}

const orders = await getUserOrders(
    session.user.id
);

return Response.json({
    orders,
});
} catch (error) {
if (
    error instanceof Error &&
    error.message === "Invalid user ID."
) {
    return Response.json(
    {
        error: error.message,
    },
    { status: 400 }
    );
}

console.error(
    "My orders GET error:",
    error
);

return Response.json(
    {
    error: "Failed to load orders.",
    },
    { status: 500 }
);
}
}