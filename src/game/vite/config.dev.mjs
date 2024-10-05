import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";

export default defineConfig({
  base: "./",
  plugins: [react(), polyfillNode()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        process: JSON.stringify({
          env: {},
        }),
      },
    },
  },
});
