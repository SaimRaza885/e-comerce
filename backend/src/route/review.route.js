import { Router } from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controller/review.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";

const router = Router();

router.get("/product/:productId", getProductReviews);
router.post("/create", verifyJWT(), createReview);
router.put("/:id", verifyJWT(), updateReview);
router.delete("/:id", verifyJWT(), deleteReview);

export default router;
