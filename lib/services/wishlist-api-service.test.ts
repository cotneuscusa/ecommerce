import {
beforeEach,
describe,
expect,
it,
vi,
} from "vitest";

import * as wishlistService from "./wishlist-api-service";
import * as wishlistRepository from "@/lib/repositories/wishlist";

vi.mock("@/lib/repositories/wishlist", () => ({
getWishlist: vi.fn(),
saveWishlist: vi.fn(),
clearWishlist: vi.fn(),
}));

const mockedGetWishlist = vi.mocked(
wishlistRepository.getWishlist
);

const mockedSaveWishlist = vi.mocked(
wishlistRepository.saveWishlist
);

const mockedClearWishlist = vi.mocked(
wishlistRepository.clearWishlist
);

const validProduct = {
id: 1,
name: "Test Product",
description: "Test description",
price: 10,
image: "test.jpg",
category: "Test",
};

describe("wishlist-api-service", () => {
beforeEach(() => {
vi.clearAllMocks();
});

it("loads the user's wishlist", async () => {
const products = [validProduct];

mockedGetWishlist.mockResolvedValue(products);

const result =
    await wishlistService.getUserWishlist(
    "user-1"
    );

expect(result).toEqual(products);

expect(
    mockedGetWishlist
).toHaveBeenCalledWith("user-1");
});

it("accepts a valid wishlist", async () => {
const products = [validProduct];

mockedSaveWishlist.mockResolvedValue(
    products
);

const result =
    await wishlistService.saveUserWishlist(
    "user-1",
    products
    );

expect(result).toEqual(products);

expect(
    mockedSaveWishlist
).toHaveBeenCalledWith(
    "user-1",
    products
);
});

it("rejects duplicate products", async () => {
const products = [
    validProduct,
    validProduct,
];

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Invalid wishlist product."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("rejects invalid product ids", async () => {
const products = [
    {
    ...validProduct,
    id: 0,
    },
];

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Invalid wishlist product."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("rejects an empty product name", async () => {
const products = [
    {
    ...validProduct,
    name: "",
    },
];

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Invalid wishlist product."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("rejects invalid prices", async () => {
const products = [
    {
    ...validProduct,
    price: -10,
    },
];

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Invalid wishlist product."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("rejects an empty image", async () => {
const products = [
    {
    ...validProduct,
    image: "",
    },
];

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Invalid wishlist product."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("rejects an empty category", async () => {
const products = [
    {
    ...validProduct,
    category: "",
    },
];

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Invalid wishlist product."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("rejects wishlists with too many products", async () => {
const products = Array.from(
    { length: 101 },
    (_, index) => ({
    ...validProduct,
    id: index + 1,
    })
);

await expect(
    wishlistService.saveUserWishlist(
    "user-1",
    products
    )
).rejects.toThrow(
    "Your wishlist contains too many items."
);

expect(
    mockedSaveWishlist
).not.toHaveBeenCalled();
});

it("clears the user's wishlist", async () => {
mockedClearWishlist.mockResolvedValue();

await wishlistService.clearUserWishlist(
    "user-1"
);

expect(
    mockedClearWishlist
).toHaveBeenCalledWith("user-1");
});
});