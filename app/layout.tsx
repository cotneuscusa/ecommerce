import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/cartcontext";
import { WishlistProvider } from "./context/wishlistcontext";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "My E-Commerce Store",
  description: "Everything you need in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}