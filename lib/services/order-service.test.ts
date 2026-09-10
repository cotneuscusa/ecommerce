import { describe, expect, it, vi, beforeEach } from "vitest";

import { createOrderFromCart } from "./order-service";

import { getCart } from "@/lib/repositories/cart";
import { getProductById } from "@/lib/repositories/products";
import { createOrderAndClearCart } from "@/lib/repositories/orders";

vi.mock("@/lib/repositories/cart", () => ({
getCart: vi.fn(),
}));

vi.mock("@/lib/repositories/products", () => ({
getProductById: vi.fn(),
}));

vi.mock("@/lib/repositories/orders", () => ({
createOrderAndClearCart: vi.fn(),
}));

const mockedGetCart = vi.mocked(getCart);
const mockedGetProductById = vi.mocked(getProductById);
const mockedCreateOrderAndClearCart =
vi.mocked(createOrderAndClearCart);

describe("createOrderFromCart", () => {
beforeEach(() => {
vi.clearAllMocks();
});

it("rejects an empty cart", async () => {
mockedGetCart.mockResolvedValue([]);

await expect(
    createOrderFromCart({
    userId: "user-1",
    customer: {
        name: "Test User",
        email: "test@example.com",
        address: "Test Address",
        city: "Tbilisi",
        postal: "0100",
    },
    idempotencyKey: "test-key",
    })
).rejects.toThrow("Your cart is empty.");

expect(
    mockedCreateOrderAndClearCart
).not.toHaveBeenCalled();
});

it("rejects invalid quantities", async () => {
mockedGetCart.mockResolvedValue([
    {
    product: {
        id: 1,
        name: "Test Product",
        description: "Test description",
        price: 10,
        image: "test.jpg",
        category: "Test",
    },
    quantity: 0,
    },
]);

await expect(
    createOrderFromCart({
    userId: "user-1",
    customer: {
        name: "Test User",
        email: "test@example.com",
        address: "Test Address",
        city: "Tbilisi",
        postal: "0100",
    },
    idempotencyKey: "test-key",
    })
).rejects.toThrow("Invalid order item.");

expect(
    mockedCreateOrderAndClearCart
).not.toHaveBeenCalled();
});

it("uses the database product price instead of the cart price", async () => {
mockedGetCart.mockResolvedValue([
    {
    product: {
        id: 1,
        name: "Test Product",
        description: "Test description",
        price: 1,
        image: "cart-image.jpg",
        category: "Test",
    },
    quantity: 2,
    },
]);

mockedGetProductById.mockResolvedValue({
    id: "1",
    name: "Test Product",
    description: "Test description",
    price: 50,
    image: "database-image.jpg",
    category: "Test",
});

mockedCreateOrderAndClearCart.mockImplementation(
    async (order) => order
);

const order = await createOrderFromCart({
    userId: "user-1",
    customer: {
    name: "Test User",
    email: "TEST@EXAMPLE.COM",
    address: "Test Address",
    city: "Tbilisi",
    postal: "0100",
    },
    idempotencyKey: "test-key",
});

expect(order.total).toBe(100);

expect(order.items[0].product.price).toBe(50);

expect(order.items[0].product.image).toBe(
    "database-image.jpg"
);

expect(order.customer.email).toBe(
    "test@example.com"
);
});

it("creates a deterministic order id from the user and idempotency key", async () => {
mockedGetCart.mockResolvedValue([
    {
    product: {
        id: 1,
        name: "Test Product",
        description: "Test description",
        price: 10,
        image: "test.jpg",
        category: "Test",
    },
    quantity: 1,
    },
]);

mockedGetProductById.mockResolvedValue({
    id: "1",
    name: "Test Product",
    description: "Test description",
    price: 10,
    image: "test.jpg",
    category: "Test",
});

mockedCreateOrderAndClearCart.mockImplementation(
    async (order) => order
);

const firstOrder = await createOrderFromCart({
    userId: "user-1",
    customer: {
    name: "Test User",
    email: "test@example.com",
    address: "Test Address",
    city: "Tbilisi",
    postal: "0100",
    },
    idempotencyKey: "same-key",
});

vi.clearAllMocks();

mockedGetCart.mockResolvedValue([
    {
    product: {
        id: 1,
        name: "Test Product",
        description: "Test description",
        price: 10,
        image: "test.jpg",
        category: "Test",
    },
    quantity: 1,
    },
]);

mockedGetProductById.mockResolvedValue({
    id: "1",
    name: "Test Product",
    description: "Test description",
    price: 10,
    image: "test.jpg",
    category: "Test",
});

mockedCreateOrderAndClearCart.mockImplementation(
    async (order) => order
);

const secondOrder = await createOrderFromCart({
    userId: "user-1",
    customer: {
    name: "Test User",
    email: "test@example.com",
    address: "Test Address",
    city: "Tbilisi",
    postal: "0100",
    },
    idempotencyKey: "same-key",
});

expect(firstOrder.id).toBe(secondOrder.id);
});

it("rejects an invalid idempotency key", async () => {
await expect(
    createOrderFromCart({
    userId: "user-1",
    customer: {
        name: "Test User",
        email: "test@example.com",
        address: "Test Address",
        city: "Tbilisi",
        postal: "0100",
    },
    idempotencyKey: "",
    })
).rejects.toThrow("Invalid checkout request.");

expect(mockedGetCart).not.toHaveBeenCalled();
});
});