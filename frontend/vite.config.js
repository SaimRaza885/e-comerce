import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "https://backenddryfruits-production.up.railway.app/", // Your backend dev server
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
