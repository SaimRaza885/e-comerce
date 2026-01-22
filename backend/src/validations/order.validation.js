import { z } from "zod";

const createOrderSchema = z.object({
    body: z.object({
        Name: z.string().min(2, "Name is required"),
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        country: z.string().min(2, "Country is required"),
        city: z.string().min(2, "City is required"),
        street: z.string().min(2, "Street is required"),
        items: z.array(
            z.object({
                product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
                quantity: z.number().int().positive().default(1),
            })
        ).min(1, "At least one item is required"),
    }),
});

export { createOrderSchema };
