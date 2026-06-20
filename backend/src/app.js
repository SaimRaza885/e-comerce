import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import { limiter } from "./middleware/rateLimiter.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// 🛡️ Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(morgan("dev")); // HTTP request logger
app.use(limiter); // Rate limiting

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://dry-fruits-gb.vercel.app",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));

// Disabled for Express 5 compatibility (read-only req.query)
// app.use(mongoSanitize());
// app.use(xss());
// app.use(hpp());

// Routes import
import userRoutes from "./route/user.route.js";
import productRoutes from "./route/product.route.js";
import orderRoutes from "./route/order.route.js";

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);

// Global Error Handler (should be the last middleware)
app.use(errorHandler);

export default app;
