import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'] as any,
};

export default nextConfig;
