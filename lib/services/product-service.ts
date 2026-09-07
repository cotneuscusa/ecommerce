import {
getAllProducts,
getProductById,
createProduct,
updateProduct,
deleteProduct,
} from "@/lib/repositories/products";

type ProductInput = {
id: number;
name: string;
description: string;
price: number;
image: string;
category: string;
};

type ProductUpdateInput = Omit<
ProductInput,
"id"
>;

function validateProductFields(
product: ProductUpdateInput
) {
if (
    typeof product.name !== "string" ||
    product.name.trim() === "" ||
    typeof product.description !== "string" ||
    product.description.trim() === "" ||
    typeof product.image !== "string" ||
    product.image.trim() === "" ||
    typeof product.category !== "string" ||
    product.category.trim() === "" ||
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    product.price < 0
) {
    throw new Error("Invalid product data.");
}
}

export async function getProducts(): Promise<ProductInput[]> {
const products = await getAllProducts();

return products.map((product) => ({
    id: Number(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
}));
}

export async function getProduct(
id: string
): Promise<ProductInput | null> {
const product = await getProductById(id);

if (!product) {
    return null;
}

return {
    id: Number(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
};
}

export async function createProductFromInput(
product: ProductInput
) {
if (
    typeof product.id !== "number" ||
    !Number.isInteger(product.id) ||
    product.id <= 0
) {
    throw new Error("Invalid product data.");
}

validateProductFields(product);

return createProduct({
    id: String(product.id),
    name: product.name.trim(),
    description: product.description.trim(),
    price: product.price,
    image: product.image.trim(),
    category: product.category.trim(),
});
}

export async function updateProductFromInput(
id: string,
product: ProductUpdateInput
) {
if (!id) {
    throw new Error("Invalid product ID.");
}

validateProductFields(product);

return updateProduct(id, {
    name: product.name.trim(),
    description: product.description.trim(),
    price: product.price,
    image: product.image.trim(),
    category: product.category.trim(),
});
}

export async function deleteProductById(
id: string
) {
if (!id) {
    throw new Error("Invalid product ID.");
}

return deleteProduct(id);
}