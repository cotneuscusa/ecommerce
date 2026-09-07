import { getProductById } from "@/lib/repositories/products";

import {
createOrderAndClearCart,
type Order,
type OrderItem,
} from "@/lib/repositories/orders";
import { getCart } from "@/lib/repositories/cart";

type CustomerInfo = {
name: string;
email: string;
address: string;
city: string;
postal: string;
};

type CreateOrderInput = {
userId: string;
customer: CustomerInfo | undefined;
};

const MAX_ITEM_QUANTITY = 100;

function validateCustomer(
customer: CustomerInfo | undefined
): CustomerInfo {
if (!customer) {
throw new Error("Complete customer information is required.");
}

if (
typeof customer.name !== "string" ||
customer.name.trim() === "" ||
typeof customer.email !== "string" ||
customer.email.trim() === "" ||
typeof customer.address !== "string" ||
customer.address.trim() === "" ||
typeof customer.city !== "string" ||
customer.city.trim() === "" ||
typeof customer.postal !== "string" ||
customer.postal.trim() === ""
) {
throw new Error("Complete customer information is required.");
}

return customer;
}

function toCents(price: number): number {
if (!Number.isFinite(price) || price < 0) {
throw new Error("Invalid product price.");
}

const cents = Math.round(price * 100);

if (!Number.isSafeInteger(cents)) {
throw new Error("Invalid product price.");
}

return cents;
}

export async function createOrderFromCart(
input: CreateOrderInput
): Promise<Order> {
const { userId, customer } = input;

const validCustomer = validateCustomer(customer);

const items = await getCart(userId);

if (!items.length) {
throw new Error("Your cart is empty.");
}

const verifiedItems: OrderItem[] = [];

for (const item of items) {
if (!item || typeof item !== "object") {
    throw new Error("Invalid order item.");
}

const productId = String(item.product?.id ?? "");
const quantity = Number(item.quantity);

if (
    !productId ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity > MAX_ITEM_QUANTITY
) {
    throw new Error("Invalid order item.");
}

const product = await getProductById(productId);

if (!product) {
    throw new Error(`Product ${productId} was not found.`);
}

const price = Number(product.price);

toCents(price);

verifiedItems.push({
    product: {
    id: Number(product.id),
    name: String(product.name),
    price,
    image: String(product.image),
    },
    quantity,
});
}

const totalCents = verifiedItems.reduce(
(sum, item) => {
    const priceCents = toCents(item.product.price);
    const itemTotalCents = priceCents * item.quantity;

    if (!Number.isSafeInteger(itemTotalCents)) {
    throw new Error("Invalid order total.");
    }

    const newTotal = sum + itemTotalCents;

    if (!Number.isSafeInteger(newTotal)) {
    throw new Error("Invalid order total.");
    }

    return newTotal;
},
0
);

const total = totalCents / 100;

if (!Number.isFinite(total) || total < 0) {
throw new Error("Invalid order total.");
}

const order: Order = {
id: crypto.randomUUID(),
userId,

customer: {
    name: validCustomer.name.trim(),
    email: validCustomer.email.trim().toLowerCase(),
    address: validCustomer.address.trim(),
    city: validCustomer.city.trim(),
    postal: validCustomer.postal.trim(),
},

items: verifiedItems,
total,
status: "pending",
createdAt: new Date().toISOString(),
};

return createOrderAndClearCart(order);
}