"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/app/context/wishlistcontext";

export default function WishlistPage() {
const { data: session, status } = useSession();
const { wishlist, removeFromWishlist } = useWishlist();

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (status === "loading") {
    return;
}

if (!session) {
    setProducts([]);
    setLoading(false);
    return;
}

const loadWishlist = async () => {
    try {
    setLoading(true);

    const response = await fetch("/api/wishlist");

    if (!response.ok) {
        throw new Error("Failed to load wishlist");
    }

    const data = await response.json();

    const wishlistProducts: Product[] = Array.isArray(data)
        ? data
        : data.products ?? data.items ?? [];

    setProducts(wishlistProducts);
    } catch (error) {
    console.error("Failed to load wishlist:", error);
    setProducts([]);
    } finally {
    setLoading(false);
    }
};

loadWishlist();
}, [session, status, wishlist]);

const handleRemove = async (productId: number) => {
try {
    await removeFromWishlist(productId);

    setProducts((currentProducts) =>
    currentProducts.filter(
        (product) => String(product.id) !== String(productId)
    )
    );
} catch (error) {
    console.error("Failed to remove item from wishlist:", error);
}
};

if (status === "loading" || loading) {
return (
    <main
    style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px 80px",
        boxSizing: "border-box",
    }}
    >
    <div
        style={{
        maxWidth: "1100px",
        margin: "0 auto",
        }}
    >
        <Link
        href="/"
        style={{
            display: "inline-block",
            marginBottom: "35px",
            color: "#667085",
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "none",
        }}
        >
        ← Back to Store
        </Link>

        <div style={{ marginBottom: "35px" }}>
        <p
            style={{
            margin: "0 0 8px",
            color: "#635bff",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "1.8px",
            }}
        >
            YOUR FAVORITES
        </p>

        <h1
            style={{
            margin: "0 0 10px",
            color: "#111827",
            fontSize: "40px",
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
            }}
        >
            Wishlist
        </h1>

        <p
            style={{
            margin: 0,
            color: "#667085",
            fontSize: "16px",
            }}
        >
            Loading your saved products...
        </p>
        </div>

        <div
        style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "70px 30px",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(15, 23, 42, 0.06)",
        }}
        >
        <div
            style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#f0efff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            }}
        >
            ♡
        </div>

        <h2
            style={{
            margin: "0",
            color: "#111827",
            fontSize: "25px",
            }}
        >
            Loading...
        </h2>
        </div>
    </div>
    </main>
);
}

if (!session) {
return (
    <main
    style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px 80px",
        boxSizing: "border-box",
    }}
    >
    <div
        style={{
        maxWidth: "1100px",
        margin: "0 auto",
        }}
    >
        <Link
        href="/"
        style={{
            display: "inline-block",
            marginBottom: "35px",
            color: "#667085",
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "none",
        }}
        >
        ← Back to Store
        </Link>

        <div style={{ marginBottom: "35px" }}>
        <p
            style={{
            margin: "0 0 8px",
            color: "#635bff",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "1.8px",
            }}
        >
            YOUR FAVORITES
        </p>

        <h1
            style={{
            margin: "0 0 10px",
            color: "#111827",
            fontSize: "40px",
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
            }}
        >
            Wishlist
        </h1>

        <p
            style={{
            margin: 0,
            color: "#667085",
            fontSize: "16px",
            }}
        >
            Save products you want to come back to later.
        </p>
        </div>

        <div
        style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "70px 30px",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(15, 23, 42, 0.06)",
        }}
        >
        <div
            style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#f0efff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            color: "#635bff",
            }}
        >
            ♡
        </div>

        <h2
            style={{
            margin: "0 0 10px",
            color: "#111827",
            fontSize: "25px",
            }}
        >
            Sign in to view your wishlist
        </h2>

        <p
            style={{
            margin: "0 auto 28px",
            maxWidth: "450px",
            color: "#667085",
            fontSize: "15px",
            lineHeight: "1.6",
            }}
        >
            Your wishlist is saved to your account. Sign in to see the
            products you have saved.
        </p>

        <Link
            href="/login"
            style={{
            display: "inline-block",
            padding: "13px 24px",
            borderRadius: "10px",
            background: "#111827",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            textDecoration: "none",
            }}
        >
            Sign In
        </Link>
        </div>
    </div>
    </main>
);
}

