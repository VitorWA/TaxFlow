import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 3000,
    },
    proxy: {
      "/api": {
        target: "http://taxflow-api:8080",
        changeOrigin: true,
      },
      "/sanctum": {
        target: "http://taxflow-api:8080",
        changeOrigin: true,
      },
    },
  },
});
