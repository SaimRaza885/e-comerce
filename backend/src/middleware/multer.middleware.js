import multer from "multer";

// 🔹 Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// 🔹 Export middleware
export const upload = multer({ storage });
