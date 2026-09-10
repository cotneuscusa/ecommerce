import { auth } from "@/auth";

import {
getProducts,
createProductFromInput,
} from "@/lib/services/product-service";

import { productSchema } from "@/lib/validation/product-schema";

export async function GET() {
try {
const products = await getProducts();

return Response.json(products);

} catch (error) {
console.error("Products GET error:", error);

return Response.json(
{ error: "Failed to fetch products" },
{ status: 500 }
);

}
}

export async function POST(request: Request) {
const session = await auth();

if (!session?.user?.id) {
return Response.json(
{
error:
"You must be logged in to create a product.",
},
{ status: 401 }
);
}

if (session.user.role !== "admin") {
return Response.json(
{
error:
"You do not have permission to create products.",
},
{ status: 403 }
);
}

try {
let body: unknown;

try {
body = await request.json();
} catch {
return Response.json(
{ error: "Invalid JSON." },
{ status: 400 }
);
}

const validation = productSchema.safeParse(body);

if (!validation.success) {
return Response.json(
{
    error: "Invalid product data.",
    details: validation.error.flatten(),
},
{ status: 400 }
);
}

const createdProduct =
await createProductFromInput(validation.data);

return Response.json(
createdProduct,
{ status: 201 }
);

} catch (error) {
if (
error instanceof Error &&
error.name === "ConditionalCheckFailedException"
) {
return Response.json(
{
error:
"A product with this ID already exists.",
},
{ status: 409 }
);
}

console.error("Products POST error:", error);

return Response.json(
{ error: "Failed to create product" },
{ status: 500 }
);

}
}