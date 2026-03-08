import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages handles the output automatically
  // No 'output: standalone' needed for Cloudflare
  
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Cloudflare Pages compatible settings
  images: {
    // Use Cloudflare Images or external image optimization
    unoptimized: true,
  },
  
  // Experimental features for edge runtime compatibility
  experimental: {
    // Enable for better Cloudflare Workers compatibility
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;
