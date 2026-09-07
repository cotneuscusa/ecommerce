"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type OrderItem = {
product: {
id: number;
name: string;
price: number;
image: string;
};
quantity: number;
};

type CustomerInfo = {
name: string;
email: string;
address: string;
city: string;
postal: string;
};

type Order = {
id: string;
userId: string;
customer?: CustomerInfo;
items: OrderItem[];
total: number;
status: string;
createdAt: string;
};

export default function OrdersPage() {
const { status } = useSession();

const [orders, setOrders] = useState<Order[]>([]);
const [loadingOrders, setLoadingOrders] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
	if (status !== "authenticated") return;

	const loadOrders = async () => {
		setLoadingOrders(true);
		setError("");

		try {
			const response = await fetch("/api/orders/my-orders");
			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to load orders.");
				return;
			}

			setOrders(data);
		} catch (error) {
			console.error("Failed to load orders:", error);
			setError("Something went wrong.");
		} finally {
			setLoadingOrders(false);
		}
	};

	loadOrders();
}, [status]);

if (status === "loading") {
	return (
		<main className="orders-page">
			<h1>My Orders</h1>
			<p>Checking your account...</p>
		</main>
	);
}

if (status === "unauthenticated") {
	return (
		<main className="orders-page">
			<h1>Login Required</h1>
			<p>You need to be logged in to view your orders.</p>

			<Link href="/login">Login</Link>

			<br />

			<Link href="/" className="back-link">
				← Back to Store
			</Link>
		</main>
	);
}

if (loadingOrders) {
	return (
		<main className="orders-page">
			<Link href="/" className="back-link">
				← Back to Store
			</Link>

			<h1>My Orders</h1>
			<p>Loading your orders...</p>
		</main>
	);
}

if (error) {
	return (
		<main className="orders-page">
			<h1>My Orders</h1>
			<p className="auth-error">{error}</p>
			<Link href="/">← Back to Store</Link>
		</main>
	);
}

return (
	<main className="orders-page">
		<Link href="/" className="back-link">
			← Back to Store
		</Link>

		<h1>My Orders</h1>

		{orders.length === 0 ? (
			<div className="orders-empty">
				<h2>No orders yet</h2>
				<p>You haven't placed any orders yet.</p>
				<Link href="/">Start Shopping</Link>
			</div>
		) : (
			<div className="orders-list">
				{orders.map((order) => (
					<div className="order-card" key={order.id}>
						<div className="order-header">
							<div>
								<p>Order</p>
								<strong>{order.id}</strong>
							</div>

							<div>
								<p>Date</p>
								<strong>
									{new Date(order.createdAt).toLocaleDateString()}
								</strong>
							</div>

							<div>
								<p>Status</p>
								<strong>{order.status}</strong>
							</div>
						</div>

						{order.customer && (
							<div className="order-customer">
								<h2>Delivery Information</h2>

								<p>
									<strong>Name:</strong> {order.customer.name}
								</p>

								<p>
									<strong>Email:</strong> {order.customer.email}
								</p>

								<p>
									<strong>Address:</strong> {order.customer.address}
								</p>

								<p>
									<strong>City:</strong> {order.customer.city}
								</p>

								<p>
									<strong>Postal Code:</strong> {order.customer.postal}
								</p>
							</div>
						)}

						<div className="order-items">
							{order.items.map((item, index) => (
								<div
									className="order-item"
									key={`${order.id}-${item.product.id}-${index}`}
								>
									<img
										src={item.product.image}
										alt={item.product.name}
									/>

									<div>
										<h3>{item.product.name}</h3>
										<p>
											${item.product.price.toFixed(2)} × {item.quantity}
										</p>
									</div>

									<strong>
										${(item.product.price * item.quantity).toFixed(2)}
									</strong>
								</div>
							))}
						</div>

						<div className="order-total">
							<span>Total</span>
							<strong>${Number(order.total).toFixed(2)}</strong>
						</div>
					</div>
				))}
			</div>
		)}
	</main>
);
}