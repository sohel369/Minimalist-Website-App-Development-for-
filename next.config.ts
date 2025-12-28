import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' for Vercel deployment
  // Vercel supports full Next.js features including SSR
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
