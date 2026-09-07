"use client";

import {
useEffect,
useState,
} from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import ProductCard from "@/components/productcards";
import type { Product } from "@/lib/types";

import { useCart } from "./context/cartcontext";
import { useWishlist } from "./context/wishlistcontext";

export default function Home() {
const {
  cart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = useCart();

const { wishlist } = useWishlist();
const { data: session, status } = useSession();

const [products, setProducts] = useState<Product[]>([]);
const [loadingProducts, setLoadingProducts] =
  useState(true);
const [productError, setProductError] =
  useState(false);

const [searchTerm, setSearchTerm] =
  useState("");
const [selectedCategory, setSelectedCategory] =
  useState("All");

useEffect(() => {
  async function loadProducts() {
    setLoadingProducts(true);
    setProductError(false);

    try {
      const response = await fetch(
        "/api/products"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

      const convertedProducts: Product[] =
        Array.isArray(data)
          ? data.map((product: Product) => ({
              ...product,
              id: Number(product.id),
            }))
          : [];

      setProducts(convertedProducts);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      setProducts([]);
      setProductError(true);
    } finally {
      setLoadingProducts(false);
    }
  }

  loadProducts();
}, []);

const categories = [
  "All",
  ...Array.from(
    new Set(
      products.map(
        (product) => product.category
      )
    )
  ),
];

const cartCount = cart.reduce(
  (total, item) =>
    total + item.quantity,
  0
);

const cartTotal = cart.reduce(
  (total, item) =>
    total +
    item.product.price *
      item.quantity,
  0
);

const filteredProducts = products.filter(
  (product) => {
    const search =
      searchTerm.toLowerCase();

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search) ||
      product.description
        .toLowerCase()
        .includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category ===
        selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );
  }
);

return (
  <main>
    <nav>
      <h2>My Store</h2>

      <div className="nav-links">
        <a href="#">Home</a>

        <a href="#products">
          Products
        </a>

        <Link
          href="/wishlist"
          className="wishlist-nav-button"
        >
          Wishlist
          <span>
            {wishlist.length}
          </span>
        </Link>

        <a
          href="#cart"
          className="cart-nav-button"
        >
          Cart
          <span>
            {cartCount}
          </span>
        </a>

        {status ===
          "authenticated" && (
          <>
            <Link
              href="/orders"
              className="orders-nav-button"
            >
              My Orders
            </Link>

            <span className="account-nav">
              {session.user?.name ||
                session.user?.email}
            </span>

            <button
              type="button"
              className="logout-button"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Logout
            </button>
          </>
        )}

        {status ===
          "unauthenticated" && (
          <Link
            href="/login"
            className="login-nav-button"
          >
            Login
          </Link>
        )}
      </div>
    </nav>

    <header>
      <h1>
        <img
          src="products/1.jpg"
          width={720}
          height={160}
          alt="Store"
        />
      </h1>
    </header>

    <section id="products">
      <h2>Products</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
        />

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(
              event.target.value
            )
          }
        >
          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category === "All"
                  ? "All Categories"
                  : category}
              </option>
            )
          )}
        </select>
      </div>

      {loadingProducts ? (
        <div className="empty-products">
          <p>Loading products...</p>
        </div>
      ) : productError ? (
        <div className="empty-products">
          <p>
            We couldn't load the
            products.
          </p>
          <p>
            Please refresh the page
            and try again.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-products">
          <p>
            No products are available
            right now.
          </p>
        </div>
      ) : filteredProducts.length ===
        0 ? (
        <div className="empty-products">
          <p>
            No products found.
          </p>

          <p>
            Try changing your
            search or category.
          </p>
        </div>
      ) : (
        <div>
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() =>
                  addToCart(product)
                }
              />
            )
          )}
        </div>
      )}
    </section>

    <section
      id="cart"
      className="cart-section"
    >
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>
            Your cart is empty.
          </p>

          <a href="#products">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.product.id}
              >
                <img
                  src={item.product.image}
                  alt={
                    item.product.name
                  }
                />

                <div className="cart-item-info">
                  <h3>
                    {item.product.name}
                  </h3>

                  <p>
                    $
                    {item.product.price.toFixed(
                      2
                    )}
                  </p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.product.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.product.id
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(
                      item.product.id
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>

            <div className="summary-row">
              <span>Total</span>

              <strong>
                $
                {cartTotal.toFixed(
                  2
                )}
              </strong>
            </div>

            <Link
              href="/checkout"
              className="checkout-button"
            >
              Checkout
            </Link>

            <button
              type="button"
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </section>

    <footer>
      <p>
        © 2026 My E-Commerce Store
      </p>
    </footer>
  </main>
);
}