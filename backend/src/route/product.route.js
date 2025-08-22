import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductImages,
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/verifyAdmin.middleware.js";

const router = Router();

// --------------------
// Public Routes
// --------------------
router.get("/all", getAllProducts);
router.get("/:id", getProductById);

// --------------------
// Admin Only Routes
// --------------------

// Create Product (up to 4 images in single 'images' field)
router.post(
  "/create",
  verifyJWT("admin"),
  upload.array("images", 4),
  createProduct
);

// Update Product (without images)
router.put("/update/:id", verifyJWT("admin"), updateProduct);

// Delete Product
router.delete("/delete/:id", verifyJWT("admin"), deleteProduct);

// Update Product Images (replace up to 4 images)
router.put(
  "/update/images/:id",
  verifyJWT("admin"),
  upload.array("images", 4),
  updateProductImages
);

export default router;
