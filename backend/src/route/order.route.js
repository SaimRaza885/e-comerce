import express from "express";
import {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    Delete_Order,
    getMyOrders,
} from "../controller/order.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

// ------------------- User Routes -------------------

// Create a new order (optional auth — attaches user if logged in)
router.post("/create", optionalAuth, createOrder);

// Get current user's orders
router.get("/me", verifyJWT(), getMyOrders);

// Delete/cancel an order (admin only)
router.delete("/delete/:id", verifyJWT("admin"), Delete_Order);

// ------------------- Admin Routes -------------------

// Get all orders (admin)
router.get("/all", verifyJWT("admin"), getAllOrders);

// Update order status (admin)
router.put("/status/:id", verifyJWT("admin"), updateOrderStatus);

export default router;
