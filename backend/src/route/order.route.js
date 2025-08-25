import express from "express";
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    Delete_Order, // renamed for consistency
} from "../controller/order.controller.js";
import verifyJWT from "../middleware/verifyAdmin.middleware.js"; // assuming it handles role checking

const router = express.Router();

// ------------------- User Routes -------------------

// Create a new order
router.post("/create", verifyJWT("user"), createOrder);

// Get orders of logged-in user
router.get("/my-orders", verifyJWT("user"), getUserOrders);

// Delete/cancel an order (only by owner)
router.delete("/delete/:id", verifyJWT(), Delete_Order);

// ------------------- Admin Routes -------------------

// Get all orders (admin)
router.get("/all", verifyJWT("admin"), getAllOrders);

// Update order status (admin)
router.put("/status/:id", verifyJWT("admin"), updateOrderStatus);

export default router;
