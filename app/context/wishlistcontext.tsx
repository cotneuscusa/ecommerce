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

import {
addProductToWishlist,
removeProductFromWishlist,
isProductInWishlist,
} from "@/lib/services/wishlist-service";

type WishlistContextType = {
wishlist: Product[];
loaded: boolean;
error: boolean;
addToWishlist: (product: Product) => Promise<void>;
removeFromWishlist: (productId: number) => Promise<void>;
isInWishlist: (productId: number) => boolean;
};

const WishlistContext = createContext<
WishlistContextType | undefined
>(undefined);

export function WishlistProvider({
children,
}: {
children: ReactNode;
}) {
const { status } = useSession();

const [wishlist, setWishlist] = useState<Product[]>([]);
const [loaded, setLoaded] = useState(false);
const [error, setError] = useState(false);

useEffect(() => {
if (status === "loading") {
    setLoaded(false);
    return;
}

if (status === "unauthenticated") {
    setWishlist([]);
    setError(false);
    setLoaded(true);
    return;
}

async function loadWishlist() {
    setLoaded(false);
    setError(false);

    try {
    const response = await fetch("/api/wishlist");

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
        data?.error || "Failed to load wishlist"
        );
    }

    const products = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : null;

    if (!products) {
        throw new Error("Invalid wishlist data");
    }

    setWishlist(products);
    } catch (error) {
    console.error(
        "Failed to load wishlist:",
        error
    );

    setWishlist([]);
    setError(true);
    } finally {
    setLoaded(true);
    }
}

loadWishlist();
}, [status]);

const saveWishlist = async (
nextWishlist: Product[]
): Promise<boolean> => {
if (status !== "authenticated") {
    return false;
}

try {
    const response = await fetch("/api/wishlist", {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        products: nextWishlist,
    }),
    });

    if (!response.ok) {
    throw new Error(
        "Failed to save wishlist"
    );
    }

    return true;
} catch (error) {
    console.error(
    "Failed to save wishlist:",
    error
    );

    return false;
}
};

const addToWishlist = async (
product: Product
) => {
if (status !== "authenticated") {
    return;
}

const nextWishlist =
    addProductToWishlist(
    wishlist,
    product
    );

if (nextWishlist === wishlist) {
    return;
}

const saved = await saveWishlist(
    nextWishlist
);

if (saved) {
    setWishlist(nextWishlist);
    setError(false);
}
};

const removeFromWishlist = async (
productId: number
) => {
if (status !== "authenticated") {
    return;
}

const nextWishlist =
    removeProductFromWishlist(
    wishlist,
    productId
    );

const saved = await saveWishlist(
    nextWishlist
);

if (saved) {
    setWishlist(nextWishlist);
    setError(false);
}
};

const isInWishlist = (
productId: number
) => {
return isProductInWishlist(
    wishlist,
    productId
);
};

return (
<WishlistContext.Provider
    value={{
    wishlist,
    loaded,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    }}
>
    {children}
</WishlistContext.Provider>
);
}

export function useWishlist() {
const context = useContext(WishlistContext);

if (!context) {
throw new Error(
    "useWishlist must be used inside WishlistProvider"
);
}

return context;
}