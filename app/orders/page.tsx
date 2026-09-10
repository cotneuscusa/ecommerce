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

function formatDate(date: string) {
const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
	return "Unknown date";
}

return parsedDate.toLocaleDateString(undefined, {
	year: "numeric",
	month: "long",
	day: "numeric",
});
}

function formatStatus(status: string) {
if (!status) {
	return "Unknown";
}

return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusStyle(status: string) {
switch (status.toLowerCase()) {
	case "completed":
	case "delivered":
		return {
			background: "#ecfdf3",
			color: "#027a48",
		};

	case "cancelled":
	case "canceled":
		return {
			background: "#fef2f2",
			color: "#b42318",
		};

	case "pending":
		return {
			background: "#fffaeb",
			color: "#b54708",
		};

	case "processing":
	case "shipped":
		return {
			background: "#eff6ff",
			color: "#175cd3",
		};

	default:
		return {
			background: "#f2f4f7",
			color: "#344054",
		};
}
}

export default function OrdersPage() {
const { status } = useSession();

const [orders, setOrders] = useState<Order[]>([]);
const [loadingOrders, setLoadingOrders] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
	if (status !== "authenticated") {
		return;
	}

	const loadOrders = async () => {
		setLoadingOrders(true);
		setError("");

		try {
			const response = await fetch(
				"/api/orders/my-orders",
				{
					method: "GET",
					cache: "no-store",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setError(
					data?.error ||
						"Failed to load your orders."
				);
				return;
			}

			const orderList = Array.isArray(data?.orders)
				? data.orders
				: Array.isArray(data)
				? data
				: null;

			if (!orderList) {
				throw new Error(
					"Invalid orders response."
				);
			}

			setOrders(orderList);
		} catch (error) {
			console.error(
				"Failed to load orders:",
				error
			);

			setOrders([]);
			setError(
				"Something went wrong while loading your orders."
			);
		} finally {
			setLoadingOrders(false);
		}
	};

	loadOrders();
}, [status]);

if (status === "loading") {
	return (
		<main
			style={{
				minHeight: "100vh",
				background: "#f5f7fb",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "40px 20px",
				boxSizing: "border-box",
			}}
		>
			<div
				style={{
					textAlign: "center",
					color: "#667085",
				}}
			>
				<div
					style={{
						width: "42px",
						height: "42px",
						margin: "0 auto 18px",
						border: "4px solid #e5e7eb",
						borderTopColor: "#111827",
						borderRadius: "50%",
						animation:
							"orders-spin 0.8s linear infinite",
					}}
				/>

				<p
					style={{
						margin: 0,
						fontSize: "15px",
						fontWeight: "600",
					}}
				>
					Checking your account...
				</p>
			</div>

			<style>{`
				@keyframes orders-spin {
					to {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</main>
	);
}

if (status === "unauthenticated") {
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
					width: "100%",
					maxWidth: "520px",
					margin: "0 auto",
					padding: "50px 40px",
					boxSizing: "border-box",
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
						letterSpacing: "-0.8px",
					}}
				>
					Login required
				</h1>

				<p
					style={{
						margin: "0 0 28px",
						color: "#667085",
						lineHeight: "1.6",
						fontSize: "15px",
					}}
				>
					Please sign in to view your order
					history.
				</p>

				<Link
					href="/login"
					style={{
						display: "inline-block",
						padding: "13px 26px",
						borderRadius: "10px",
						background: "#111827",
						color: "#ffffff",
						textDecoration: "none",
						fontSize: "14px",
						fontWeight: "700",
					}}
				>
					Sign in
				</Link>

				<Link
					href="/"
					style={{
						display: "block",
						marginTop: "20px",
						color: "#667085",
						textDecoration: "none",
						fontSize: "14px",
						fontWeight: "600",
					}}
				>
					← Back to Store
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
				width: "100%",
				maxWidth: "1100px",
				margin: "0 auto",
			}}
		>
			<Link
				href="/"
				style={{
					display: "inline-block",
					marginBottom: "34px",
					color: "#667085",
					textDecoration: "none",
					fontSize: "14px",
					fontWeight: "600",
				}}
			>
				← Back to Store
			</Link>

			<header
				style={{
					marginBottom: "32px",
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
					ACCOUNT
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
					My Orders
				</h1>

				<p
					style={{
						margin: 0,
						color: "#667085",
						fontSize: "16px",
						lineHeight: "1.6",
					}}
				>
					View your previous orders and delivery
					information.
				</p>
			</header>

			{loadingOrders && (
				<div
					style={{
						padding: "50px 20px",
						background: "#ffffff",
						border: "1px solid #e5e7eb",
						borderRadius: "18px",
						textAlign: "center",
					}}
				>
					<div
						style={{
							width: "42px",
							height: "42px",
							margin: "0 auto 18px",
							border: "4px solid #e5e7eb",
							borderTopColor: "#111827",
							borderRadius: "50%",
							animation:
								"orders-spin 0.8s linear infinite",
						}}
					/>

					<p
						style={{
							margin: 0,
							color: "#667085",
							fontSize: "15px",
							fontWeight: "600",
						}}
					>
						Loading your orders...
					</p>

					<style>{`
						@keyframes orders-spin {
							to {
								transform: rotate(360deg);
							}
						}
					`}</style>
				</div>
			)}

			{!loadingOrders && error && (
				<div
					style={{
						padding: "22px",
						background: "#ffffff",
						border: "1px solid #fecaca",
						borderRadius: "16px",
						boxShadow:
							"0 6px 20px rgba(15, 23, 42, 0.04)",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: "14px",
						}}
					>
						<div
							style={{
								width: "40px",
								height: "40px",
								flexShrink: 0,
								borderRadius: "50%",
								background: "#fef2f2",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "19px",
							}}
						>
							!
						</div>

						<div>
							<h2
								style={{
									margin: "0 0 5px",
									color: "#991b1b",
									fontSize: "17px",
								}}
							>
								Unable to load orders
							</h2>

							<p
								style={{
									margin: 0,
									color: "#b42318",
									fontSize: "14px",
									lineHeight: "1.5",
								}}
							>
								{error}
							</p>
						</div>
					</div>
				</div>
			)}

			{!loadingOrders &&
				!error &&
				orders.length === 0 && (
					<div
						style={{
							padding: "60px 30px",
							background: "#ffffff",
							border: "1px solid #e5e7eb",
							borderRadius: "20px",
							textAlign: "center",
							boxShadow:
								"0 8px 25px rgba(15, 23, 42, 0.04)",
						}}
					>
						<div
							style={{
								width: "72px",
								height: "72px",
								margin: "0 auto 20px",
								borderRadius: "50%",
								background: "#f3f4f6",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "32px",
							}}
						>
							🛍️
						</div>

						<h2
							style={{
								margin: "0 0 10px",
								color: "#111827",
								fontSize: "26px",
							}}
						>
							No orders yet
						</h2>

						<p
							style={{
								maxWidth: "420px",
								margin: "0 auto 26px",
								color: "#667085",
								fontSize: "15px",
								lineHeight: "1.6",
							}}
						>
							You haven't placed an order yet.
							Start shopping and your orders will
							appear here.
						</p>

						<Link
							href="/"
							style={{
								display: "inline-block",
								padding: "13px 25px",
								borderRadius: "10px",
								background: "#111827",
								color: "#ffffff",
								textDecoration: "none",
								fontSize: "14px",
								fontWeight: "700",
							}}
						>
							Start Shopping
						</Link>
					</div>
				)}

			{!loadingOrders &&
				!error &&
				orders.length > 0 && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "22px",
						}}
					>
						{orders.map((order) => {
							const statusStyle =
								getStatusStyle(
									order.status
								);

							return (
								<article
									key={order.id}
									style={{
										background: "#ffffff",
										border: "1px solid #e5e7eb",
										borderRadius: "18px",
										overflow: "hidden",
										boxShadow:
											"0 8px 25px rgba(15, 23, 42, 0.05)",
									}}
								>
									<div
										style={{
											padding: "22px 26px",
											borderBottom:
												"1px solid #eaecf0",
											display: "flex",
											justifyContent:
												"space-between",
											alignItems:
												"center",
											gap: "20px",
											flexWrap: "wrap",
										}}
									>
										<div>
											<p
												style={{
													margin: "0 0 5px",
													color: "#667085",
													fontSize: "12px",
													fontWeight: "700",
													textTransform:
														"uppercase",
													letterSpacing:
														"0.8px",
												}}
											>
												Order
											</p>

											<p
												style={{
													margin: 0,
													color: "#111827",
													fontSize: "14px",
													fontWeight: "700",
													wordBreak:
														"break-all",
												}}
											>
												#{order.id}
											</p>
										</div>

										<div
											style={{
												display: "flex",
												alignItems:
													"center",
												gap: "16px",
												flexWrap:
													"wrap",
											}}
										>
											<div
												style={{
													textAlign:
														"right",
												}}
											>
												<p
													style={{
														margin: "0 0 5px",
														color: "#667085",
														fontSize: "12px",
														fontWeight:
															"700",
														textTransform:
															"uppercase",
														letterSpacing:
															"0.8px",
													}}
												>
													Date
												</p>

												<p
													style={{
														margin: 0,
														color: "#344054",
														fontSize: "14px",
														fontWeight:
															"600",
													}}
												>
													{formatDate(
														order.createdAt
													)}
												</p>
											</div>

											<span
												style={{
													padding:
														"7px 12px",
													borderRadius:
														"999px",
													background:
														statusStyle.background,
													color:
														statusStyle.color,
													fontSize: "12px",
													fontWeight:
														"800",
												}}
											>
												{formatStatus(
													order.status
												)}
											</span>
										</div>
									</div>

									<div
										style={{
											padding: "26px",
										}}
									>
										<div
											style={{
												display: "grid",
												gridTemplateColumns:
													"minmax(0, 1fr) 280px",
												gap: "28px",
												alignItems:
													"start",
											}}
										>
											<section>
												<h2
													style={{
														margin: "0 0 18px",
														color: "#111827",
														fontSize: "18px",
													}}
												>
													Items
												</h2>

												<div
													style={{
														display:
															"flex",
														flexDirection:
															"column",
														gap: "16px",
													}}
												>
													{order.items.map(
														(
															item,
															index
														) => {
															const itemTotal =
																Number(
																	item.product
																		?.price
																) *
																Number(
																	item.quantity
																);

															return (
																<div
																	key={`${order.id}-${item.product?.id}-${index}`}
																	style={{
																		display:
																			"grid",
																		gridTemplateColumns:
																			"64px minmax(0, 1fr) auto",
																		gap: "14px",
																		alignItems:
																			"center",
																	}}
																>
																	<img
																		src={
																			item.product
																				?.image
																		}
																		alt={
																			item.product
																				?.name ||
																			"Product"
																		}
																		style={{
																			width: "64px",
																			height: "64px",
																			objectFit:
																				"cover",
																			borderRadius:
																				"10px",
																			background:
																				"#f2f4f7",
																			border: "1px solid #eaecf0",
																		}}
																	/>

																	<div
																		style={{
																			minWidth:
																				0,
																		}}
																	>
																		<h3
																			style={{
																				margin: "0 0 5px",
																				color: "#111827",
																				fontSize: "14px",
																				fontWeight:
																					"700",
																				overflow:
																					"hidden",
																				textOverflow:
																					"ellipsis",
																				whiteSpace:
																					"nowrap",
																			}}
																		>
																			{
																				item
																					.product
																					?.name
																			}
																		</h3>

																		<p
																			style={{
																				margin: 0,
																				color: "#667085",
																				fontSize: "13px",
																			}}
																		>
																			$
																			{Number(
																				item
																					.product
																					?.price
																			).toFixed(
																				2
																			)}{" "}
																			×{" "}
																			{
																				item.quantity
																			}
																		</p>
																	</div>

																	<strong
																		style={{
																			color: "#111827",
																			fontSize: "14px",
																		}}
																	>
																		$
																		{Number.isFinite(
																			itemTotal
																		)
																			? itemTotal.toFixed(
																					2
																				)
																			: "0.00"}
																	</strong>
																</div>
															);
														}
													)}
												</div>
											</section>

											<section
												style={{
													padding: "20px",
													borderRadius:
														"14px",
													background:
														"#f8fafc",
													border: "1px solid #eaecf0",
												}}
											>
												<h2
													style={{
														margin: "0 0 16px",
														color: "#111827",
														fontSize: "17px",
													}}
												>
													Delivery
												</h2>

												{order.customer ? (
													<div
														style={{
															display:
																"flex",
															flexDirection:
																"column",
															gap: "10px",
														}}
													>
														<div>
															<p
																style={{
																	margin: "0 0 3px",
																	color: "#98a2b3",
																	fontSize: "11px",
																	fontWeight:
																		"700",
																	textTransform:
																		"uppercase",
																}}
															>
																Name
															</p>

															<p
																style={{
																	margin: 0,
																	color: "#344054",
																	fontSize: "13px",
																	fontWeight:
																		"600",
																}}
															>
																{
																	order
																		.customer
																		.name
																}
															</p>
														</div>

														<div>
															<p
																style={{
																	margin: "0 0 3px",
																	color: "#98a2b3",
																	fontSize: "11px",
																	fontWeight:
																		"700",
																	textTransform:
																		"uppercase",
																}}
															>
																Email
															</p>

															<p
																style={{
																	margin: 0,
																	color: "#344054",
																	fontSize: "13px",
																	wordBreak:
																		"break-word",
																}}
															>
																{
																	order
																		.customer
																		.email
																}
															</p>
														</div>

														<div>
															<p
																style={{
																	margin: "0 0 3px",
																	color: "#98a2b3",
																	fontSize: "11px",
																	fontWeight:
																		"700",
																	textTransform:
																		"uppercase",
																}}
															>
																Address
															</p>

															<p
																style={{
																	margin: 0,
																	color: "#344054",
																	fontSize: "13px",
																}}
															>
																{
																	order
																		.customer
																		.address
																}
															</p>
														</div>

														<div
															style={{
																display:
																	"grid",
																gridTemplateColumns:
																	"1fr 1fr",
																gap: "12px",
															}}
														>
															<div>
																<p
																	style={{
																		margin: "0 0 3px",
																		color: "#98a2b3",
																		fontSize: "11px",
																		fontWeight:
																			"700",
																		textTransform:
																			"uppercase",
																	}}
																>
																	City
																</p>

																<p
																	style={{
																		margin: 0,
																		color: "#344054",
																		fontSize: "13px",
																	}}
																>
																	{
																		order
																			.customer
																			.city
																	}
																</p>
															</div>

															<div>
																<p
																	style={{
																		margin: "0 0 3px",
																		color: "#98a2b3",
																		fontSize: "11px",
																		fontWeight:
																			"700",
																		textTransform:
																			"uppercase",
																	}}
																>
																	Postal
																</p>

																<p
																	style={{
																		margin: 0,
																		color: "#344054",
																		fontSize: "13px",
																	}}
																>
																	{
																		order
																			.customer
																			.postal
																	}
																</p>
															</div>
														</div>
													</div>
												) : (
													<p
														style={{
															margin: 0,
															color: "#667085",
															fontSize: "13px",
														}}
													>
														No delivery
														information
														available.
													</p>
												)}
											</section>
										</div>

										<div
											style={{
												marginTop: "26px",
												paddingTop: "20px",
												borderTop:
													"1px solid #eaecf0",
												display: "flex",
												justifyContent:
													"space-between",
												alignItems:
													"center",
												gap: "20px",
											}}
										>
											<span
												style={{
													color: "#667085",
													fontSize: "14px",
													fontWeight:
														"600",
												}}
											>
												Order Total
											</span>

											<strong
												style={{
													color: "#111827",
													fontSize: "24px",
												}}
											>
												$
												{Number(
													order.total
												).toFixed(2)}
											</strong>
										</div>
									</div>
								</article>
							);
						})}
					</div>
				)}
		</div>
	</main>
);
}