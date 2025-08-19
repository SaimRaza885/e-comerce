import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes import

import adminRoutes from "./route/admin.route.js";
import productRoutes from "./route/product.route.js";
// Routes

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/product", productRoutes);

export default app;
