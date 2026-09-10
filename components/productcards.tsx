"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useWishlist } from "@/app/context/wishlistcontext";

type ProductCardProps = {
product: Product;
onAddToCart: () => void;
};

export default function ProductCard({
product,
onAddToCart,
}: ProductCardProps) {
const {
addToWishlist,
removeFromWishlist,
isInWishlist,
} = useWishlist();

const saved = isInWishlist(product.id);

const handleWishlistClick = () => {
if (saved) {
    removeFromWishlist(product.id);
} else {
    addToWishlist(product);
}
};

return (
<article
    className="product-card"
    style={{
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
        "0 8px 25px rgba(15, 23, 42, 0.05)",
    transition:
        "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    }}
>
    <div
    style={{
        position: "relative",
        width: "100%",
        height: "250px",
        background: "#f3f4f6",
        overflow: "hidden",
    }}
    >
    <Link
        href={`/products/${product.id}`}
        style={{
        display: "block",
        width: "100%",
        height: "100%",
        }}
    >
        <Image
        src={product.image}
        alt={product.name}
        width={500}
        height={400}
        style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
        }}
        />
    </Link>

    <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={
        saved
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        width: "40px",
        height: "40px",
        padding: 0,
        border: "1px solid rgba(255, 255, 255, 0.8)",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.94)",
        color: saved ? "#635bff" : "#667085",
        fontSize: "21px",
        lineHeight: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow:
            "0 5px 15px rgba(15, 23, 42, 0.12)",
        }}
    >
        {saved ? "♥" : "♡"}
    </button>
    </div>

    <div
    style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    }}
    >
    <span
        style={{
        marginBottom: "7px",
        color: "#635bff",
        fontSize: "11px",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "1px",
        }}
    >
        {product.category}
    </span>

    <Link
        href={`/products/${product.id}`}
        style={{
        textDecoration: "none",
        }}
    >
        <h3
        style={{
            margin: "0 0 9px",
            color: "#111827",
            fontSize: "19px",
            lineHeight: "1.3",
            fontWeight: "750",
        }}
        >
        {product.name}
        </h3>
    </Link>

    <p
        style={{
        margin: "0 0 20px",
        color: "#667085",
        fontSize: "14px",
        lineHeight: "1.55",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        }}
    >
        {product.description}
    </p>

    <div
        style={{
        marginTop: "auto",
        paddingTop: "16px",
        borderTop: "1px solid #eef0f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        }}
    >
        <strong
        style={{
            color: "#111827",
            fontSize: "20px",
            fontWeight: "800",
            whiteSpace: "nowrap",
        }}
        >
        ${product.price.toFixed(2)}
        </strong>

        <button
        type="button"
        onClick={onAddToCart}
        style={{
            padding: "11px 15px",
            border: "none",
            borderRadius: "9px",
            background: "#111827",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            whiteSpace: "nowrap",
        }}
        >
        Add to Cart
        </button>
    </div>
    </div>
</article>
);
}