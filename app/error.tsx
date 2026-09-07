"use client";

import { useEffect } from "react";

export default function Error({
error,
reset,
}: {
error: Error & { digest?: string };
reset: () => void;
}) {
useEffect(() => {
console.error(error);
}, [error]);

return (
<main className="error-page">
    <h1>Something went wrong</h1>

    <p>
    We couldn't load this page. Please try again.
    </p>

    <button type="button" onClick={() => reset()}>
    Try again
    </button>
</main>
);
}