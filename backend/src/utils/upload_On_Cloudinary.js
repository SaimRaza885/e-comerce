import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const Cloudinary_File_Upload = (fileBuffer) => {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
  configureCloudinary();
  try {
    if (!public_id) return null;
    return await cloudinary.uploader.destroy(public_id, { resource_type });
  } catch (error) {
    console.error("Delete on Cloudinary failed:", error);
    return error;
  }
};

export { Cloudinary_File_Upload, deleteOnCloudinary };
