// routes/product.routes.js
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import verifyAdminJWT from "../middleware/verifyAdmin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin Only Routes

router.route("/create/").post(
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  verifyAdminJWT,
  createProduct
);
router.put("/update/:id", verifyAdminJWT, updateProduct);
router.delete("/delete/:id", verifyAdminJWT, deleteProduct);

export default router;
