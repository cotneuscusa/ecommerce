import { auth } from "@/auth";
import { getOrdersByUserId } from "@/lib/repositories/orders";

export async function GET() {
try {
const session = await auth();

if (!session?.user?.id) {
    return Response.json(
    { error: "You must be logged in." },
    { status: 401 }
    );
}

const orders = await getOrdersByUserId(
    session.user.id
);

return Response.json(orders);
} catch (error) {
console.error("Order history error:", error);

return Response.json(
    { error: "Failed to fetch orders." },
    { status: 500 }
);
}
}