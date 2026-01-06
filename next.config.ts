// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,

  // Security headers including CSP for third-party images
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' https: http:",
              "connect-src 'self' https: http: ws: wss:",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  images: {
    // Uncomment the line below if you want to disable image optimization entirely
    // unoptimized: true,

    domains: [
      // Legacy domains array (deprecated but kept for backward compatibility)
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
        // Single bucket with environment folders (dev/, staging/, prod/)
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
        pathname: '/**',
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
