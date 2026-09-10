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

  const filteredProducts =
    products.filter((product) => {
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
    });

  const featuredProducts =
    products.slice(0, 4);

  const categoryProducts =
    categories
      .filter(
        (category) => category !== "All"
      )
      .slice(0, 4)
      .map((category) => ({
        name: category,
        product: products.find(
          (product) =>
            product.category ===
            category
        ),
      }));

  return (
    <main>
      <nav>
        <div className="nav-brand">
          <Link href="/">
            My Store
          </Link>
        </div>

        <div className="nav-links">
          <a href="#">
            Home
          </a>

          <a href="#categories">
            Categories
          </a>

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

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">
            WELCOME TO MY STORE
          </span>

          <h1>
            Find something
            <span> you'll love.</span>
          </h1>

          <p>
            Discover quality products,
            explore new collections,
            and enjoy a simple shopping
            experience.
          </p>

          <div className="hero-actions">
            <a
              href="#products"
              className="hero-primary-button"
            >
              Shop Now
            </a>

            <a
              href="#categories"
              className="hero-secondary-button"
            >
              Explore Categories
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />

          {products[0] && (
            <div className="hero-product-card">
              <span>
                Featured
              </span>

              <img
                src={products[0].image}
                alt={products[0].name}
              />

              <div>
                <strong>
                  {products[0].name}
                </strong>

                <p>
                  $
                  {products[0].price.toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="categories"
        className="categories-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              SHOP BY CATEGORY
            </span>

            <h2>
              Explore our collections
            </h2>
          </div>

          <a href="#products">
            View all products →
          </a>
        </div>

        {categoryProducts.length >
        0 ? (
          <div className="category-grid">
            {categoryProducts.map(
              ({
                name,
                product,
              }) => (
                <button
                  type="button"
                  className="category-card"
                  key={name}
                  onClick={() => {
                    setSelectedCategory(
                      name
                    );

                    document
                      .getElementById(
                        "products"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                      });
                  }}
                >
                  {product && (
                    <img
                      src={
                        product.image
                      }
                      alt={name}
                    />
                  )}

                  <div className="category-card-overlay">
                    <span>
                      Explore
                    </span>

                    <h3>
                      {name}
                    </h3>
                  </div>
                </button>
              )
            )}
          </div>
        ) : (
          <div className="category-placeholder">
            <p>
              Explore our products
              and discover what's
              available.
            </p>
          </div>
        )}
      </section>

      {featuredProducts.length >
        0 && (
        <section className="featured-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                FEATURED
              </span>

              <h2>
                Popular picks
              </h2>
            </div>

            <a href="#products">
              See all →
            </a>
          </div>

          <div className="featured-grid">
            {featuredProducts.map(
              (product) => (
                <div
                  className="featured-card"
                  key={product.id}
                >
                  <div className="featured-image">
                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                    />
                  </div>

                  <div className="featured-info">
                    <span>
                      {
                        product.category
                      }
                    </span>

                    <h3>
                      {
                        product.name
                      }
                    </h3>

                    <p>
                      $
                      {product.price.toFixed(
                        2
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      <section className="promo-banner">
        <div>
          <span>
            NEW COLLECTION
          </span>

          <h2>
            Something new
            is waiting for you.
          </h2>

          <p>
            Browse our latest
            products and find your
            next favorite.
          </p>
        </div>

        <a
          href="#products"
          className="promo-button"
        >
          Start Shopping
        </a>
      </section>

      <section
        id="products"
        className="products-section"
      >
        <div className="section-heading products-heading">
          <div>
            <span className="section-eyebrow">
              OUR PRODUCTS
            </span>

            <h2>
              Shop everything
            </h2>

            <p>
              Search through our
              complete collection.
            </p>
          </div>
        </div>

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
                  {category ===
                  "All"
                    ? "All Categories"
                    : category}
                </option>
              )
            )}
          </select>
        </div>

        {loadingProducts ? (
          <div className="empty-products">
            <p>
              Loading products...
            </p>
          </div>
        ) : productError ? (
          <div className="empty-products">
            <p>
              We couldn't load the
              products.
            </p>

            <p>
              Please refresh the
              page and try again.
            </p>
          </div>
        ) : products.length ===
          0 ? (
          <div className="empty-products">
            <p>
              No products are
              available right now.
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
          <div className="product-grid">
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

      <section className="benefits-section">
        <div className="section-heading centered-heading">
          <div>
            <span className="section-eyebrow">
              SHOP WITH CONFIDENCE
            </span>

            <h2>
              Why shop with us?
            </h2>
          </div>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              ✓
            </div>

            <h3>
              Secure Shopping
            </h3>

            <p>
              Your account and
              shopping experience
              are protected.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              ★
            </div>

            <h3>
              Quality Products
            </h3>

            <p>
              Discover products
              selected for our
              collection.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              ↻
            </div>

            <h3>
              Easy Shopping
            </h3>

            <p>
              Search, filter, add
              to cart, and checkout
              with ease.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              ♥
            </div>

            <h3>
              Wishlist
            </h3>

            <p>
              Save products you
              like and come back
              to them later.
            </p>
          </div>
        </div>
      </section>

      <section
        id="cart"
        className="cart-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              YOUR SHOPPING BAG
            </span>

            <h2>
              Shopping Cart
            </h2>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              🛒
            </div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Looks like you haven't
              added anything yet.
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
                  key={
                    item.product.id
                  }
                >
                  <img
                    src={
                      item.product
                        .image
                    }
                    alt={
                      item.product
                        .name
                    }
                  />

                  <div className="cart-item-info">
                    <h3>
                      {
                        item.product
                          .name
                      }
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
                            item
                              .product
                              .id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            item
                              .product
                              .id
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
                        item.product
                          .id
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <span className="summary-label">
                ORDER SUMMARY
              </span>

              <h3>
                Your Order
              </h3>

              <div className="summary-row">
                <span>
                  Items
                </span>

                <span>
                  {cartCount}
                </span>
              </div>

              <div className="summary-row">
                <span>
                  Total
                </span>

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
                onClick={
                  clearCart
                }
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </section>

      <footer>
        <div className="footer-content">
          <div>
            <h2>
              My Store
            </h2>

            <p>
              Simple shopping.
              Quality products.
            </p>
          </div>

          <div className="footer-links">
            <a href="#">
              Home
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#products">
              Products
            </a>

            <Link href="/wishlist">
              Wishlist
            </Link>

            <a href="#cart">
              Cart
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 My E-Commerce
            Store
          </p>

          <p>
            Built for a better
            shopping experience.
          </p>
        </div>
      </footer>
    </main>
  );
}