"use client";

import ProductCard from "./productcards";
import { Product } from "@/data/products";
import { useCart } from "@/app/context/cartcontext";

type RelatedProductsProps = {
    products: Product[];
};

export default function RelatedProducts({
    products,
}: RelatedProductsProps) {
    const { addToCart } = useCart();

    if (products.length === 0) {
    return null;
}

return (
<section className="related-products">
    <h2>Related Products</h2>

    <div className="related-products-grid">
    {products.map((product) => (
        <ProductCard
        key={product.id}
        product={product}
        onAddToCart={() => addToCart(product)}
        />
    ))}
    </div>
</section>
);
}