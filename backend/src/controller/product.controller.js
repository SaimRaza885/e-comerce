// controllers/product.controller.js
import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cloudinary_File_Upload, deleteOnCloudinary } from "../utils/upload_On_Cloudinary.js";

// 🟢 Create Product

export const createProduct = asyncHandler(async (req, res) => {
  const { title, urdu_name, description, price, inStock, stock } = req.body;

  if (!title || !urdu_name || !price || !inStock || !stock) {
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
    stock
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
  const { title, urdu_name, description, price, inStock, stock } = req.body;

  // Find product first
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Update fields
  product.title = title || product.title;
  product.urdu_name = urdu_name || product.urdu_name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.inStock = inStock !== undefined ? inStock : product.inStock;
  product.stock = stock || product.stock;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});


// 🔴 Delete Product  also this
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Delete each image from Cloudinary
  for (const image of product.images) {
    if (image?.public_id) {
      await deleteOnCloudinary(image.public_id);
    }
  }

  // Delete product from DB
  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product and its images deleted successfully"));
});


/**
 * 🖼️ Update Product Images (partial)
 */
export const updateProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find product
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Collect updated images
  let updatedImages = [...product.images];

  // Map through uploaded files (e.g. { main: [file], image2: [file] })
  for (const field in req.files) {
    const file = req.files[field]?.[0];
    if (!file) continue;

    // Upload new image to Cloudinary
    const result = await Cloudinary_File_Upload(file.path);

    // if (!result) continue;
    if (!result.url) {
      throw new ApiError(400, "Faild to  upload on cloudinary ")
    }

    // Replace old image if exists
    const fieldIndexMap = { main: 0, image2: 1, image3: 2, image4: 3 };
    const index = fieldIndexMap[field];

    if (updatedImages[index]) {
      // delete old image from Cloudinary
      if (updatedImages[index].public_id) {
        await deleteOnCloudinary(updatedImages[index].public_id);
      }
      updatedImages[index] = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } else {
      // if no image in this slot, just push new
      updatedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  product.images = updatedImages;
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product images updated successfully"));
});

