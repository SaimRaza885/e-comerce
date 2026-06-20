import multer from "multer";

// 🔹 Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// 🔹 Export middleware
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
