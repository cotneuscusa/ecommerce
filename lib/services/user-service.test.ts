import {
beforeEach,
describe,
expect,
it,
vi,
} from "vitest";

import bcrypt from "bcryptjs";

import {
createUserFromInput,
} from "./user-service";

import * as userRepository from "@/lib/repositories/users";

vi.mock("@/lib/repositories/users", () => ({
createUser: vi.fn(),
getUserById: vi.fn(),
}));

const mockedCreateUser =
vi.mocked(userRepository.createUser);

const mockedGetUserById =
vi.mocked(userRepository.getUserById);

describe("user-service", () => {
beforeEach(() => {
vi.clearAllMocks();
});

it("creates a user with a hashed password", async () => {
const user = {
    id: "user@example.com",
    email: "user@example.com",
    name: "Test User",
    passwordHash: "hashed-password",
    role: "user" as const,
};

mockedGetUserById.mockResolvedValue(null);
mockedCreateUser.mockResolvedValue(user);

const result =
    await createUserFromInput({
    email: "user@example.com",
    name: "Test User",
    password: "Password123!",
    });

expect(result).toEqual(user);

expect(
    mockedCreateUser
).toHaveBeenCalledTimes(1);

const createdUser =
    mockedCreateUser.mock.calls[0][0];

expect(createdUser.email).toBe(
    "user@example.com"
);

expect(createdUser.name).toBe(
    "Test User"
);

expect(createdUser.role).toBe(
    "user"
);

expect(createdUser.passwordHash).not.toBe(
    "Password123!"
);

expect(
    await bcrypt.compare(
    "Password123!",
    createdUser.passwordHash
    )
).toBe(true);
});

it("normalizes the email address", async () => {
const user = {
    id: "user@example.com",
    email: "user@example.com",
    name: "Test User",
    passwordHash: "hashed-password",
    role: "user" as const,
};

mockedGetUserById.mockResolvedValue(null);
mockedCreateUser.mockResolvedValue(user);

await createUserFromInput({
    email: "  USER@EXAMPLE.COM  ",
    name: "Test User",
    password: "Password123!",
});

expect(
    mockedGetUserById
).toHaveBeenCalledWith(
    "user@example.com"
);

const createdUser =
    mockedCreateUser.mock.calls[0][0];

expect(createdUser.email).toBe(
    "user@example.com"
);
});

it("trims the user's name", async () => {
mockedGetUserById.mockResolvedValue(null);

mockedCreateUser.mockImplementation(
    async (user) => user
);

const result =
    await createUserFromInput({
    email: "user@example.com",
    name: "  Test User  ",
    password: "Password123!",
    });

expect(result.name).toBe(
    "Test User"
);
});

it("always assigns the user role", async () => {
mockedGetUserById.mockResolvedValue(null);

mockedCreateUser.mockImplementation(
    async (user) => user
);

const result =
    await createUserFromInput({
    email: "user@example.com",
    name: "Test User",
    password: "Password123!",
    });

expect(result.role).toBe(
    "user"
);
});

it("rejects missing required fields", async () => {
await expect(
    createUserFromInput({
    email: "",
    name: "",
    password: "",
    })
).rejects.toThrow(
    "Name, email, and password are required."
);

expect(
    mockedGetUserById
).not.toHaveBeenCalled();

expect(
    mockedCreateUser
).not.toHaveBeenCalled();
});

it("rejects an invalid email", async () => {
await expect(
    createUserFromInput({
    email: "not-an-email",
    name: "Test User",
    password: "Password123!",
    })
).rejects.toThrow(
    "Please provide a valid email address."
);

expect(
    mockedGetUserById
).not.toHaveBeenCalled();

expect(
    mockedCreateUser
).not.toHaveBeenCalled();
});

it("rejects passwords shorter than 8 characters", async () => {
await expect(
    createUserFromInput({
    email: "user@example.com",
    name: "Test User",
    password: "1234567",
    })
).rejects.toThrow(
    "Password must be at least 8 characters."
);

expect(
    mockedGetUserById
).not.toHaveBeenCalled();

expect(
    mockedCreateUser
).not.toHaveBeenCalled();
});

it("rejects an existing email", async () => {
mockedGetUserById.mockResolvedValue({
    id: "user@example.com",
    email: "user@example.com",
    name: "Existing User",
    passwordHash: "hash",
    role: "user",
});

await expect(
    createUserFromInput({
    email: "user@example.com",
    name: "New User",
    password: "Password123!",
    })
).rejects.toThrow(
    "A user with this email already exists."
);

expect(
    mockedCreateUser
).not.toHaveBeenCalled();
});
});