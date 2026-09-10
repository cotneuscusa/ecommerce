E-Commerce Application

A full-stack e-commerce application built with Next.js, React, TypeScript, and AWS DynamoDB.

The project was developed with a production-oriented architecture, focusing on clean separation of responsibilities, server-side business logic, authentication, validation, database access, error handling, and automated testing.

Features

Storefront

Responsive e-commerce interface
Product listing
Product details
Product categories
Product search and filtering
Related products
Product images and information
Loading, empty, and error states
404 handling

User Features

User registration
User login
Secure password hashing with bcrypt
Session-based authentication
User-specific shopping carts
Wishlist functionality
Duplicate prevention for wishlist items

Cart

Add products to cart
Increase/decrease quantities
Remove products
Cart persistence using DynamoDB
Quantity validation
Cart size limits
Server-side product and price verification during checkout

Orders

Authenticated checkout
Server-side order creation
Server-side price calculation
Order persistence in DynamoDB
User-specific order history
Transactional order creation and cart clearing
Idempotent checkout requests to prevent duplicate orders

Administration

Admin-only product creation
Admin-only product updates
Admin-only product deletion
Server-side role authorization

Tech Stack

Next.js 16
React 19
TypeScript
Tailwind CSS
NextAuth
Zod
AWS DynamoDB
AWS SDK for JavaScript
bcryptjs
Vitest

Architecture

The application follows a layered server-side architecture:

User → Next.js Application → API Layer → Service Layer → Repository Layer → DynamoDB

API Layer

Located under:

app/api/

Route handlers are responsible for:

Receiving HTTP requests
Authentication and authorization
Request validation
HTTP status codes and responses
Passing validated data to services

Service Layer

Located under:

lib/services/

Services contain application and business logic such as:

Product validation
Cart validation
Wishlist validation
Order creation
Server-side price verification
User registration
Authentication
Order queries

Repository Layer

Located under:

lib/repositories/

Repositories are responsible for DynamoDB operations.

This keeps database-specific logic separated from application and API logic.

Project Structure

app/

Application pages and layouts
API route handlers
Authentication pages
Product pages
Cart, wishlist, checkout, and order pages

lib/services/

Business logic
Validation and application rules
Authentication services

lib/repositories/

DynamoDB data-access functions

lib/validation/

Zod request schemas

lib/types.ts

Shared TypeScript types

lib/dynamodb.ts

DynamoDB client configuration

__tests__ / *.test.ts

Automated tests
DynamoDB Design

The application uses separate DynamoDB tables for the main entities.

Users

Table:

users

Primary key:

id

Stored information includes:

User ID
Email
Name
Password hash
Role

User registration creates users with the user role by default.

Products

Table:

products

Primary key:

id

Stored information includes:

Product ID
Name
Description
Price
Image
Category

Product creation prevents duplicate IDs.

Product updates require the product to already exist.

Carts

Table:

carts

Primary key:

userId

Each user has a cart containing their cart items.

Cart operations are restricted to the authenticated user's own cart.

Wishlists

Table:

wishlists

Primary key:

userId

Each user has a wishlist containing their selected products.

Duplicate product IDs are prevented by application-level validation.

Orders

Table:

orders

Primary key:

id

Orders contain:

Order ID
User ID
Customer information
Ordered products
Quantities
Server-calculated total
Order status
Creation timestamp

A global secondary index is used for user order history:

UserOrdersIndex

Partition key:

userId

This allows orders to be queried by authenticated user without scanning the entire orders table.

Checkout and Data Integrity

Checkout does not trust prices supplied by the client.

When an order is created:

The authenticated user's session is verified.
The user's cart is loaded.
Each product is retrieved from DynamoDB.
Current database prices are used.
Quantities are validated.
The total is calculated server-side.
The order is written to DynamoDB.
The cart is cleared in the same DynamoDB transaction.

Order creation uses an idempotency key and deterministic order ID to prevent duplicate orders from concurrent/repeated checkout requests.

Authentication and Authorization

Authentication uses NextAuth credentials authentication.

Passwords are hashed using bcrypt before being stored.

Authorization is enforced server-side for protected operations.

Admin product operations require:

session.user.role === "admin"

Users cannot assign themselves the admin role during registration.

The current user role is refreshed from the database when the authentication token is processed so that changes to a user's role are reflected in authorization decisions.

Validation

The application uses Zod for API request validation.

Validation schemas are located in:

lib/validation/

Examples include:

Product creation
Product updates
Order creation

Validation occurs before data reaches the service/database layer.

Business-level validation is also performed inside services to protect application logic regardless of the API caller.

Error Handling

API routes return appropriate HTTP status codes for common failures, including:

400 — Invalid request data
401 — Authentication required
403 — Insufficient permissions
404 — Resource not found
409 — Resource conflict
500 — Unexpected server error

Internal database errors are not returned directly to clients.

Testing

The project uses Vitest for automated testing.

Current tests cover:

Authentication
User registration
Product/cart validation
Wishlist validation
Order creation logic
Order repository behavior
Idempotent order creation
DynamoDB transaction behavior
User-specific order queries

Run the test suite with:

npm test

The current test suite contains 45 tests.

Environment Variables

Create a .env.local file in the project root.

Required AWS configuration depends on the local AWS setup used for DynamoDB.

Example:

AWS_ACCESS_KEY_ID=your_access_key

AWS_SECRET_ACCESS_KEY=your_secret_key

AWS_REGION=your_region

Authentication configuration should also be provided through environment variables as required by the NextAuth setup.

Do not commit .env.local or other files containing secrets to Git.

Getting Started

Install dependencies:

npm install

Run the development server:

npm run dev

Open:

http://localhost:3000

Available Scripts

npm run dev

Starts the development server.

npm run build

Creates a production build and performs TypeScript/build validation.

npm run start

Starts the production server.

npm test

Runs the automated test suite.

npm run lint

Runs ESLint.

Production Build

Before deployment, verify:

npm test

and:

npm run build

Both should complete successfully.

Future Improvements

Potential future improvements include:

Production-grade distributed rate limiting
More granular product/category database indexes
Pagination for large product collections
More comprehensive integration and end-to-end tests
Payment provider integration
Inventory management
Order status management
Production monitoring and logging

This project is intended as a production-style demonstration of full-stack development, API design, business logic, database access patterns, authentication, validation, and testing.