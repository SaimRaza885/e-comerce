import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductImages,
  SeachProduct,
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/verifyAdmin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema, getProductsQuerySchema } from "../validations/product.validation.js";

const router = Router();

// --------------------
// Public Routes
// --------------------
router.get("/all", validate(getProductsQuerySchema), getAllProducts);
router.get("/:id", getProductById);

// --------------------
// Admin Only Routes
// --------------------

// Create Product (up to 4 images in single 'images' field)
router.post(
  "/create",
  verifyJWT("admin"),
  upload.array("images", 4),
  validate(createProductSchema),
  createProduct
);

// Update Product (without images)
router.put("/update/:id", verifyJWT("admin"), validate(updateProductSchema), updateProduct);

// Delete Product
router.delete("/delete/:id", verifyJWT("admin"), deleteProduct);

// Update Product Images (replace up to 4 images)
router.put(
  "/images/update/",
  verifyJWT("admin"),
  upload.array("images", 4),
  updateProductImages
);

router.get("/search", SeachProduct)
export default router;
