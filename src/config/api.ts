/**
 * API Configuration
 * Environment-based configuration following Next.js best practices
 */

const getBaseUrl = (): string => {
  // Always use the environment variable if available
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // Production fallback (update with your actual production API URL)
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
  }

  // Development fallback - your backend API server
  return 'http://localhost:3000';
};

const baseUrl = getBaseUrl();
const fullApiUrl = `${baseUrl}/api/v1`;

export const API_CONFIG = {
  BASE_URL: fullApiUrl,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/password-reset/request',
    RESET_PASSWORD: '/auth/password-reset/confirm',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    GET: (id: string) => `/users/${id}`,
  },
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    GET: (id: string) => `/roles/${id}`,
  },
  PERMISSIONS: {
    LIST: '/permissions/modules',
    GET: (id: string) => `/permissions/${id}`,
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
  MENUS: {
    LIST: '/menus',
    CREATE: '/menus',
    UPDATE: (id: string) => `/menus/${id}`,
    DELETE: (id: string) => `/menus/${id}`,
    GET: (id: string) => `/menus/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    GET: (id: string) => `/categories/${id}`,
  },
  MENU_ITEMS: {
    LIST: '/menu-items',
    CREATE: '/menu-items',
    UPDATE: (id: string) => `/menu-items/${id}`,
    DELETE: (id: string) => `/menu-items/${id}`,
    GET: (id: string) => `/menu-items/${id}`,
  },
  KITCHEN_DEPARTMENTS: {
    LIST: '/kitchen-departments',
    CREATE: '/kitchen-departments',
    UPDATE: (id: string) => `/kitchen-departments/${id}`,
    DELETE: (id: string) => `/kitchen-departments/${id}`,
    GET: (id: string) => `/kitchen-departments/${id}`,
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
  TAX_PRODUCT_GROUPS: {
    LIST: '/tax-product-groups',
    CREATE: '/tax-product-groups',
    UPDATE: (id: string) => `/tax-product-groups/${id}`,
    DELETE: (id: string) => `/tax-product-groups/${id}`,
    GET: (id: string) => `/tax-product-groups/${id}`,
  },
  IMAGE_LIBRARY: {
    LIST: '/image-library',
    CREATE: '/image-library',
    UPDATE: (id: string) => `/image-library/${id}`,
    DELETE: (id: string) => `/image-library/${id}`,
    GET: (id: string) => `/image-library/${id}`,
  },
  REPORTS: {
    LIST_SALES: '/reports/sales',
    LIST_TDS: '/reports/tds-reports',
    GENERATE_TDS: '/reports/generate/tds-report',
    MEAL_TIME: '/reports/meal-time-report',
    ORDER_TYPE: '/reports/order-type',
  },
  BILLS: {
    UPDATE: (id: string) => `/bills/${id}`,
    DELETE: (id: string) => `/bills/${id}`,
  },
  DISCOUNTS: {
    LIST: '/discounts',
    CREATE: '/discounts',
    UPDATE: (id: string) => `/discounts/${id}`,
    DELETE: (id: string) => `/discounts/${id}`,
    GET: (id: string) => `/discounts/${id}`,
  },
  ORDER_TYPES: {
    LIST: '/order-types',
    GET: (id: string) => `/order-types/${id}`,
  },
  CUSTOMERS: {
    LIST: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    GET: (id: string) => `/customers/${id}`,
  },
  MEAL_TIME_FRAME: {
    LIST: '/meal-time-frame',
    LIST_BY_RESTAURANT: (restaurantId: string) =>
      `/meal-time-frame/${restaurantId}`,
    CREATE: '/meal-time-frame',
    GET: (id: string) => `/meal-time-frame/${id}`,
    UPDATE: (id: string) => `/meal-time-frame/${id}`,
    DELETE: (id: string) => `/meal-time-frame/${id}`,
  },
} as const;

// Query keys for consistent caching
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  USERS: {
    LIST: (params?: Record<string, unknown>) =>
      ['users', 'list', params] as const,
    DETAIL: (id: string) => ['users', 'detail', id] as const,
  },
  ROLES: {
    LIST: (params?: Record<string, unknown>) =>
      ['roles', 'list', params] as const,
    DETAIL: (id: string) => ['roles', 'detail', id] as const,
  },
  PERMISSIONS: {
    LIST: (params?: Record<string, unknown>) =>
      ['permissions', 'list', params] as const,
    DETAIL: (id: string) => ['permissions', 'detail', id] as const,
  },
  BRANDS: {
    LIST: (params?: Record<string, unknown>) =>
      ['brands', 'list', params] as const,
    DETAIL: (id: string) => ['brands', 'detail', id] as const,
  },
  RESTAURANTS: {
    LIST: (params?: Record<string, unknown>) =>
      ['restaurants', 'list', params] as const,
    DETAIL: (id: string) => ['restaurants', 'detail', id] as const,
  },
  MENUS: {
    LIST: (params?: Record<string, unknown>) =>
      ['menus', 'list', params] as const,
    DETAIL: (id: string) => ['menus', 'detail', id] as const,
  },
  CATEGORIES: {
    LIST: (params?: Record<string, unknown>) =>
      ['categories', 'list', params] as const,
    DETAIL: (id: string) => ['categories', 'detail', id] as const,
  },
  MENU_ITEMS: {
    LIST: (params?: Record<string, unknown>) =>
      ['menu-items', 'list', params] as const,
    DETAIL: (id: string) => ['menu-items', 'detail', id] as const,
  },
  KITCHEN_DEPARTMENTS: {
    LIST: (params?: Record<string, unknown>) =>
      ['kitchen-departments', 'list', params] as const,
    DETAIL: (id: string) => ['kitchen-departments', 'detail', id] as const,
  },
  TABLES: {
    LIST: (params?: Record<string, unknown>) =>
      ['tables', 'list', params] as const,
    DETAIL: (id: string) => ['tables', 'detail', id] as const,
  },
  TABLE_SECTIONS: {
    LIST: (params?: Record<string, unknown>) =>
      ['table-sections', 'list', params] as const,
    DETAIL: (id: string) => ['table-sections', 'detail', id] as const,
  },
  UPLOAD: {
    IMAGE: (key: string) => ['upload', 'image', key] as const,
  },
  TAX_PRODUCT_GROUPS: {
    LIST: (params?: Record<string, unknown>) =>
      ['tax-product-groups', 'list', params] as const,
    DETAIL: (id: string) => ['tax-product-groups', 'detail', id] as const,
  },
  IMAGE_LIBRARY: {
    LIST: (params?: Record<string, unknown>) =>
      ['image-library', 'list', params] as const,
    DETAIL: (id: string) => ['image-library', 'detail', id] as const,
  },
  REPORTS: {
    LIST: (params?: Record<string, unknown>) =>
      ['reports', 'list', params] as const,
    LIST_TDS: (params?: Record<string, unknown>) =>
      ['reports', 'tds-report', params] as const,
    GENERATE_TDS: (params?: Record<string, unknown>) =>
      ['reports', 'generate/tds-report', params] as const,
    MEAL_TIME: (params?: Record<string, unknown>) =>
      ['reports', 'meal-time-report', params] as const,
    ORDER_TYPE: (params?: Record<string, unknown>) =>
      ['reports', 'order-type', params] as const,
  },
  DISCOUNTS: {
    LIST: (params?: Record<string, unknown>) =>
      ['discounts', 'list', params] as const,
    DETAIL: (id: string) => ['discounts', 'detail', id] as const,
  },
  ORDER_TYPES: {
    LIST: (params?: Record<string, unknown>) =>
      ['order-types', 'list', params] as const,
    DETAIL: (id: string) => ['order-types', 'detail', id] as const,
  },
  CUSTOMERS: {
    LIST: (params?: Record<string, unknown>) =>
      ['customers', 'list', params] as const,
    DETAIL: (id: string) => ['customers', 'detail', id] as const,
  },
  MEAL_TIME_FRAME: {
    LIST: (params?: Record<string, unknown>) =>
      ['meal-time-frame', 'list', params] as const,
    DETAIL: (id: string) => ['meal-time-frame', 'detail', id] as const,
  },
} as const;
