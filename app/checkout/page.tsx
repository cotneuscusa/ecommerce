"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "../context/cartcontext";

type CustomerInfo = {
    name: string;
    email: string;
    address: string;
    city: string;
    postal: string;
};

export default function CheckoutPage() {
    const { data: session, status } = useSession();

    const {
        cart,
        clearCart,
    } = useCart();

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        address: "",
        city: "",
        postal: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [idempotencyKey] = useState(() => crypto.randomUUID());

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartTotal = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    function updateCustomerInfo(
        field: keyof CustomerInfo,
        value: string
    ) {
        setCustomerInfo((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer: customerInfo,
                    idempotencyKey,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to place order."
                );
            }

            setOrderId(data.order?.id ?? "");
            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to place order."
            );
        } finally {
            setLoading(false);
        }
    }

    if (status === "loading") {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fb",
                    color: "#667085",
                }}
            >
                Loading checkout...
            </main>
        );
    }

    if (!session) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb",
                    padding: "60px 20px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        maxWidth: "520px",
                        margin: "0 auto",
                        padding: "50px 40px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "20px",
                        textAlign: "center",
                        boxShadow:
                            "0 15px 45px rgba(15, 23, 42, 0.08)",
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            margin: "0 auto 20px",
                            borderRadius: "50%",
                            background: "#f0efff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                        }}
                    >
                        🔐
                    </div>

                    <h1
                        style={{
                            margin: "0 0 10px",
                            color: "#111827",
                            fontSize: "30px",
                        }}
                    >
                        Sign in to checkout
                    </h1>

                    <p
                        style={{
                            margin: "0 0 28px",
                            color: "#667085",
                            lineHeight: "1.6",
                        }}
                    >
                        You need to be signed in before placing an
                        order.
                    </p>

                    <Link
                        href="/login"
                        style={{
                            display: "inline-block",
                            padding: "14px 28px",
                            borderRadius: "10px",
                            background: "#111827",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        Sign in
                    </Link>

                    <Link
                        href="/cart"
                        style={{
                            display: "block",
                            marginTop: "20px",
                            color: "#667085",
                            fontSize: "14px",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}
                    >
                        ← Back to Cart
                    </Link>
                </div>
            </main>
        );
    }

    if (orderPlaced) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb",
                    padding: "70px 20px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto",
                        padding: "55px 40px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "22px",
                        textAlign: "center",
                        boxShadow:
                            "0 15px 50px rgba(15, 23, 42, 0.08)",
                    }}
                >
                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            margin: "0 auto 22px",
                            borderRadius: "50%",
                            background: "#ecfdf3",
                            color: "#027a48",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px",
                            fontWeight: "800",
                        }}
                    >
                        ✓
                    </div>

                    <p
                        style={{
                            margin: "0 0 8px",
                            color: "#635bff",
                            fontSize: "12px",
                            fontWeight: "800",
                            letterSpacing: "1.6px",
                        }}
                    >
                        ORDER CONFIRMED
                    </p>

                    <h1
                        style={{
                            margin: "0 0 12px",
                            color: "#111827",
                            fontSize: "34px",
                            letterSpacing: "-1px",
                        }}
                    >
                        Thank you for your order!
                    </h1>

                    <p
                        style={{
                            margin: "0 0 20px",
                            color: "#667085",
                            fontSize: "15px",
                            lineHeight: "1.6",
                        }}
                    >
                        Your order has been successfully placed.
                    </p>

                    {orderId && (
                        <div
                            style={{
                                marginBottom: "28px",
                                padding: "14px",
                                borderRadius: "10px",
                                background: "#f8fafc",
                                color: "#475467",
                                fontSize: "13px",
                            }}
                        >
                            Order ID: <strong>{orderId}</strong>
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        <Link
                            href="/orders"
                            style={{
                                padding: "13px 22px",
                                borderRadius: "10px",
                                background: "#111827",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: "700",
                                textDecoration: "none",
                            }}
                        >
                            View My Orders
                        </Link>

                        <Link
                            href="/"
                            style={{
                                padding: "13px 22px",
                                borderRadius: "10px",
                                border: "1px solid #d1d5db",
                                background: "#ffffff",
                                color: "#111827",
                                fontSize: "14px",
                                fontWeight: "700",
                                textDecoration: "none",
                            }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb",
                    padding: "70px 20px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        maxWidth: "520px",
                        margin: "0 auto",
                        padding: "55px 40px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "20px",
                        textAlign: "center",
                        boxShadow:
                            "0 15px 45px rgba(15, 23, 42, 0.07)",
                    }}
                >
                    <div
                        style={{
                            fontSize: "44px",
                            marginBottom: "18px",
                        }}
                    >
                        🛒
                    </div>

                    <h1
                        style={{
                            margin: "0 0 10px",
                            color: "#111827",
                            fontSize: "30px",
                        }}
                    >
                        Your cart is empty
                    </h1>

                    <p
                        style={{
                            margin: "0 0 28px",
                            color: "#667085",
                            lineHeight: "1.6",
                        }}
                    >
                        Add some products to your cart before
                        checking out.
                    </p>

                    <Link
                        href="/cart"
                        style={{
                            display: "inline-block",
                            padding: "14px 25px",
                            borderRadius: "10px",
                            background: "#111827",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        Back to Cart
                    </Link>
                </div>
            </main>
        );
    }

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
                    href="/cart"
                    style={{
                        display: "inline-block",
                        marginBottom: "35px",
                        color: "#667085",
                        fontSize: "14px",
                        fontWeight: "600",
                        textDecoration: "none",
                    }}
                >
                    ← Back to Cart
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
                        SECURE CHECKOUT
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
                        Complete your order
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#667085",
                            fontSize: "16px",
                        }}
                    >
                        Enter your information and review your order.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(0, 1fr) 350px",
                            gap: "24px",
                            alignItems: "start",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <section
                                style={{
                                    padding: "28px",
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "18px",
                                    boxShadow:
                                        "0 6px 20px rgba(15, 23, 42, 0.04)",
                                }}
                            >
                                <h2
                                    style={{
                                        margin: "0 0 6px",
                                        color: "#111827",
                                        fontSize: "21px",
                                    }}
                                >
                                    Customer Information
                                </h2>

                                <p
                                    style={{
                                        margin: "0 0 24px",
                                        color: "#667085",
                                        fontSize: "14px",
                                    }}
                                >
                                    Where should we send your order?
                                </p>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(2, minmax(0, 1fr))",
                                        gap: "18px",
                                    }}
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Full name
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            value={customerInfo.name}
                                            onChange={(event) =>
                                                updateCustomerInfo(
                                                    "name",
                                                    event.target.value
                                                )
                                            }
                                            required
                                            style={{
                                                width: "100%",
                                                boxSizing: "border-box",
                                                padding: "13px 14px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "10px",
                                                background: "#ffffff",
                                                color: "#111827",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Email
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(event) =>
                                                updateCustomerInfo(
                                                    "email",
                                                    event.target.value
                                                )
                                            }
                                            required
                                            style={{
                                                width: "100%",
                                                boxSizing: "border-box",
                                                padding: "13px 14px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "10px",
                                                background: "#ffffff",
                                                color: "#111827",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            gridColumn: "1 / -1",
                                        }}
                                    >
                                        <label
                                            htmlFor="address"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Address
                                        </label>

                                        <input
                                            id="address"
                                            type="text"
                                            value={customerInfo.address}
                                            onChange={(event) =>
                                                updateCustomerInfo(
                                                    "address",
                                                    event.target.value
                                                )
                                            }
                                            required
                                            style={{
                                                width: "100%",
                                                boxSizing: "border-box",
                                                padding: "13px 14px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "10px",
                                                background: "#ffffff",
                                                color: "#111827",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            City
                                        </label>

                                        <input
                                            id="city"
                                            type="text"
                                            value={customerInfo.city}
                                            onChange={(event) =>
                                                updateCustomerInfo(
                                                    "city",
                                                    event.target.value
                                                )
                                            }
                                            required
                                            style={{
                                                width: "100%",
                                                boxSizing: "border-box",
                                                padding: "13px 14px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "10px",
                                                background: "#ffffff",
                                                color: "#111827",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="postal"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Postal code
                                        </label>

                                        <input
                                            id="postal"
                                            type="text"
                                            value={customerInfo.postal}
                                            onChange={(event) =>
                                                updateCustomerInfo(
                                                    "postal",
                                                    event.target.value
                                                )
                                            }
                                            required
                                            style={{
                                                width: "100%",
                                                boxSizing: "border-box",
                                                padding: "13px 14px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "10px",
                                                background: "#ffffff",
                                                color: "#111827",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            {error && (
                                <div
                                    style={{
                                        padding: "14px 16px",
                                        border: "1px solid #fecaca",
                                        borderRadius: "12px",
                                        background: "#fef2f2",
                                        color: "#b42318",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {error}
                                </div>
                            )}
                        </div>

                        <aside
                            style={{
                                position: "sticky",
                                top: "24px",
                                padding: "26px",
                                background: "#111827",
                                borderRadius: "18px",
                                color: "#ffffff",
                                boxShadow:
                                    "0 15px 40px rgba(15, 23, 42, 0.15)",
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
                                    margin: "0 0 22px",
                                    fontSize: "24px",
                                }}
                            >
                                Your Order
                            </h2>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px",
                                    marginBottom: "22px",
                                }}
                            >
                                {cart.map((item) => (
                                    <div
                                        key={item.product.id}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "54px minmax(0, 1fr)",
                                            gap: "12px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            style={{
                                                width: "54px",
                                                height: "54px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                background: "#374151",
                                            }}
                                        />

                                        <div
                                            style={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: "0 0 3px",
                                                    color: "#ffffff",
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {item.product.name}
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: "#9ca3af",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {item.quantity} × $
                                                {item.product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    paddingTop: "18px",
                                    borderTop: "1px solid #374151",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "10px",
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
                                        marginBottom: "22px",
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        border: "none",
                                        borderRadius: "10px",
                                        background: "#ffffff",
                                        color: "#111827",
                                        fontSize: "14px",
                                        fontWeight: "800",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: loading ? 0.65 : 1,
                                    }}
                                >
                                    {loading
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>
                            </div>
                        </aside>
                    </div>
                </form>
            </div>
        </main>
    );
}