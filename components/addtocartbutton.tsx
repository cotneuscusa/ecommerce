"use client";

import { Product } from "@/data/products";
import { useCart } from "@/app/context/cartcontext";

type AddToCartButtonProps = {
    product: Product;
};

export default function AddToCartButton({
    product,
}: AddToCartButtonProps) {
    const { addToCart } = useCart();

    return (
    <button
        className="details-cart-button"
        onClick={() => addToCart(product)}
    >
        Add to Cart
    </button>
    );
}