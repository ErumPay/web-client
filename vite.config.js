import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/backend/auth": {
          target: env.VITE_AUTH_PROXY_TARGET || "http://localhost:8091",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/backend\/auth/, ""),
        },
        "/backend/merchant": {
          target: env.VITE_MERCHANT_PROXY_TARGET || "http://localhost:8094",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/backend\/merchant/, ""),
        },
      },
    },
  };
});
