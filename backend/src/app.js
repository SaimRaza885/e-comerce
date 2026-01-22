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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",              // local dev
  "https://dry-fruits-gb.vercel.app",   // deployed frontend
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl, etc.
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));

// 🛡️ Data Sanitization
app.use(mongoSanitize()); // Against NoSQL query injection
app.use(xss()); // Against XSS
app.use(hpp()); // Against HTTP Parameter Pollution

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
