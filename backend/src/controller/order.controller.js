import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🟢 Create Order
export const createOrder = asyncHandler(async (req, res) => {
  if (req.user?.role === "admin") {
    throw new ApiError(403, "Admins cannot place orders");
  }
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

  // 2️⃣ Create Order (attach user if authenticated)
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

  // 3️⃣ Reduce Stock (atomic with rollback on failure)
  const decremented = [];
  try {
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) throw new Error(item.product);
      if (updated.stock === 0) {
        updated.inStock = false;
        await updated.save();
      }
      decremented.push(item);
    }
  } catch (err) {
    for (const d of decremented) {
      await Product.findByIdAndUpdate(d.product, { $inc: { stock: d.quantity } });
    }
    await Order.findByIdAndDelete(order._id);
    throw new ApiError(400, `Some items are no longer available in the requested quantity`);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// 🟢 Get Current User's Orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Your orders fetched successfully"));
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

// 🔴 Delete/Cancel Order
export const Delete_Order = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new ApiError(404, "Order not found");

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
      $set: { inStock: true },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

