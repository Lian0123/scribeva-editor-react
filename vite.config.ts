import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/build.ts"),
      name: "ScribevaReact",
      formats: ["es", "cjs"],
      fileName: (format) =>
        `scribeva-react.${format === "es" ? "js" : "cjs"}`,
    },
    sourcemap: true,
    minify: "esbuild",
    target: "es2020",
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "scribeva-editor"],
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith(".css")
            ? "scribeva-react.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
});
