import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import manifest from "./package.json" with { type: "json" };

const externals = Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies });

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "target/npm",
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: "index",
      cssFileName: "style",
    },
    rolldownOptions: {
      external: (id) => !id.endsWith("?raw") && externals.some((name) => id === name || id.startsWith(name + "/")),
    },
  },
});
