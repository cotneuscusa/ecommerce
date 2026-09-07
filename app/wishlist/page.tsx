"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../context/wishlistcontext";
import { useCart } from "../context/cartcontext";

export default function WishlistPage() {
const {
wishlist,
loaded,
error,
removeFromWishlist,
} = useWishlist();

const { addToCart } = useCart();

return (
<main className="wishlist-page">
    <Link
    href="/"
    className="back-link"
    >
    ← Back to Store
    </Link>

    <h1>My Wishlist</h1>

    {!loaded ? (
    <div className="wishlist-empty">
        <h2>Loading wishlist...</h2>
    </div>
    ) : error ? (
    <div className="wishlist-empty">
        <h2>Unable to load wishlist</h2>

        <p>
        Please refresh the page and try again.
        </p>

        <Link href="/">
        Back to Store
        </Link>
    </div>
    ) : wishlist.length === 0 ? (
    <div className="wishlist-empty">
        <h2>Your wishlist is empty</h2>

        <p>
        Save products you like and find them
        here later.
        </p>

        <Link href="/">
        Continue Shopping
        </Link>
    </div>
    ) : (
    <div className="wishlist-grid">
        {wishlist.map((product) => (
        <article
            className="wishlist-card"
            key={product.id}
        >
            <Link
            href={`/products/${product.id}`}
            className="wishlist-card-link"
            >
            <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
            />

            <h2>{product.name}</h2>
            </Link>

            <p>{product.description}</p>

            <strong>
            ${product.price.toFixed(2)}
            </strong>

            <div className="wishlist-card-actions">
            <button
                type="button"
                onClick={() =>
                addToCart(product)
                }
            >
                Add to Cart
            </button>

            <button
                type="button"
                onClick={() =>
                removeFromWishlist(
                    product.id
                )
                }
            >
                Remove
            </button>
            </div>
        </article>
        ))}
    </div>
    )}
</main>
);
}