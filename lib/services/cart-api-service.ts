import type { Product } from "@/lib/types";

import {
getCart,
saveCart,
clearCart,
type CartItem,
} from "@/lib/repositories/cart";

const MAX_ITEM_QUANTITY = 100;
const MAX_CART_ITEMS = 50;

export async function getUserCart(
userId: string
): Promise<CartItem[]> {
return getCart(userId);
}

export async function saveUserCart(
userId: string,
items: CartItem[]
): Promise<CartItem[]> {
if (items.length > MAX_CART_ITEMS) {
throw new Error(
    "Your cart contains too many items."
);
}

const productIds = new Set<number>();

for (const item of items) {
if (
    !item ||
    typeof item !== "object" ||
    !item.product ||
    typeof item.product !== "object"
) {
    throw new Error("Invalid cart item.");
}

const product = item.product as Product;
const quantity = item.quantity;

if (
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity > MAX_ITEM_QUANTITY
) {
    throw new Error("Invalid cart item.");
}

if (
    !Number.isInteger(product.id) ||
    product.id <= 0 ||
    productIds.has(product.id)
) {
    throw new Error("Invalid cart item.");
}

productIds.add(product.id);
}

return saveCart(userId, items);
}

export async function clearUserCart(
userId: string
): Promise<void> {
await clearCart(userId);
}