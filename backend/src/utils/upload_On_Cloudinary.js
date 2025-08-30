import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: "dwhudpkbq",
  api_key: "771867698816852",
  api_secret: "woSyf7VPuLVhfD0PHW4BgpJ37wA",
});

const Cloudinary_File_Upload = (fileBuffer) => {
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
  try {
    if (!public_id) return null;
    return await cloudinary.uploader.destroy(public_id, { resource_type });
  } catch (error) {
    console.error("Delete on Cloudinary failed:", error);
    return error;
  }
};

export { Cloudinary_File_Upload, deleteOnCloudinary };
