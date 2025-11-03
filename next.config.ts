import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { unoptimized: true },
    experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "pdfjs-dist"],
  },

};

export default nextConfig;
