import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  street: { type: String },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title: String,
      price: Number,
      quantity: Number,
    }
  ],

  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
