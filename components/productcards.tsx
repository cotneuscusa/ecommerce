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
<article className="product-card">
    <Link
    href={`/products/${product.id}`}
    className="product-card-link"
    >
    <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        className="product-card-image"
    />

    <h3>{product.name}</h3>
    </Link>

    <p className="product-card-description">
    {product.description}
    </p>

    <div className="product-card-bottom">
    <strong>${product.price.toFixed(2)}</strong>

    <div className="product-card-actions">
        <button
        type="button"
        className="wishlist-card-button"
        onClick={handleWishlistClick}
        aria-label={
            saved
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        >
        {saved ? "♥" : "♡"}
        </button>

        <button
        type="button"
        onClick={onAddToCart}
        >
        Add to Cart
        </button>
    </div>
    </div>
</article>
);
}