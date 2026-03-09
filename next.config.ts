import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Cloudflare Pages compatible settings
  images: {
    unoptimized: true,
  },
  
  // Use edge runtime for Cloudflare compatibility
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;
