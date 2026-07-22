import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  base: "./",
  plugins: [
    react(),
    {
      name: "dev-demo-entry",
      apply: "serve",
      transformIndexHtml(html) {
        return html.replace(
          '<script defer src="./assets/demo.js"></script>',
          '<script type="module" src="./main.tsx"></script>',
        );
      },
    },
  ],
  build: {
    outDir: resolve(__dirname, "demo-dist"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, "demo/build.html"),
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "assets/demo.js",
      },
    },
  },
});
