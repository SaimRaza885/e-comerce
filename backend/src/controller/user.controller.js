
import { ApiError } from "../utils/Api_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { Cloudinary_File_Upload, deleteOnCloudinary } from "../utils/upload_On_Cloudinary.js";

// 🔑 Generate Tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "user not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refreshToken in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Failed to generate ACCESS and REFRESH token:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

//  =================================== Register User  =================================== 



// POST /api/user/register
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, adminSecret } = req.body;
  
  console.log("Received keys:", req.body);
console.log("Admin secret received:", adminSecret);
console.log(req.headers['content-type']);


  // 1️⃣ Required fields
  if (!fullName || !email || !password) {
    throw new ApiError(409, "Full name, email, and password are required");
  }

  // 2️⃣ Admin secret validation
  if (role === "admin") {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new ApiError(401, "Invalid admin secret");
    }
  }

  // 3️⃣ Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  // 4️⃣ Handle avatar upload (optional)
  // let avatar = null;
  // if (req.file && req.file.path) {
  //   const result = await Cloudinary_File_Upload(req.file.path);
  //   if (!result.url || !result.public_id) {
  //     throw new ApiError(400, "Failed to upload avatar");
  //   }
  //   avatar = { url: result.url, public_id: result.public_id };
  // }

  // 5️⃣ Create user (password hashing is handled by model pre-save hook)
  const newUser = await User.create({
    fullName,
    email,
    password,
    role,
    // avatar,
  });

  if (!newUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // 6️⃣ Return safe response (exclude password)
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        // avatar: newUser.avatar,
      },
      "User registered successfully"
    )
  );
});
;



// 🟢  ===================================  Login user  =================================== 
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(403, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const userData = {
    _id: user._id,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatar: user.avatar,
  };

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(new ApiResponse(200, { userData, accessToken }, "User logged in successfully"));
});


// 🔴 Logout user
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});


// 🟡 =================================== Change Password ===================================
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "user not found");


  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(401, "Old password is incorrect");

  // ✅ update password safely
  user.password = newPassword;
  await user.save(); // this triggers pre-save hashing

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
})



// ====================== Get user by ID (only admin or the user themselves)====================

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

;


// =================================== update use account ===================================
export const updateUserAccount = asyncHandler(async (req, res) => {

  const requester = req.user;

  // Only admin or the user themselves can update
  if (requester.role !== "admin" && requester._id.toString() !== userId) {
    throw new ApiError(403, "Access denied");
  }

  const user = await User.findById(requester._id);
  if (!user) throw new ApiError(404, "User not found");

  const { fullName } = req.body;

  // Update fields if provided
  if (fullName) user.fullName = fullName;
  // Handle avatar upload
  if (req.file && req.file.path) {
    // Delete old avatar from Cloudinary if exists
    if (user.avatar?.public_id) {
      await deleteOnCloudinary(user.avatar.public_id);
    }

    // Upload new avatar
    const result = await Cloudinary_File_Upload(req.file.path);
    if (!result.url || !result.public_id) {
      throw new ApiError(400, "Failed to upload avatar");
    }
    user.avatar = {
      url: result.url,
      public_id: result.public_id,
    };
  }

  await user.save();

  // Exclude sensitive fields in response
  const updatedUserData = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };


  return res.status(200).json(new ApiResponse(201, updatedUserData, "User updated successfully"))
});

