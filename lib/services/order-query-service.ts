import {
getOrdersByUserId,
type Order,
} from "@/lib/repositories/orders";

export async function getUserOrders(
userId: string
): Promise<Order[]> {
if (
    typeof userId !== "string" ||
    userId.trim() === ""
) {
    throw new Error("Invalid user ID.");
}

return getOrdersByUserId(userId);
}