import jwt from "jsonwebtoken";
import { ApiError } from "../utils/Api_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../model/admin.model.js";

 const verifyAdminJWT = asyncHandler(async (req, _, next) => {
 try {
     const token =
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer ", "");
   
     if (!token) {
       throw new ApiError(400, "UnAuthorized Request ??");
     }
   
     const decodedTokenInfo = jwt.verify(
       token,
       process.env.JWT_ACCESS_TOKEN_SECRET
     );
   
     const admin = await Admin.findById(decodedTokenInfo._id)
   
     if (!admin) {
       throw new ApiError(401, "admin Not  Exist");
     }
   
     req.admin = admin;
     next();
 } catch (error) {
    throw new ApiError(401,"Invalid Access Token",error?.message)
 }
});

export default verifyAdminJWT
