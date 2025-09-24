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

const baseUrl = getBaseUrl()
const fullApiUrl = `${baseUrl}/api/v1`

export const API_CONFIG = {
  BASE_URL: fullApiUrl,
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
} as const