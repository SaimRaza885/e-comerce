// middlewares/verifyJWT.js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/Api_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";

const verifyJWT = (requiredRole = null) =>
  asyncHandler(async (req, _, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // If a role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      throw new ApiError(403, `Access denied for role: ${user.role}`);
    }

    req.user = user; // Save user in request
    next();
  });

export default verifyJWT;
