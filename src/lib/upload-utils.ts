/**
 * Upload Utilities
 * Helper functions for handling upload URLs and S3 paths
 */

/**
 * Get S3 URL - returns the input as-is since backend always provides full URLs
 * @param uploadKey - The S3 URL or key from the backend
 * @returns The URL or empty string if no value provided
 */
export const getS3UrlFromKey = (
  uploadKey: string | null | undefined,
): string => {
  if (!uploadKey) return '';
  return uploadKey;
};

/**
 * Check if a URL is a valid S3 URL
 * @param url - URL to check
 * @returns True if it's a valid HTTP/HTTPS URL
 */
export const isValidS3Url = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Get key from S3 URL - returns the input as-is since backend stores keys directly
 * @param url - The S3 key or URL from the backend
 * @returns The key or URL as-is
 */
export const getKeyFromS3Url = (url: string): string => {
  if (!url) return '';
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
