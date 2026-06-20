import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const optionalAuth = async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (user) req.user = user;
  } catch {
    // Token invalid or expired — continue without user
  }
  next();
};

export default optionalAuth;
