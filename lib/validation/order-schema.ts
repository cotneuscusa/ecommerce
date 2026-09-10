import { z } from "zod";

export const orderSchema = z.object({
customer: z.object({
name: z.string().trim().min(1),
email: z.string().trim().email(),
address: z.string().trim().min(1),
city: z.string().trim().min(1),
postal: z.string().trim().min(1),
}),

idempotencyKey: z
.string()
.trim()
.min(1)
.max(200),
});