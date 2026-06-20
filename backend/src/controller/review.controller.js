import mongoose from "mongoose";
import { Review } from "../model/review.model.js";
import { Product } from "../model/product.model.js";
import { Order } from "../model/order.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { average = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(average * 10) / 10,
    reviewCount: count,
  });
};

export const createReview = asyncHandler(async (req, res) => {
  if (req.user.role === "admin") {
    throw new ApiError(403, "Admins cannot write reviews");
  }
  const { product, rating, comment } = req.body;
  const userId = req.user._id;

  const productExists = await Product.findById(product);
  if (!productExists) {
    throw new ApiError(404, "Product not found");
  }

  const hasBought = await Order.findOne({
    user: userId,
    status: "delivered",
    "items.product": product,
  });
  if (!hasBought) {
    throw new ApiError(403, "Only verified buyers can review this product");
  }

  const existing = await Review.findOne({ product, user: userId });
  if (existing) {
    throw new ApiError(400, "You already reviewed this product");
  }

  const review = await Review.create({ product, user: userId, rating, comment });
  try {
    await updateProductRating(product);
  } catch {
    await Review.findByIdAndDelete(review._id);
    throw new ApiError(500, "Failed to update product rating");
  }

  const populated = await Review.findById(review._id).populate("user", "fullName");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Review created"));
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const reviews = await Review.find({ product: productId })
    .populate("user", "fullName")
    .sort({ createdAt: -1 });

  const avgResult = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const stats = avgResult[0] || { average: 0, count: 0 };

  return res.status(200).json(
    new ApiResponse(200, { reviews, average: Math.round(stats.average * 10) / 10, count: stats.count })
  );
});

export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const review = await Review.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  if (review.user.toString() !== userId.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to edit this review");
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;
  await review.save();

  await updateProductRating(review.product);

  const populated = await Review.findById(review._id).populate("user", "fullName");

  return res.status(200).json(new ApiResponse(200, populated, "Review updated"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  if (review.user.toString() !== userId.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  const productId = review.product;
  await Review.findByIdAndDelete(id);
  await updateProductRating(productId);

  return res.status(200).json(new ApiResponse(200, null, "Review deleted"));
});
