import express from "express";
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
} from "../controller/order.controller.js";
import verifyJWT from "../middleware/verifyAdmin.middleware.js";
import app from "../app.js";

const router = express.Router();

app.use(verifyJWT)

// User routes
router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.put("/cancel/:id", cancelOrder);

// Admin routes
router.get("/all", getAllOrders);
router.put("/status/:id", updateOrderStatus);

export default router;
