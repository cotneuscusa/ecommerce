import {
beforeEach,
describe,
expect,
it,
vi,
} from "vitest";

import * as cartService from "./cart-api-service";
import * as cartRepository from "@/lib/repositories/cart";

vi.mock("@/lib/repositories/cart", () => ({
getCart: vi.fn(),
saveCart: vi.fn(),
clearCart: vi.fn(),
}));

const mockedGetCart = vi.mocked(cartRepository.getCart);
const mockedSaveCart = vi.mocked(cartRepository.saveCart);
const mockedClearCart = vi.mocked(cartRepository.clearCart);

const validProduct = {
id: 1,
name: "Test Product",
description: "Test description",
price: 10,
image: "test.jpg",
category: "Test",
};

describe("cart-api-service", () => {
beforeEach(() => {
vi.clearAllMocks();
});

it("loads the user's cart", async () => {
const items = [
    {
    product: validProduct,
    quantity: 2,
    },
];

mockedGetCart.mockResolvedValue(items);

const result = await cartService.getUserCart("user-1");

expect(result).toEqual(items);
expect(mockedGetCart).toHaveBeenCalledWith("user-1");
});

it("accepts a valid cart", async () => {
const items = [
    {
    product: validProduct,
    quantity: 2,
    },
];

mockedSaveCart.mockResolvedValue(items);

const result = await cartService.saveUserCart(
    "user-1",
    items
);

expect(result).toEqual(items);
expect(mockedSaveCart).toHaveBeenCalledWith(
    "user-1",
    items
);
});

it("rejects invalid quantities", async () => {
const items = [
    {
    product: validProduct,
    quantity: 0,
    },
];

await expect(
    cartService.saveUserCart("user-1", items)
).rejects.toThrow("Invalid cart item.");

expect(mockedSaveCart).not.toHaveBeenCalled();
});

it("rejects quantities above the maximum", async () => {
const items = [
    {
    product: validProduct,
    quantity: 101,
    },
];

await expect(
    cartService.saveUserCart("user-1", items)
).rejects.toThrow("Invalid cart item.");

expect(mockedSaveCart).not.toHaveBeenCalled();
});

it("rejects duplicate products", async () => {
const items = [
    {
    product: validProduct,
    quantity: 1,
    },
    {
    product: validProduct,
    quantity: 2,
    },
];

await expect(
    cartService.saveUserCart("user-1", items)
).rejects.toThrow("Invalid cart item.");

expect(mockedSaveCart).not.toHaveBeenCalled();
});

it("rejects invalid product ids", async () => {
const items = [
    {
    product: {
        ...validProduct,
        id: 0,
    },
    quantity: 1,
    },
];

await expect(
    cartService.saveUserCart("user-1", items)
).rejects.toThrow("Invalid cart item.");

expect(mockedSaveCart).not.toHaveBeenCalled();
});

it("rejects carts with too many items", async () => {
const items = Array.from(
    { length: 51 },
    (_, index) => ({
    product: {
        ...validProduct,
        id: index + 1,
    },
    quantity: 1,
    })
);

await expect(
    cartService.saveUserCart("user-1", items)
).rejects.toThrow(
    "Your cart contains too many items."
);

expect(mockedSaveCart).not.toHaveBeenCalled();
});

it("clears the user's cart", async () => {
mockedClearCart.mockResolvedValue();

await cartService.clearUserCart("user-1");

expect(mockedClearCart).toHaveBeenCalledWith(
    "user-1"
);
});
});