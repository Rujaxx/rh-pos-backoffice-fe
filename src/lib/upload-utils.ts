/**
 * Upload Utilities
 * Helper functions for handling upload URLs and S3 paths
 */

/**
 * Get full S3 URL from upload key
 * @param uploadKey - The S3 key returned from upload API
 * @returns Full S3 URL or empty string if no key
 */
export const getS3UrlFromKey = (
  uploadKey: string | null | undefined,
): string => {
  if (!uploadKey) return '';

  // If it's already a full URL, return as is
  if (uploadKey.startsWith('http')) {
    return uploadKey;
  }

  // Backend now returns full URLs; fallback to original key if not
  return uploadKey;
};

/**
 * Check if a URL is a valid S3 URL from our buckets
 * @param url - URL to check
 * @returns True if it's a valid S3 URL from our buckets
 */
export const isValidS3Url = (url: string): boolean => {
  if (!url) return false;

  const devBucketUrl =
    'https://rhpos-uploads-dev.s3.me-central-1.amazonaws.com';
  const prodBucketUrl =
    'https://rhpos-uploads-production.s3.me-central-1.amazonaws.com';

  return url.startsWith(devBucketUrl) || url.startsWith(prodBucketUrl);
};

/**
 * Extract S3 key from full S3 URL
 * @param url - Full S3 URL
 * @returns S3 key or original URL if not an S3 URL
 */
export const getKeyFromS3Url = (url: string): string => {
  if (!url) return '';

  const devBucketUrl =
    'https://rhpos-uploads-dev.s3.me-central-1.amazonaws.com/';
  const prodBucketUrl =
    'https://rhpos-uploads-production.s3.me-central-1.amazonaws.com/';

  if (url.startsWith(devBucketUrl)) {
    return url.replace(devBucketUrl, '');
  }

  if (url.startsWith(prodBucketUrl)) {
    return url.replace(prodBucketUrl, '');
  }

  return url;
};

/**
 * Get fallback avatar URL for entities
 * @param name - Entity name to generate avatar for
 * @returns Avatar URL
 */
export const getFallbackAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
};
