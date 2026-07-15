import type { NextConfig } from "next";

// Set GITHUB_PAGES=true (done by .github/workflows/deploy.yml) to produce a
// fully static export served from the repo subpath on GitHub Pages.
// Vercel / local dev builds are unaffected.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/dual-style-booking" : "";

const nextConfig: NextConfig = {
  // Allow the GitHub Codespaces proxy origin during `next dev`.
  allowedDevOrigins: ["*.app.github.dev"],
  // Pin the workspace root so Next doesn't infer it from stray lockfiles.
  outputFileTracingRoot: process.cwd(),
  ...(isGithubPages && {
    output: "export",
    basePath,
    images: { unoptimized: true },
  }),
  env: {
    // Lets components prefix absolute URLs (video sources, favicon) that
    // Next doesn't rewrite automatically under a basePath.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
