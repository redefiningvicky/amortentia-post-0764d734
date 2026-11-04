import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
export default defineConfig({
  root: root + "pages",
  base: "./",
  publicDir: root + "public",
  // The guest-only static app does not need Lovable's backend credentials.
  envDir: root + "pages",
  envPrefix: "PAGES_PUBLIC_",
  define: { "import.meta.env.VITE_STATIC_PAGES": "true" },
  plugins: [{
    name: "pages-root",
    enforce: "pre",
    resolveId(id, importer) {
      if (id === "./routes/__root" && importer?.endsWith("/src/routeTree.gen.ts"))
        return root + "pages/root.tsx";
    },
  }, react(), tailwindcss()],
  resolve: { alias: { "@": root + "src" } },
  build: { outDir: root + "dist-pages", emptyOutDir: true },
});
