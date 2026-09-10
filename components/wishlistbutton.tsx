"use client";

import { Product } from "@/data/products";
import { useWishlist } from "@/app/context/wishlistcontext";

type WishlistButtonProps = {
    product: Product;
};

export default function WishlistButton({
    product,
}: WishlistButtonProps) {
    const {
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
    } = useWishlist();

    const saved = isInWishlist(product.id);

    const handleClick = () => {
        if (saved) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <button
            type="button"
            className="wishlist-button"
            onClick={handleClick}
            style={{
                width: "100%",
                padding: "14px 20px",
                border: saved ? "1px solid #635bff" : "1px solid #e5e7eb",
                borderRadius: "10px",
                background: saved ? "#f0efff" : "#ffffff",
                color: saved ? "#635bff" : "#111827",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
            }}
        >
            {saved ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
        </button>
    );
}