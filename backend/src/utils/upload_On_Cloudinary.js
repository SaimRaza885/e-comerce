import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dwhudpkbq",
  api_key: "771867698816852",
  api_secret: "woSyf7VPuLVhfD0PHW4BgpJ37wA", 
});


const Cloudinary_File_Upload = async (FilePath) => {
  try {
    if (!FilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(FilePath, {
      resource_type: "auto",
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  } finally {
    try {
      if (fs.existsSync(FilePath)) {
        fs.unlinkSync(FilePath); // Clean up temp file safely
      }
    } catch (unlinkError) {
      console.error("File cleanup failed:", unlinkError);
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
