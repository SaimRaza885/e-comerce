import mongoose from "mongoose";
import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Order
export const createOrder = asyncHandler(async (req, res) => {
  if (req.user?.role === "admin") {
    throw new ApiError(403, "Admins cannot place orders");
  }
  const { Name, phone, country, city, street, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "At least one item is required");
  }
  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw new ApiError(400, "Invalid product ID in order items");
    }
    const qty = Number(item.quantity) || 1;
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) {
      throw new ApiError(400, "Item quantity must be a positive integer (max 999)");
    }
    item.quantity = qty;
  }

  let totalPrice = 0;
  const orderItems = [];

  //  Validate products and calculate total price
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product not found with id: ${item.product}`);
    }

    if (!product.inStock || product.stock < item.quantity) {
      throw new ApiError(400, `Product ${product.title} is out of stock or insufficient quantity`);
    }

    totalPrice += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      quantity: item.quantity,
    });
  }

  //  Create Order (attach user if authenticated)
  const orderData = {
    Name,
    phone,
    country,
    city,
    street,
    items: orderItems,
    totalPrice,
  };
  if (req.user?._id) {
    orderData.user = req.user._id;
  }
  const order = await Order.create(orderData);

  // Reduce Stock (atomic with rollback on failure)
  const decremented = [];
  try {
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) throw new Error(item.product);
      if (updated.stock <= 0) {
        await Product.findByIdAndUpdate(item.product, { inStock: false });
      }
      decremented.push(item);
    }
  } catch (err) {
    for (const d of decremented) {
      const restored = await Product.findByIdAndUpdate(
        d.product,
        { $inc: { stock: d.quantity } },
        { new: true }
      );
      if (restored && restored.stock > 0) {
        await Product.findByIdAndUpdate(d.product, { inStock: true });
      }
    }
    await Order.findByIdAndDelete(order._id);
    throw new ApiError(400, "Some items are no longer available in the requested quantity");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

//  Get Current User's Orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Your orders fetched successfully"));
});

//  Get All Orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

//  Update Order Status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "shipped", "delivered", "canceled"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");

  const validTransitions = {
    pending: ["shipped", "canceled"],
    shipped: ["delivered", "canceled"],
    delivered: [],
    canceled: [],
  };
  if (!validTransitions[order.status]?.includes(status)) {
    throw new ApiError(400, `Cannot change status from "${order.status}" to "${status}"`);
  }

  order.status = status;
  await order.save();

  if (status === "canceled") {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
        $set: { inStock: true },
      });
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

//  Delete/Cancel Order
export const Delete_Order = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new ApiError(404, "Order not found");

  for (const item of order.items) {
    const updated = await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } },
      { new: true }
    );
    if (updated && updated.stock > 0) {
      await Product.findByIdAndUpdate(item.product, { inStock: true });
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

