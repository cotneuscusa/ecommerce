"use client";

import {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";

import { useSession } from "next-auth/react";
import type { Product } from "@/lib/types";
import type { CartItem } from "@/lib/repositories/cart";

import {
addProductToCart,
removeProductFromCart,
increaseProductQuantity,
decreaseProductQuantity,
clearCartItems,
} from "@/lib/services/cart-service";

type CartContextType = {
cart: CartItem[];
loaded: boolean;
addToCart: (product: Product) => void;
removeFromCart: (productId: number) => void;
increaseQuantity: (productId: number) => void;
decreaseQuantity: (productId: number) => void;
clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
undefined
);

export function CartProvider({
children,
}: {
children: ReactNode;
}) {
const { status } = useSession();

const [cart, setCart] = useState<CartItem[]>([]);
const [loaded, setLoaded] = useState(false);

useEffect(() => {
if (status === "loading") {
setLoaded(false);
return;
}

if (status === "unauthenticated") {
  setCart([]);
  setLoaded(true);
  return;
}

async function loadCart() {
  setLoaded(false);

  try {
    const response = await fetch("/api/cart");

    if (!response.ok) {
      throw new Error("Failed to load cart");
    }

    const data = await response.json();

    setCart(Array.isArray(data?.items) ? data.items : []);
  } catch (error) {
    console.error("Failed to load cart:", error);
    setCart([]);
  } finally {
    setLoaded(true);
  }
}

loadCart();


}, [status]);

async function saveCart(nextCart: CartItem[]) {
if (status !== "authenticated") {
return;
}


try {
  const response = await fetch("/api/cart", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: nextCart,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save cart");
  }
} catch (error) {
  console.error("Failed to save cart:", error);
}


}

const addToCart = (product: Product) => {
const nextCart = addProductToCart(cart, product);


setCart(nextCart);
saveCart(nextCart);


};

const removeFromCart = (productId: number) => {
const nextCart = removeProductFromCart(
cart,
productId
);


setCart(nextCart);
saveCart(nextCart);

};

const increaseQuantity = (productId: number) => {
const nextCart = increaseProductQuantity(
cart,
productId
);

setCart(nextCart);
saveCart(nextCart);

};

const decreaseQuantity = (productId: number) => {
const nextCart = decreaseProductQuantity(
cart,
productId
);

setCart(nextCart);
saveCart(nextCart);

};

const clearCart = () => {
const nextCart = clearCartItems();

setCart(nextCart);

if (status === "authenticated") {
  fetch("/api/cart", {
    method: "DELETE",
  }).catch((error) => {
    console.error(
      "Failed to clear cart:",
      error
    );
  });
}

};

return (
<CartContext.Provider
value={{
cart,
loaded,
addToCart,
removeFromCart,
increaseQuantity,
decreaseQuantity,
clearCart,
}}
>
{children}
</CartContext.Provider>
);
}

export function useCart() {
const context = useContext(CartContext);

if (!context) {
throw new Error(
"useCart must be used inside CartProvider"
);
}

return context;
}
