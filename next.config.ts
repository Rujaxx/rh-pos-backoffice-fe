// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: [
      'rhposs-uploads.s3.us-east-1.amazonaws.com',
      'ui-avatars.com',
      'images.unsplash.com',
      'via.placehold.co',
      's3.us-east-1.amazonaws.com',
    ],
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
        // Primary S3 bucket - exact match
        protocol: 'https',
        hostname: 'rhposs-uploads.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        // Alternative S3 URL format (s3.region.amazonaws.com/bucket-name/...)
        protocol: 'https',
        hostname: 's3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/rhposs-uploads/**',
        search: '',
      },
      {
        // Wildcard for any S3 subdomain (**.s3.amazonaws.com)
        // This catches: bucket.s3.region.amazonaws.com
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
        port: '',
        search: '',
      },
      {
        // Wildcard for S3 with region (**.amazonaws.com)
        // This catches: bucket.s3.us-east-1.amazonaws.com
        protocol: 'https',
        hostname: '**.amazonaws.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
