import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000", // Your backend dev server
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
