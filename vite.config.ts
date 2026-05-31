import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photosDir = path.resolve(__dirname, "src/data/photos");

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function serveLocalPhotos(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const relativePath = urlPath.replace(/^\/+/, "");
  const filePath = path.normalize(path.join(photosDir, relativePath));

  if (!filePath.startsWith(photosDir)) {
    res.statusCode = 403;
    res.end();
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    next();
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", MIME_TYPES[ext] ?? "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

function localPhotosPlugin(): Plugin {
  return {
    name: "local-photos",
    configureServer(server) {
      server.middlewares.use("/photos", serveLocalPhotos);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/photos", serveLocalPhotos);
    },
  };
}

function ghPagesSpaFallback(): Plugin {
  return {
    name: "gh-pages-spa-fallback",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      fs.copyFileSync(
        path.join(dist, "index.html"),
        path.join(dist, "404.html"),
      );
    },
  };
}

export default defineConfig({
  base: "/trip-planner/",
  plugins: [tailwindcss(), localPhotosPlugin(), ghPagesSpaFallback()],
});
