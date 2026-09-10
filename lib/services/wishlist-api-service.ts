import type { Product } from "@/lib/types";

import {
getWishlist,
saveWishlist,
clearWishlist,
} from "@/lib/repositories/wishlist";

const MAX_WISHLIST_ITEMS = 100;

export async function getUserWishlist(
userId: string
): Promise<Product[]> {
return getWishlist(userId);
}

export async function saveUserWishlist(
userId: string,
products: Product[]
): Promise<Product[]> {
if (products.length > MAX_WISHLIST_ITEMS) {
throw new Error(
    "Your wishlist contains too many items."
);
}

const productIds = new Set<number>();

for (const product of products) {
if (
    !product ||
    typeof product !== "object"
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

if (
    !Number.isInteger(product.id) ||
    product.id <= 0 ||
    productIds.has(product.id)
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

if (
    typeof product.name !== "string" ||
    product.name.trim() === ""
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

if (
    typeof product.description !==
    "string"
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

if (
    !Number.isFinite(product.price) ||
    product.price < 0
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

if (
    typeof product.image !== "string" ||
    product.image.trim() === ""
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

if (
    typeof product.category !== "string" ||
    product.category.trim() === ""
) {
    throw new Error(
    "Invalid wishlist product."
    );
}

productIds.add(product.id);
}

return saveWishlist(
userId,
products
);
}

export async function clearUserWishlist(
userId: string
): Promise<void> {
await clearWishlist(userId);
}