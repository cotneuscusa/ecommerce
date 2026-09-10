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
<main
style={{
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "40px 20px",
background: "#f5f7fb",
boxSizing: "border-box",
}}
>
<div
style={{
width: "100%",
maxWidth: "440px",
background: "#ffffff",
borderRadius: "20px",
padding: "44px",
boxSizing: "border-box",
boxShadow: "0 20px 60px rgba(15, 23, 42, 0.10)",
border: "1px solid #e5e7eb",
}}
>
<Link
href="/"
style={{
display: "inline-block",
marginBottom: "38px",
color: "#111827",
fontSize: "22px",
fontWeight: "800",
textDecoration: "none",
letterSpacing: "-0.5px",
}}
>
My Store
</Link>

<div style={{ marginBottom: "30px" }}>
    <p
    style={{
        margin: "0 0 10px",
        color: "#635bff",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "1.8px",
    }}
    >
    WELCOME BACK
    </p>

    <h1
    style={{
        margin: "0 0 10px",
        color: "#111827",
        fontSize: "34px",
        lineHeight: "1.2",
        letterSpacing: "-1px",
    }}
    >
    Sign in to your account
    </h1>

    <p
    style={{
        margin: "0",
        color: "#6b7280",
        fontSize: "15px",
        lineHeight: "1.6",
    }}
    >
    Access your wishlist, orders, and shopping cart.
    </p>
</div>

<form
    onSubmit={handleSubmit}
    style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    }}
>
    <div
    style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    }}
    >
    <label
        htmlFor="email"
        style={{
        color: "#374151",
        fontSize: "14px",
        fontWeight: "700",
        }}
    >
        Email address
    </label>

    <input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        autoComplete="email"
        style={{
        width: "100%",
        padding: "14px 15px",
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        background: "#ffffff",
        color: "#111827",
        fontSize: "15px",
        outline: "none",
        }}
    />
    </div>

    <div
    style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    }}
    >
    <label
        htmlFor="password"
        style={{
        color: "#374151",
        fontSize: "14px",
        fontWeight: "700",
        }}
    >
        Password
    </label>

    <input
        id="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        autoComplete="current-password"
        style={{
        width: "100%",
        padding: "14px 15px",
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        background: "#ffffff",
        color: "#111827",
        fontSize: "15px",
        outline: "none",
        }}
    />
    </div>

    {error && (
    <div
        style={{
        padding: "12px 14px",
        borderRadius: "10px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
        fontSize: "14px",
        fontWeight: "600",
        }}
    >
        {error}
    </div>
    )}

    <button
    type="submit"
    disabled={loading}
    style={{
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: "10px",
        background: "#111827",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "700",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        marginTop: "2px",
    }}
    >
    {loading ? "Signing in..." : "Sign in"}
    </button>
</form>

<div
    style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "28px 0 18px",
    color: "#9ca3af",
    fontSize: "13px",
    }}
>
    <div
    style={{
        flex: 1,
        height: "1px",
        background: "#e5e7eb",
    }}
    />

    <span>New to My Store?</span>

    <div
    style={{
        flex: 1,
        height: "1px",
        background: "#e5e7eb",
    }}
    />
</div>

<Link
    href="/register"
    style={{
    display: "block",
    width: "100%",
    padding: "13px",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    color: "#111827",
    background: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "center",
    textDecoration: "none",
    }}
>
    Create an account
</Link>

<Link
    href="/"
    style={{
    display: "block",
    marginTop: "24px",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    }}
>
    ← Back to Store
</Link>
</div>
</main>

);
}