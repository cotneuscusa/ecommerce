import { z } from "zod";

export const productSchema = z.object({
id: z.number().int().positive(),
name: z.string().trim().min(1),
description: z.string().trim().min(1),
price: z.number().finite().nonnegative(),
image: z.string().trim().min(1),
category: z.string().trim().min(1),
});

export const productUpdateSchema =
productSchema.omit({
id: true,
});