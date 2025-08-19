import { Router } from "express";
import { loginAdmin, logoutAdmin, changePassword, registerAdmin } from "../controller/admin.controller.js";
import  verifyAdminJWT  from "../middleware/verifyAdmin.middleware.js";

const adminRoutes = Router();

// 🟢 Admin Login
adminRoutes.post("/register", registerAdmin);
adminRoutes.post("/login", loginAdmin);

// 🔴 Admin Logout
adminRoutes.post("/logout", verifyAdminJWT, logoutAdmin);

// 🟡 Change Password (requires logged-in admin)
adminRoutes.post("/change-password", verifyAdminJWT, changePassword);

export default adminRoutes;
