import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "client", "dist");

  if (!fs.existsSync(distPath)) {
    console.error("❌ client/dist folder not found. Did you run build?");
    return;
  }

  app.use(express.static(distPath));

  // React SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}