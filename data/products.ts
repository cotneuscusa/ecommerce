export type Product = {
id: number;
name: string;
description: string;
price: number;
image: string;
category: string;
};

export const products: Product[] = [
{
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones.",
    price: 29.99,
    image: "/products/headphones.jpg",
    category: "Electronics",
},
{
    id: 2,
    name: "Smart Watch",
    description: "Track your fitness and stay connected.",
    price: 39.99,
    image: "/products/watch.jpg",
    category: "Accessories",
},
{
    id: 3,
    name: "Keyboard",
    description: "Comfortable mechanical keyboard for work and gaming.",
    price: 49.99,
    image: "/products/keyboard.jpg",
    category: "Electronics",
},
];