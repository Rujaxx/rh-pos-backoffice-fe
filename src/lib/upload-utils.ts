/**
 * Upload Utilities
 * Helper functions for handling upload URLs and S3 paths
 */

/**
 * Get full S3 URL from upload key
 * @param uploadKey - The S3 key returned from upload API
 * @returns Full S3 URL or empty string if no key
 */
const DEV_BUCKET_URL =
  'https://rhpos-uploads-dev.s3.me-central-1.amazonaws.com';
const PROD_BUCKET_URL =
  'https://rhpos-uploads-production.s3.me-central-1.amazonaws.com';

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

  // If it's a key, prepend the base URL (defaulting to dev for now)
  // Remove leading slash if present to avoid double slashes
  const cleanKey = uploadKey.startsWith('/') ? uploadKey.slice(1) : uploadKey;
  return `${DEV_BUCKET_URL}/${cleanKey}`;
};

/**
 * Check if a URL is a valid S3 URL from our buckets
 * @param url - URL to check
 * @returns True if it's a valid S3 URL from our buckets
 */
export const isValidS3Url = (url: string): boolean => {
  if (!url) return false;

  return url.startsWith(DEV_BUCKET_URL) || url.startsWith(PROD_BUCKET_URL);
};

/**
 * Extract S3 key from full S3 URL
 * @param url - Full S3 URL
 * @returns S3 key or original URL if not an S3 URL
 */
export const getKeyFromS3Url = (url: string): string => {
  if (!url) return '';

  if (url.startsWith(DEV_BUCKET_URL)) {
    return url.replace(DEV_BUCKET_URL + '/', '');
  }

  if (url.startsWith(PROD_BUCKET_URL)) {
    return url.replace(PROD_BUCKET_URL + '/', '');
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
