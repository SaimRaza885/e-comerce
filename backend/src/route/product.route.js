// routes/product.routes.js
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

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin Only Routes

router.route("/create").post(
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  verifyJWT("admin"),
  createProduct
);

router.put("/update/:id", verifyJWT("admin"), updateProduct);

router.delete("/delete/:id", verifyJWT("admin"), deleteProduct);

router.route("/update/:id/images").put(
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  verifyJWT("admin"),
  updateProductImages
);

export default router
