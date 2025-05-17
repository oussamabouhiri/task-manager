import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: true,
    // Add this to prevent CSS ordering issues
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      { find: "pages", replacement: path.resolve(__dirname, "src/pages") },
      {
        find: "contexts",
        replacement: path.resolve(__dirname, "src/contexts"),
      },
      {
        find: "services",
        replacement: path.resolve(__dirname, "src/services"),
      },
      { find: "utils", replacement: path.resolve(__dirname, "src/utils") },
    ],
  },
  define: {
    // Handle environment variables more safely
    "process.env": Object.keys(process.env).reduce((env, key) => {
      if (key.startsWith("VITE_")) {
        env[key] = JSON.stringify(process.env[key]);
      }
      return env;
    }, {}),
  },
});
