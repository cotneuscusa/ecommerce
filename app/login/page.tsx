"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError("");
setLoading(true);

const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
});

if (result?.error) {
    setError("Invalid email or password.");
    setLoading(false);
    return;
}

router.push("/");
router.refresh();
}

return (
<main className="auth-page">
    <div className="auth-container">
    <h1>Login</h1>
    <p>Sign in to your account</p>

    <form onSubmit={handleSubmit} className="auth-form">
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
        placeholder="Your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
        </button>
    </form>

    <p>
        Don't have an account?{" "}
        <Link href="/register">Create one</Link>
    </p>

    <Link href="/">← Back to Store</Link>
    </div>
</main>
);
}