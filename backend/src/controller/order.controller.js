import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🟢 Create Order
export const createOrder = asyncHandler(async (req, res) => {
  const { phone, country, city, street, items } = req.body;

  if (!phone || !country || !city || !street || !items || items.length === 0) {
    throw new ApiError(400, "All fields and at least one item are required");
  }

  // calculate total price
  let totalPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new ApiError(404, "Product not found");
    totalPrice += product.price * (item.quantity || 1);
  }

  const order = await Order.create({
    user: req.user?._id || null, // if user is logged in
    phone,
    country,
    city,
    street,
    items,
    totalPrice,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// 🟡 Get all orders of a single user
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

// 🔵 Get all orders for admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "fullName email")
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// 🟣 Update order status (admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "shipped", "delivered", "canceled"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// 🔴 Cancel order (user)
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, user: req.user._id });
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status !== "pending") {
    throw new ApiError(400, "Only pending orders can be canceled");
  }

  order.status = "canceled";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order canceled successfully"));
});
