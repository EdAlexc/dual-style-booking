import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the GitHub Codespaces proxy origin during `next dev`.
  allowedDevOrigins: ["*.app.github.dev"],
  // The repo root has its own lockfile (bun.lock for the original Vite app);
  // pin the workspace root to this folder so Next doesn't infer the wrong one.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
