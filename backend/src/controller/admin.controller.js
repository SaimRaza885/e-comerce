import { Admin } from "../model/admin.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 🔑 Generate Tokens
const generateAccessAndRefreshToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);

    if (!admin) throw new ApiError(404, "Admin not found");

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save refreshToken in DB
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Failed to generate ACCESS and REFRESH token:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

export const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, password, validatorPassword } = req.body;

  // 🔎 Check if admin already exists
  const existingAdmin = await Admin.findOne({ fullName });

  if (existingAdmin) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Admin already exists"));
  }

  const validator = process.env.Password_To_Create_Admin === validatorPassword;

  if (!validator) {
    throw new ApiError(401, "U CAN NOT BE ADMMIN ");
  }
  // 🆕 Create new admin
  const createAdmin = await Admin.create({
    fullName,
    password,
  });

  if (!createAdmin) {
    throw new ApiError(500, "Cannot create admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Admin created successfully"));
});

// 🟢 Login Admin
export const loginAdmin = asyncHandler(async (req, res) => {
  const { fullName, password } = req.body;

  if (!fullName || !password) {
    throw new ApiError(400, "Full name and password are required");
  }

  const admin = await Admin.findOne({ fullName });
  if (!admin) {
    throw new ApiError(403, "Not allowed");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  const admindata = {
    _id: admin._id,
    fullName: admin.fullName,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
    __v: admin.__v,
  };

  const options ={ httpOnly: true, secure: false }

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { admindata, accessToken },
        "Admin logged in successfully"
      )
    );
});

// 🔴 Logout Admin
export const logoutAdmin = asyncHandler(async (req, res) => {

  await Admin.findOneAndUpdate(
      req.admin?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Admin logged out successfully"));
});

// 🟡 Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }

  const admin = await Admin.findById(req.admin?._id);
  if (!admin) throw new ApiError(404, "Admin not found");

  const isPasswordValid = await admin.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(401, "Old password is incorrect");

  // ✅ update password safely
  admin.password = newPassword;
  await admin.save(); // this triggers pre-save hashing

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

