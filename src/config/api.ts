/**
 * API Configuration
 * Environment-based configuration following Next.js best practices
 */

const getBaseUrl = (): string => {
  // Always use the environment variable if available
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  
  // Production fallback (update with your actual production API URL)
  if (process.env.NODE_ENV === 'production') return 'https://your-production-api.com'
  
  // Development fallback - your backend API server
  return 'http://localhost:3000'
}

/**
 * Get S3 upload base URL based on environment
 */
const getS3UploadBaseUrl = (): string => {
  // Production environment
  if (process.env.NODE_ENV === 'production') {
    return 'https://rhpos-uploads-production.s3.me-central-1.amazonaws.com'
  }
  
  // Development environment
  return 'https://rhpos-uploads-dev.s3.me-central-1.amazonaws.com'
}

const baseUrl = getBaseUrl()
const fullApiUrl = `${baseUrl}/api/v1`

export const API_CONFIG = {
  BASE_URL: fullApiUrl,
  S3_UPLOAD_BASE_URL: getS3UploadBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    GET: (id: string) => `/users/${id}`,
  },
  BRANDS: {
    LIST: '/brands',
    CREATE: '/brands',
    UPDATE: (id: string) => `/brands/${id}`,
    DELETE: (id: string) => `/brands/${id}`,
    GET: (id: string) => `/brands/${id}`,
  },
  RESTAURANTS: {
    LIST: '/restaurants',
    CREATE: '/restaurants',
    UPDATE: (id: string) => `/restaurants/${id}`,
    DELETE: (id: string) => `/restaurants/${id}`,
    GET: (id: string) => `/restaurants/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    GET: (id: string) => `/categories/${id}`,
  },
  TABLES: {
    LIST: '/tables',
    CREATE: '/tables',
    UPDATE: (id: string) => `/tables/${id}`,
    DELETE: (id: string) => `/tables/${id}`,
    GET: (id: string) => `/tables/${id}`,
  },
  TABLE_SECTIONS: {
    LIST: '/table-sections',
    CREATE: '/table-sections',
    UPDATE: (id: string) => `/table-sections/${id}`,
    DELETE: (id: string) => `/table-sections/${id}`,
    GET: (id: string) => `/table-sections/${id}`,
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES_MULTIPLE: '/upload/images/multiple',
    CONFIRM: '/upload/confirm',
    DELETE_TEMPORARY: '/upload/temporary',
  },
} as const

// Query keys for consistent caching
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  USERS: {
    LIST: (params?: Record<string, unknown>) => ['users', 'list', params] as const,
    DETAIL: (id: string) => ['users', 'detail', id] as const,
  },
  BRANDS: {
    LIST: (params?: Record<string, unknown>) => ['brands', 'list', params] as const,
    DETAIL: (id: string) => ['brands', 'detail', id] as const,
  },
  RESTAURANTS: {
    LIST: (params?: Record<string, unknown>) => ['restaurants', 'list', params] as const,
    DETAIL: (id: string) => ['restaurants', 'detail', id] as const,
  },
  CATEGORIES: {
    LIST: (params?: Record<string, unknown>) => ['categories', 'list', params] as const,
    DETAIL: (id: string) => ['categories', 'detail', id] as const,
  },
  TABLES: {
    LIST: (params?: Record<string, unknown>) => ['tables', 'list', params] as const,
    DETAIL: (id: string) => ['tables', 'detail', id] as const,
  },
  TABLE_SECTIONS: {
    LIST: (params?: Record<string, unknown>) => ['table-sections', 'list', params] as const,
    DETAIL: (id: string) => ['table-sections', 'detail', id] as const,
  },
  UPLOAD: {
    IMAGE: (key: string) => ['upload', 'image', key] as const,
  },
} as const