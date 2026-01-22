import { z } from "zod";

const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters").max(100),
        urdu_name: z.string().min(1, "Urdu name is required"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        price: z.preprocess((val) => Number(val), z.number().positive("Price must be positive")),
        inStock: z.preprocess((val) => val === "true" || val === true, z.boolean()),
        stock: z.preprocess((val) => Number(val), z.number().int().nonnegative("Stock cannot be negative")),
    }),
});

const updateProductSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(100).optional(),
        urdu_name: z.string().optional(),
        description: z.string().min(10).optional(),
        price: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().positive().optional()),
        inStock: z.preprocess((val) => (val === undefined ? undefined : val === "true" || val === true), z.boolean().optional()),
        stock: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().nonnegative().optional()),
    }),
});

const getProductsQuerySchema = z.object({
    query: z.object({
        page: z.preprocess((val) => Number(val || 1), z.number().int().min(1)).optional(),
        limit: z.preprocess((val) => Number(val || 10), z.number().int().min(1).max(100)).optional(),
        sort: z.string().optional(),
        search: z.string().optional(),
        minPrice: z.preprocess((val) => (val ? Number(val) : undefined), z.number().nonnegative().optional()),
        maxPrice: z.preprocess((val) => (val ? Number(val) : undefined), z.number().nonnegative().optional()),
        inStock: z.preprocess((val) => (val === "true" ? true : val === "false" ? false : undefined), z.boolean().optional()),
    }).optional(),
});

export { createProductSchema, updateProductSchema, getProductsQuerySchema };
