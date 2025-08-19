import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "", 
});

const Cloudinary_File_Upload = async (FilePath) => {
  try {
    if (!FilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(FilePath, {
      resource_type: "auto",
    });

    return uploadResult;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error.message);
    return null;
  } finally {
    if (fs.existsSync(FilePath)) {
      fs.unlinkSync(FilePath); // Clean up the temp file
    }
  }
};

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) return null;

    const result = await cloudinary.uploader.destroy(public_id, { resource_type :`${resource_type}` });
    return result;
  } catch (error) {
    console.log("Delete on Cloudinary failed:", error);
    return error;
  }
};



export { Cloudinary_File_Upload ,deleteOnCloudinary };
