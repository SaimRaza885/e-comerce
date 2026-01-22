import { Router } from "express";
import { login, logout, changePassword, registerUser, getCurrentUser, updateUserAccount, refreshAccessToken } from "../controller/user.controller.js";
import verifyJWT from "../middleware/verifyAdmin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../validations/user.validation.js";

const router = Router();

router.post("/register", upload.single("avatar"), validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT(), logout);
router.put("/change-password", verifyJWT(), validate(changePasswordSchema), changePassword);
router.get("/me", verifyJWT(), getCurrentUser);
router.put("/update/:userId", verifyJWT(), updateUserAccount);
router.post("/refresh", refreshAccessToken);

export default router;
