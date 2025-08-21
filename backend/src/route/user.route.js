import { Router } from "express";
import { login, logout, changePassword, registerUser, getUserById, updateUserAccount } from "../controller/user.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", login);
router.post("/logout", verifyJWT(), logout);
router.post("/change-password", verifyJWT(), changePassword);
router.get("/:id", verifyJWT(),getUserById );
router.post("/update/:id", verifyJWT(), updateUserAccount);

export default router;
