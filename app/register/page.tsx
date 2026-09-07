"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
const router = useRouter();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError("");

if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
}

if (password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
}

setLoading(true);

try {
    const response = await fetch("/api/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name,
        email,
        password,
    }),
    });

    const data = await response.json();

    if (!response.ok) {
    setError(data.error || "Failed to create account.");
    setLoading(false);
    return;
    }

    router.push("/login");
} catch {
    setError("Something went wrong. Please try again.");
    setLoading(false);
}
}

return (
<main className="auth-page">
    <div className="auth-container">
    <h1>Create Account</h1>
    <p>Create your account to continue.</p>

    <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="name">Name</label>

        <input
        id="name"
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        />

        <label htmlFor="email">Email</label>

        <input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        />

        <label htmlFor="password">Password</label>

        <input
        id="password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={8}
        />

        <label htmlFor="confirmPassword">
        Confirm Password
        </label>

        <input
        id="confirmPassword"
        type="password"
        placeholder="Enter your password again"
        value={confirmPassword}
        onChange={(event) =>
            setConfirmPassword(event.target.value)
        }
        required
        minLength={8}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
        </button>
    </form>

    <p>
        Already have an account?{" "}
        <Link href="/login">Login</Link>
    </p>

    <Link href="/">← Back to Store</Link>
    </div>
</main>
);
}