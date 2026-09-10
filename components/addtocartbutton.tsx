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
            type="button"
            className="details-cart-button"
            onClick={() => addToCart(product)}
            style={{
                width: "100%",
                padding: "14px 20px",
                border: "none",
                borderRadius: "10px",
                background: "#111827",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
            }}
        >
            Add to Cart
        </button>
    );
}