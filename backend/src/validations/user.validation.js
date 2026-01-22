import { z } from "zod";

const registerSchema = z.object({
    body: z.object({
        fullName: z.string().min(2, "Full name must be at least 2 characters").max(50),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["user", "admin"]).optional(),
        adminSecret: z.string().optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
    }),
});

export { registerSchema, loginSchema, changePasswordSchema };
