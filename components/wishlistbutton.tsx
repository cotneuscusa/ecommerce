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
>
    {saved ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
</button>
);
}