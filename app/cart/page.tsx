"use client";

import Link from "next/link";
import { useCart } from "../context/cartcontext";

export default function CartPage() {
const {
cart,
removeFromCart,
increaseQuantity,
decreaseQuantity,
clearCart,
} = useCart();

const cartCount = cart.reduce(
(total, item) => total + item.quantity,
0
);

const cartTotal = cart.reduce(
(total, item) =>
total + item.product.price * item.quantity,
0
);

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

<div style={{ marginBottom: "35px" }}>
    <p
    style={{
        margin: "0 0 8px",
        color: "#635bff",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "1.8px",
    }}
    >
    YOUR SHOPPING BAG
    </p>

    <h1
    style={{
        margin: "0 0 10px",
        color: "#111827",
        fontSize: "40px",
        lineHeight: "1.15",
        letterSpacing: "-1.5px",
    }}
    >
    Shopping Cart
    </h1>

    <p
    style={{
        margin: 0,
        color: "#667085",
        fontSize: "16px",
    }}
    >
    {cartCount === 0
        ? "Your cart is currently empty."
        : `${cartCount} item${cartCount === 1 ? "" : "s"} in your cart.`}
    </p>
</div>

{cart.length === 0 ? (
    <div
    style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        padding: "70px 30px",
        textAlign: "center",
        boxShadow: "0 10px 35px rgba(15, 23, 42, 0.06)",
    }}
    >
    <div
        style={{
        width: "70px",
        height: "70px",
        margin: "0 auto 20px",
        borderRadius: "50%",
        background: "#f0efff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        }}
    >
        🛒
    </div>

    <h2
        style={{
        margin: "0 0 10px",
        color: "#111827",
        fontSize: "25px",
        }}
    >
        Your cart is empty
    </h2>

    <p
        style={{
        margin: "0 auto 28px",
        maxWidth: "450px",
        color: "#667085",
        fontSize: "15px",
        lineHeight: "1.6",
        }}
    >
        You haven't added anything to your cart yet.
        Browse our products and find something you like.
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
        Continue Shopping
    </Link>
    </div>
) : (
    <div
    style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 330px",
        gap: "24px",
        alignItems: "start",
    }}
    >
    <div
        style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        }}
    >
        {cart.map((item) => (
        <div
            key={item.product.id}
            style={{
            display: "grid",
            gridTemplateColumns: "120px minmax(0, 1fr) auto",
            gap: "20px",
            alignItems: "center",
            padding: "18px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
            }}
        >
            <div
            style={{
                width: "120px",
                height: "110px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#f3f4f6",
            }}
            >
            <img
                src={item.product.image}
                alt={item.product.name}
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
                minWidth: 0,
            }}
            >
            <p
                style={{
                margin: "0 0 6px",
                color: "#635bff",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                }}
            >
                {item.product.category}
            </p>

            <h2
                style={{
                margin: "0 0 7px",
                color: "#111827",
                fontSize: "18px",
                lineHeight: "1.3",
                }}
            >
                {item.product.name}
            </h2>

            <p
                style={{
                margin: "0 0 12px",
                color: "#667085",
                fontSize: "14px",
                lineHeight: "1.5",
                }}
            >
                ${item.product.price.toFixed(2)} each
            </p>

            <div
                style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                }}
            >
                <button
                type="button"
                onClick={() =>
                    decreaseQuantity(item.product.id)
                }
                style={{
                    width: "32px",
                    height: "32px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
                >
                −
                </button>

                <span
                style={{
                    minWidth: "28px",
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "700",
                    textAlign: "center",
                }}
                >
                {item.quantity}
                </span>

                <button
                type="button"
                onClick={() =>
                    increaseQuantity(item.product.id)
                }
                style={{
                    width: "32px",
                    height: "32px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
                >
                +
                </button>
            </div>
            </div>

            <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "15px",
            }}
            >
            <strong
                style={{
                color: "#111827",
                fontSize: "18px",
                }}
            >
                $
                {(
                item.product.price * item.quantity
                ).toFixed(2)}
            </strong>

            <button
                type="button"
                onClick={() =>
                removeFromCart(item.product.id)
                }
                style={{
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#b42318",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                }}
            >
                Remove
            </button>
            </div>
        </div>
        ))}
    </div>

    <aside
        style={{
        position: "sticky",
        top: "24px",
        padding: "26px",
        background: "#111827",
        borderRadius: "18px",
        color: "#ffffff",
        boxShadow: "0 15px 40px rgba(15, 23, 42, 0.15)",
        }}
    >
        <p
        style={{
            margin: "0 0 8px",
            color: "#a5b4fc",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "1.5px",
        }}
        >
        ORDER SUMMARY
        </p>

        <h2
        style={{
            margin: "0 0 25px",
            fontSize: "24px",
        }}
        >
        Your Order
        </h2>

        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "15px",
            borderBottom: "1px solid #374151",
            color: "#d1d5db",
            fontSize: "14px",
        }}
        >
        <span>Items</span>
        <span>{cartCount}</span>
        </div>

        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "18px",
            marginBottom: "24px",
        }}
        >
        <span
            style={{
            color: "#d1d5db",
            fontSize: "14px",
            }}
        >
            Total
        </span>

        <strong
            style={{
            fontSize: "25px",
            }}
        >
            ${cartTotal.toFixed(2)}
        </strong>
        </div>

        <Link
        href="/checkout"
        style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "14px",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#111827",
            fontSize: "14px",
            fontWeight: "800",
            textAlign: "center",
            textDecoration: "none",
        }}
        >
        Proceed to Checkout
        </Link>

        <button
        type="button"
        onClick={clearCart}
        style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            border: "1px solid #4b5563",
            borderRadius: "10px",
            background: "transparent",
            color: "#d1d5db",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
        }}
        >
        Clear Cart
        </button>

        <Link
        href="/"
        style={{
            display: "block",
            marginTop: "18px",
            color: "#9ca3af",
            fontSize: "13px",
            textAlign: "center",
            textDecoration: "none",
        }}
        >
        Continue Shopping
        </Link>
    </aside>
    </div>
)}
</div>
</main>

);
}