import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    useCache: true
  },
  eslint: {
    // This allows the build to complete even if ESLint fails
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
