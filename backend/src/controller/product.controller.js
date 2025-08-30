import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cloudinary_File_Upload, deleteOnCloudinary } from "../utils/upload_On_Cloudinary.js";
import slugify from "slugify";

// 🟢 Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const { title, urdu_name, description, price, inStock, stock } = req.body;

  if (!title || !urdu_name || !price || !inStock || !stock) {
    throw new ApiError(400, "Title, Urdu name, price, inStock, and stock are required");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  if (req.files.length > 4) {
    throw new ApiError(400, "You can upload a maximum of 4 images");
  }

  const uploadedImages = [];

  for (const file of req.files) {
    const result = await Cloudinary_File_Upload(file.buffer);

    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }
    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();

  const product = await Product.create({
    title,
    urdu_name,
    description,
    price,
    images: uploadedImages,
    inStock,
    stock,
    slug,
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

// 🟡 Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, urdu_name, description, price, inStock, stock } = req.body;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  product.title = title || product.title;
  product.urdu_name = urdu_name || product.urdu_name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.inStock = inStock !== undefined ? inStock : product.inStock;
  product.stock = stock || product.stock;

  // Update slug if title changed
  if (title && title !== product.title) {
    product.slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();
  }

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// 🔴 Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  for (const image of product.images) {
    if (image?.public_id) await deleteOnCloudinary(image.public_id);
  }

  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product and its images deleted successfully"));
});

// 🖼️ Update Product Images
export const updateProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image is required to update");
  }

  if (req.files.length + product.images.length > 4) {
    throw new ApiError(400, "You can upload a maximum of 4 images in total");
  }

  const uploadedImages = [];

  for (const file of req.files) {
    const result = await Cloudinary_File_Upload(file.path);
    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  // Optionally: Delete old images if you want to replace all
  for (const img of product.images) {
    if (img.public_id) await deleteOnCloudinary(img.public_id);
  }

  // Append new images
  product.images = [...product.images, ...uploadedImages];

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product images updated successfully"));
});



export const SeachProduct = asyncHandler(async (req, res) => {

  const query = req.query.q || "";
  const products = await Product.find({
    title: { $regex: query, $options: "i" }  // case-insensitive
  });

  return res.status(200).json(new ApiResponse(201, products, "Find the seached prodct"))

});