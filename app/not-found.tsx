import Link from "next/link";

export default function NotFound() {
return (
<main className="product-not-found">
    <h1>Page not found</h1>

    <p>
    The page you're looking for doesn't exist.
    </p>

    <Link href="/">
    ← Back to Store
    </Link>
</main>
);
}