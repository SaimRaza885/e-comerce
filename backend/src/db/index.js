import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


export const DB_Connection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(
      "!! MongoDB Connection Succeeded !! DB HOST:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("FAILED TO CONNECT DATABASE >>>", error);
    throw error;
  }
};
