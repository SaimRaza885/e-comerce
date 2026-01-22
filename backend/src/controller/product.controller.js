import { Product } from "../model/product.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cloudinary_File_Upload, deleteOnCloudinary } from "../utils/upload_On_Cloudinary.js";
import slugify from "slugify";

// 🟢 Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const { title, urdu_name, description, price, inStock, stock } = req.body;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const uploadedImages = [];

  for (const file of req.files) {
    // Handling both buffer (memoryStorage) and path (diskStorage)
    const fileToUpload = file.path || file.buffer;
    const result = await Cloudinary_File_Upload(fileToUpload);

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

// 🟡 Get All Products (with Pagination & Filtering)
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort, search, minPrice, maxPrice, inStock } = req.query;

  const queryObj = {};

  // 1️⃣ Filtering
  if (search) {
    queryObj.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    queryObj.price = {};
    if (minPrice !== undefined) queryObj.price.$gte = minPrice;
    if (maxPrice !== undefined) queryObj.price.$lte = maxPrice;
  }

  if (inStock !== undefined) {
    queryObj.inStock = inStock;
  }

  // 2️⃣ Sorting
  let sortBy = { createdAt: -1 };
  if (sort) {
    const [field, order] = sort.split(":");
    sortBy = { [field]: order === "desc" ? -1 : 1 };
  }

  // 3️⃣ Pagination
  const skip = (page - 1) * limit;

  const products = await Product.find(queryObj)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(queryObj);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, "Products fetched successfully"));
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

  if (title) {
    product.title = title;
    product.slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();
  }
  if (urdu_name) product.urdu_name = urdu_name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (inStock !== undefined) product.inStock = inStock;
  if (stock !== undefined) product.stock = stock;

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

  // Delete images from Cloudinary
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

  const uploadedImages = [];

  for (const file of req.files) {
    const fileToUpload = file.path || file.buffer;
    const result = await Cloudinary_File_Upload(fileToUpload);
    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  // Delete old images from Cloudinary
  for (const img of product.images) {
    if (img.public_id) await deleteOnCloudinary(img.public_id);
  }

  // Replace with new images
  product.images = uploadedImages;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product images updated successfully"));
});

export const SeachProduct = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const products = await Product.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ]
  });

  return res.status(200).json(new ApiResponse(200, products, "Search results fetched successfully"));
});
