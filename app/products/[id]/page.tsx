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

        <div
        style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "80px 30px",
            textAlign: "center",
            boxShadow:
            "0 10px 35px rgba(15, 23, 42, 0.06)",
        }}
        >
        <div
            style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b42318",
            fontSize: "30px",
            fontWeight: "500",
            }}
        >
            ×
        </div>

        <h1
            style={{
            margin: "0 0 10px",
            color: "#111827",
            fontSize: "30px",
            lineHeight: "1.2",
            }}
        >
            Product not found
        </h1>

        <p
            style={{
            maxWidth: "500px",
            margin: "0 auto 28px",
            color: "#667085",
            fontSize: "15px",
            lineHeight: "1.6",
            }}
        >
            The product you are looking for may have
            been removed or is no longer available.
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
            Back to Store
        </Link>
        </div>
    </div>
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
<main
    style={{
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px 90px",
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

    <section
        style={{
        display: "grid",
        gridTemplateColumns:
            "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: "45px",
        alignItems: "center",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "22px",
        padding: "24px",
        boxShadow:
            "0 10px 35px rgba(15, 23, 42, 0.06)",
        }}
    >
        <div
        style={{
            width: "100%",
            height: "520px",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#f3f4f6",
        }}
        >
        <img
            src={typedProduct.image}
            alt={typedProduct.name}
            style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            }}
        />
        </div>

        <div
        style={{
            padding: "20px 20px 20px 0",
            minWidth: 0,
        }}
        >
        <p
            style={{
            margin: "0 0 10px",
            color: "#635bff",
            fontSize: "12px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "1.6px",
            }}
        >
            {typedProduct.category || "PRODUCT"}
        </p>

        <h1
            style={{
            margin: "0 0 18px",
            color: "#111827",
            fontSize: "42px",
            lineHeight: "1.12",
            letterSpacing: "-1.5px",
            fontWeight: "800",
            }}
        >
            {typedProduct.name}
        </h1>

        <p
            style={{
            margin: "0 0 28px",
            color: "#667085",
            fontSize: "16px",
            lineHeight: "1.7",
            }}
        >
            {typedProduct.description}
        </p>

        <div
            style={{
            height: "1px",
            background: "#e5e7eb",
            marginBottom: "25px",
            }}
        />

        <div
            style={{
            marginBottom: "25px",
            }}
        >
            <span
            style={{
                display: "block",
                marginBottom: "7px",
                color: "#667085",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
            }}
            >
            Price
            </span>

            <strong
            style={{
                color: "#111827",
                fontSize: "32px",
                lineHeight: "1",
                fontWeight: "800",
            }}
            >
            ${typedProduct.price.toFixed(2)}
            </strong>
        </div>

        <div
            style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            }}
        >
            <AddToCartButton product={typedProduct} />

            <WishlistButton product={typedProduct} />
        </div>
        </div>
    </section>

    {relatedProducts.length > 0 && (
        <section
        style={{
            marginTop: "70px",
        }}
        >
        <div
            style={{
            marginBottom: "28px",
            }}
        >
            <p
            style={{
                margin: "0 0 8px",
                color: "#635bff",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "1.8px",
            }}
            >
            YOU MAY ALSO LIKE
            </p>

            <h2
            style={{
                margin: "0",
                color: "#111827",
                fontSize: "32px",
                lineHeight: "1.2",
                letterSpacing: "-1px",
            }}
            >
            Related Products
            </h2>
        </div>

        <RelatedProducts products={relatedProducts} />
        </section>
    )}
    </div>

    <style>
    {`
        @media (max-width: 800px) {
        .product-main-layout {
            grid-template-columns: 1fr !important;
        }
        }
    `}
    </style>
</main>
);
}