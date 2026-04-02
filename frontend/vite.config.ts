import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

// Custom plugin: serve index.html for all non-asset routes (SPA fallback)
// This fixes the 404 on hard refresh for React Router client-side routes
function spaFallback(): Plugin {
  return {
    name: "spa-fallback",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? "";
        // If the request is for a file (has extension) or is an API call, skip
        if (url.includes(".") || url.startsWith("/api") || url.startsWith("/ws") || url.startsWith("/@")) {
          return next();
        }
        // Rewrite all other routes to index.html so React Router handles them
        req.url = "/";
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  define: {
    global: "window",
  },
});
