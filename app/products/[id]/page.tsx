import Link from "next/link";
import AddToCartButton from "@/components/addtocartbutton";
import RelatedProducts from "@/components/relatedproducts";
import WishlistButton from "@/components/wishlistbutton";
import {
getProduct,
getProducts,
} from "@/lib/services/product-service";
import type { Product } from "@/lib/types";

type ProductPageProps = {
params: Promise<{
id: string;
}>;
};

export default async function ProductPage({
params,
}: ProductPageProps) {
const { id } = await params;

const product = await getProduct(id);

if (!product) {
return (
    <main className="product-not-found">
    <h1>Product not found</h1>

    <Link href="/">
        ← Back to Store
    </Link>
    </main>
);
}

const typedProduct: Product = {
id: product.id,
name: product.name,
description: product.description,
price: product.price,
image: product.image,
category: product.category,
};

const allProducts = await getProducts();

const relatedProducts = allProducts.filter(
(item) =>
    item.category === typedProduct.category &&
    item.id !== typedProduct.id
);

return (
<main className="product-page">
    <Link href="/" className="back-link">
    ← Back to Store
    </Link>

    <div className="product-details">
    <div className="product-image">
        <img
        src={typedProduct.image}
        alt={typedProduct.name}
        />
    </div>

    <div className="product-info">
        <p className="product-label">PRODUCT</p>

        <h1>{typedProduct.name}</h1>

        <p className="product-description">
        {typedProduct.description}
        </p>

        <p className="product-price">
        ${typedProduct.price.toFixed(2)}
        </p>

        <AddToCartButton product={typedProduct} />

        <WishlistButton product={typedProduct} />
    </div>
    </div>

    <RelatedProducts products={relatedProducts} />
</main>
);
}