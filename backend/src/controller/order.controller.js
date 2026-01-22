import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🟢 Create Order
export const createOrder = asyncHandler(async (req, res) => {
  const { Name, phone, country, city, street, items } = req.body;

  let totalPrice = 0;
  const orderItems = [];

  // 1️⃣ Validate products and calculate total price
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

  // 2️⃣ Create Order
  const order = await Order.create({
    Name,
    phone,
    country,
    city,
    street,
    items: orderItems,
    totalPrice,
  });

  // 3️⃣ Reduce Stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });

    // Update inStock status if stock becomes 0
    const updatedProduct = await Product.findById(item.product);
    if (updatedProduct.stock === 0) {
      updatedProduct.inStock = false;
      await updatedProduct.save();
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// 🟡 Get All Orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// 🔵 Update Order Status
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

// 🔴 Delete/Cancel Order
export const Delete_Order = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new ApiError(404, "Order not found");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

