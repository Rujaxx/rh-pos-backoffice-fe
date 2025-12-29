// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'rhpos-uploads-dev.s3.me-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'rhpos-uploads-production.s3.me-central-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