return (
<main
    style={{
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px 80px",
    boxSizing: "border-box",
    }}
>
    <div
    style={{
        maxWidth: "1100px",
        margin: "0 auto",
    }}
    >
    <Link
        href="/"
        style={{
        display: "inline-block",
        marginBottom: "35px",
        color: "#667085",
        fontSize: "14px",
        fontWeight: "600",
        textDecoration: "none",
        }}
    >
        ← Back to Store
    </Link>

    <div style={{ marginBottom: "35px" }}>
        <p
        style={{
            margin: "0 0 8px",
            color: "#635bff",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "1.8px",
        }}
        >
        YOUR FAVORITES
        </p>

        <h1
        style={{
            margin: "0 0 10px",
            color: "#111827",
            fontSize: "40px",
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
        }}
        >
        Wishlist
        </h1>

        <p
        style={{
            margin: 0,
            color: "#667085",
            fontSize: "16px",
        }}
        >
        {products.length === 0
            ? "Your wishlist is currently empty."
            : `${products.length} saved product${
                products.length === 1 ? "" : "s"
            }.`}
        </p>
    </div>

    {products.length === 0 ? (
        <div
        style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "70px 30px",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(15, 23, 42, 0.06)",
        }}
        >
        <div
            style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#f0efff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            color: "#635bff",
            }}
        >
            ♡
        </div>

        <h2
            style={{
            margin: "0 0 10px",
            color: "#111827",
            fontSize: "25px",
            }}
        >
            Your wishlist is empty
        </h2>

        <p
            style={{
            margin: "0 auto 28px",
            maxWidth: "450px",
            color: "#667085",
            fontSize: "15px",
            lineHeight: "1.6",
            }}
        >
            You haven't saved anything yet. Browse our products and add
            something you would like to keep for later.
        </p>

        <Link
            href="/"
            style={{
            display: "inline-block",
            padding: "13px 24px",
            borderRadius: "10px",
            background: "#111827",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            textDecoration: "none",
            }}
        >
            Continue Shopping
        </Link>
        </div>
    ) : (
        <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px",
        }}
        >
        {products.map((product) => (
            <div
            key={product.id}
            style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
            }}
            >
            <Link
                href={`/products/${product.id}`}
                style={{
                display: "block",
                textDecoration: "none",
                }}
            >
                <div
                style={{
                    width: "100%",
                    height: "240px",
                    background: "#f3f4f6",
                    overflow: "hidden",
                }}
                >
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    }}
                />
                </div>
            </Link>

            <div
                style={{
                padding: "20px",
                }}
            >
                <p
                style={{
                    margin: "0 0 6px",
                    color: "#635bff",
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                }}
                >
                {product.category}
                </p>

                <Link
                href={`/products/${product.id}`}
                style={{
                    textDecoration: "none",
                }}
                >
                <h2
                    style={{
                    margin: "0 0 8px",
                    color: "#111827",
                    fontSize: "18px",
                    lineHeight: "1.3",
                    }}
                >
                    {product.name}
                </h2>
                </Link>

                <p
                style={{
                    margin: "0 0 18px",
                    color: "#111827",
                    fontSize: "18px",
                    fontWeight: "800",
                }}
                >
                ${product.price.toFixed(2)}
                </p>

                <button
                type="button"
                onClick={() => handleRemove(product.id)}
                style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#b42318",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                }}
                >
                Remove from Wishlist
                </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </div>
</main>
);
}