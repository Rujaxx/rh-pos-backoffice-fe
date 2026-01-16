/**
 * Upload Utilities
 * Helper functions for handling upload URLs and S3 paths
 */

/**
 * @deprecated The backend now returns full URLs (e.g. logoUrl, primaryImageUrl). Use those fields directly instead.
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
 * Get key from S3 URL - extracts the S3 key (path) from a full S3 URL
 * @param url - The full S3 URL (e.g., https://bucket.s3.region.amazonaws.com/path/to/file.jpg)
 * @returns The S3 key (e.g., path/to/file.jpg) or empty string if invalid
 */
export const getKeyFromS3Url = (url: string): string => {
  if (!url) return '';

  // If it's not a full URL, assume it's already a key
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    // Remove leading slash from pathname to get the key
    const key = urlObj.pathname.startsWith('/')
      ? urlObj.pathname.slice(1)
      : urlObj.pathname;
    return key;
  } catch (error) {
    console.error('Failed to parse S3 URL:', error);
    return url; // Return original if parsing fails
  }
};

/**
 * Get fallback avatar URL for entities
 * @param name - Entity name to generate avatar for
 * @returns Avatar URL
 */
export const getFallbackAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
};
