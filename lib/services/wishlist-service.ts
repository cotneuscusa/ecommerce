import type { Product } from "@/lib/types";

export function addProductToWishlist(
wishlist: Product[],
product: Product
): Product[] {
const alreadyExists = wishlist.some(
(item) => item.id === product.id
);

if (alreadyExists) {
return wishlist;
}

return [...wishlist, product];
}

export function removeProductFromWishlist(
wishlist: Product[],
productId: number
): Product[] {
return wishlist.filter(
(product) => product.id !== productId
);
}

export function isProductInWishlist(
wishlist: Product[],
productId: number
): boolean {
return wishlist.some(
(product) => product.id === productId
);
}