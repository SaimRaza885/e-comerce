// controllers/product.controller.js
import Product from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cloudinary_File_Upload } from "../utils/upload_On_Cloudinary.js";

// 🟢 Create Product

export const createProduct = asyncHandler(async (req, res) => {
  const { title, urdu_name, description, price, inStock } = req.body;

  if (!title || !urdu_name || !price) {
    throw new ApiError(400, "Title, Urdu name and price are required");
  }

  // Upload images to cloudinary
  const uploadedImages = [];
  const fileFields = ["main", "image2", "image3", "image4"];

  for (const field of fileFields) {
    if (req.files?.[field]) {
      const filePath = req.files?.[field][0].path;
      const result = await Cloudinary_File_Upload(filePath);
      if (result) {
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      } else {
        throw new ApiError(500, "Failed to upload on cloudinary");
      }
    }
  }

  if (uploadedImages.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const product = await Product.create({
    title,
    urdu_name,
    description,
    price,
    images: uploadedImages,
    inStock,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// 🟡 Get All Products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// 🔵 Get Single Product
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, urdu_name, description, price, inStock } = req.body;

  // Find product first
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Update fields
  product.title = title || product.title;
  product.urdu_name = urdu_name || product.urdu_name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.inStock = inStock !== undefined ? inStock : product.inStock;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// .................... image updating remaing ............................

// 🔴 Delete Product  also this
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

// Update all the images

export const updateProductImages = asyncHandler(async (req, res) => {


  
});
