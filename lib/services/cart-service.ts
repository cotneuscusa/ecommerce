import type { Product } from "@/lib/types";
import type { CartItem } from "@/lib/repositories/cart";

const MAX_ITEM_QUANTITY = 100;

export function addProductToCart(
cart: CartItem[],
product: Product
): CartItem[] {
const existingItem = cart.find(
(item) => item.product.id === product.id
);

if (existingItem) {
return cart.map((item) =>
    item.product.id === product.id
    ? {
        ...item,
        quantity: Math.min(
            item.quantity + 1,
            MAX_ITEM_QUANTITY
        ),
        }
    : item
);
}

return [
...cart,
{
    product,
    quantity: 1,
},
];
}

export function removeProductFromCart(
cart: CartItem[],
productId: number
): CartItem[] {
return cart.filter(
(item) => item.product.id !== productId
);
}

export function increaseProductQuantity(
cart: CartItem[],
productId: number
): CartItem[] {
return cart.map((item) =>
item.product.id === productId
    ? {
        ...item,
        quantity: Math.min(
        item.quantity + 1,
        MAX_ITEM_QUANTITY
        ),
    }
    : item
);
}

export function decreaseProductQuantity(
cart: CartItem[],
productId: number
): CartItem[] {
return cart
.map((item) =>
    item.product.id === productId
    ? {
        ...item,
        quantity: item.quantity - 1,
        }
    : item
)
.filter((item) => item.quantity > 0);
}

export function clearCartItems(): CartItem[] {
return [];
}