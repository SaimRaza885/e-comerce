import { Order } from "../model/order.model.js"
import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createOrder = asyncHandler(async (req, res) => {
  const { Name,phone, country, city, street, items } = req.body;

  if (!phone || !country || !Name || !city || !street || !items || items.length === 0) {
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
    phone,
    country,
    city,
    street,
    items,
    totalPrice,
    Name
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});


export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("items.product", "title price images") // populate product info
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

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
export const Delete_Order = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOneAndDelete({ _id: id });
  if (!order) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

