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
const { status } = useSession();

const {
cart,
clearCart,
removeFromCart,
increaseQuantity,
decreaseQuantity,
} = useCart();

const [orderPlaced, setOrderPlaced] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [customerInfo, setCustomerInfo] =
useState<CustomerInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
});

const [orderName, setOrderName] = useState("");
const [orderEmail, setOrderEmail] = useState("");
const [orderNumber, setOrderNumber] = useState("");

const cartCount = cart.reduce(
(total, item) => total + item.quantity,
0
);

const cartTotal = cart.reduce(
(total, item) =>
    total + item.product.price * item.quantity,
0
);

const handleChange = (
event: React.ChangeEvent<HTMLInputElement>
) => {
const { name, value } = event.target;

setCustomerInfo((currentInfo) => ({
    ...currentInfo,
    [name]: value,
}));
};

const handleSubmit = async (
event: FormEvent<HTMLFormElement>
) => {
event.preventDefault();

setError("");

if (
    !customerInfo.name.trim() ||
    !customerInfo.email.trim() ||
    !customerInfo.address.trim() ||
    !customerInfo.city.trim() ||
    !customerInfo.postal.trim()
) {
    setError("Please fill in all fields.");
    return;
}

setLoading(true);

try {
    const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        items: cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        })),
        customer: customerInfo,
    }),
    });

    const data = await response.json();

    if (!response.ok) {
    setError(
        data.error || "Failed to place your order."
    );
    setLoading(false);
    return;
    }

    setOrderName(customerInfo.name);
    setOrderEmail(customerInfo.email);
    setOrderNumber(data.order.id);

    clearCart();
    setOrderPlaced(true);
} catch (error) {
    console.error("Checkout error:", error);
    setError(
    "Something went wrong. Please try again."
    );
} finally {
    setLoading(false);
}
};

if (status === "loading") {
return (
    <main className="checkout-page">
    <div className="checkout-empty">
        <h1>Loading...</h1>
        <p>Please wait.</p>
    </div>
    </main>
);
}

if (status === "unauthenticated") {
return (
    <main className="checkout-page">
    <div className="checkout-empty">
        <h1>Login Required</h1>

        <p>
        You need to be logged in to place an
        order.
        </p>

        <Link href="/login">
        Login
        </Link>
    </div>
    </main>
);
}

if (orderPlaced) {
return (
    <main className="checkout-page">
    <div className="order-confirmation">
        <div className="success-icon">✓</div>

        <p className="confirmation-label">
        ORDER CONFIRMED
        </p>

        <h1>
        Thank you, {orderName}!
        </h1>

        <p className="confirmation-message">
        Your order has been successfully placed.
        </p>

        <div className="order-number">
        <span>Order Number</span>

        <strong>{orderNumber}</strong>
        </div>

        <p className="confirmation-email">
        A confirmation will be sent to{" "}
        <strong>{orderEmail}</strong>.
        </p>

        <Link
        href="/"
        className="back-to-store-button"
        >
        Continue Shopping
        </Link>
    </div>
    </main>
);
}

if (cart.length === 0) {
return (
    <main className="checkout-page">
    <div className="checkout-empty">
        <h1>Your cart is empty</h1>

        <p>
        Add some products before checking out.
        </p>

        <Link href="/">
        ← Back to Store
        </Link>
    </div>
    </main>
);
}

return (
<main className="checkout-page">
    <Link
    href="/"
    className="back-link"
    >
    ← Back to Store
    </Link>

    <h1>Checkout</h1>

    <div className="checkout-container">
    <section className="checkout-form-section">
        <h2>Customer Information</h2>

        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="name">
            Full Name
            </label>

            <input
            id="name"
            name="name"
            type="text"
            value={customerInfo.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            />
        </div>

        <div className="form-group">
            <label htmlFor="email">
            Email
            </label>

            <input
            id="email"
            name="email"
            type="email"
            value={customerInfo.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            />
        </div>

        <div className="form-group">
            <label htmlFor="address">
            Address
            </label>

            <input
            id="address"
            name="address"
            type="text"
            value={customerInfo.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
            />
        </div>

        <div className="form-row">
            <div className="form-group">
            <label htmlFor="city">
                City
            </label>

            <input
                id="city"
                name="city"
                type="text"
                value={customerInfo.city}
                onChange={handleChange}
                placeholder="City"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="postal">
                Postal Code
            </label>

            <input
                id="postal"
                name="postal"
                type="text"
                value={customerInfo.postal}
                onChange={handleChange}
                placeholder="Postal code"
                required
            />
            </div>
        </div>

        {error && (
            <p className="auth-error">
            {error}
            </p>
        )}

        <button
            type="submit"
            className="place-order-button"
            disabled={loading}
        >
            {loading
            ? "Placing Order..."
            : "Place Order"}
        </button>
        </form>
    </section>

    <section className="checkout-summary">
        <h2>Order Summary</h2>

        <div className="checkout-items">
        {cart.map((item) => (
            <div
            className="checkout-item"
            key={item.product.id}
            >
            <img
                src={item.product.image}
                alt={item.product.name}
            />

            <div className="checkout-item-info">
                <h3>{item.product.name}</h3>

                <p>
                ${item.product.price.toFixed(2)}
                </p>

                <div className="checkout-quantity">
                <button
                    type="button"
                    onClick={() =>
                    decreaseQuantity(
                        item.product.id
                    )
                    }
                >
                    −
                </button>

                <span>{item.quantity}</span>

                <button
                    type="button"
                    onClick={() =>
                    increaseQuantity(
                        item.product.id
                    )
                    }
                >
                    +
                </button>
                </div>

                <button
                type="button"
                className="checkout-remove-button"
                onClick={() =>
                    removeFromCart(
                    item.product.id
                    )
                }
                >
                Remove
                </button>
            </div>
            </div>
        ))}
        </div>

        <div className="checkout-total">
        <span>Items</span>
        <span>{cartCount}</span>
        </div>

        <div className="checkout-total final-total">
        <strong>Total</strong>

        <strong>
            ${cartTotal.toFixed(2)}
        </strong>
        </div>

        <button
        type="button"
        className="checkout-clear-button"
        onClick={clearCart}
        >
        Clear Cart
        </button>
    </section>
    </div>
</main>
);
}