import {
beforeEach,
describe,
expect,
it,
vi,
} from "vitest";

import bcrypt from "bcryptjs";

import {
authenticateUser,
getCurrentUser,
} from "./auth-service";

import * as userRepository from "@/lib/repositories/users";

vi.mock("@/lib/repositories/users", () => ({
getUserById: vi.fn(),
}));

const mockedGetUserById =
vi.mocked(
userRepository.getUserById
);

describe("auth-service", () => {
beforeEach(() => {
vi.clearAllMocks();
});

it("authenticates a user with the correct password", async () => {
const password = "CorrectPassword123!";
const passwordHash =
    await bcrypt.hash(password, 12);

mockedGetUserById.mockResolvedValue({
    id: "user@example.com",
    email: "user@example.com",
    name: "Test User",
    passwordHash,
    role: "user",
});

const result =
    await authenticateUser(
    "USER@EXAMPLE.COM",
    password
    );

expect(result).toEqual({
    id: "user@example.com",
    email: "user@example.com",
    name: "Test User",
    role: "user",
});

expect(
    mockedGetUserById
).toHaveBeenCalledWith(
    "user@example.com"
);
});

it("rejects an incorrect password", async () => {
const passwordHash =
    await bcrypt.hash(
    "CorrectPassword123!",
    12
    );

mockedGetUserById.mockResolvedValue({
    id: "user@example.com",
    email: "user@example.com",
    name: "Test User",
    passwordHash,
    role: "user",
});

const result =
    await authenticateUser(
    "user@example.com",
    "WrongPassword123!"
    );

expect(result).toBeNull();
});

it("rejects a nonexistent user", async () => {
mockedGetUserById.mockResolvedValue(
    null
);

const result =
    await authenticateUser(
    "missing@example.com",
    "Password123!"
    );

expect(result).toBeNull();
});

it("preserves the admin role for an authenticated admin", async () => {
const password = "AdminPassword123!";
const passwordHash =
    await bcrypt.hash(password, 12);

mockedGetUserById.mockResolvedValue({
    id: "admin@example.com",
    email: "admin@example.com",
    name: "Admin User",
    passwordHash,
    role: "admin",
});

const result =
    await authenticateUser(
    "admin@example.com",
    password
    );

expect(result?.role).toBe(
    "admin"
);
});

it("normalizes email addresses", async () => {
const password = "Password123!";
const passwordHash =
    await bcrypt.hash(password, 12);

mockedGetUserById.mockResolvedValue({
    id: "user@example.com",
    email: "user@example.com",
    name: "Test User",
    passwordHash,
    role: "user",
});

await authenticateUser(
    "  USER@EXAMPLE.COM  ",
    password
);

expect(
    mockedGetUserById
).toHaveBeenCalledWith(
    "user@example.com"
);
});

it("rejects missing credentials", async () => {
const result =
    await authenticateUser(
    "",
    ""
    );

expect(result).toBeNull();

expect(
    mockedGetUserById
).not.toHaveBeenCalled();
});

it("loads the current user for session authorization", async () => {
mockedGetUserById.mockResolvedValue({
    id: "admin@example.com",
    email: "admin@example.com",
    name: "Admin User",
    passwordHash: "hash",
    role: "admin",
});

const result =
    await getCurrentUser(
    "admin@example.com"
    );

expect(result?.role).toBe(
    "admin"
);

expect(
    mockedGetUserById
).toHaveBeenCalledWith(
    "admin@example.com"
);
});

it("returns no current user for an invalid user id", async () => {
const result =
    await getCurrentUser("");

expect(result).toBeNull();

expect(
    mockedGetUserById
).not.toHaveBeenCalled();
});
});