/**
 * Axios Configuration
 * Advanced HTTP client setup with interceptors, retry logic, and error handling
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '@/config/api';
import { ApiError, ErrorResponse, SuccessResponse } from '@/types/api';
import { useAuthStore } from '@/stores/auth.store';

// Interface for config with retry properties
interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  __retryCount?: number;
  method?: string;
  _retry?: boolean;
}

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from store
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Track requests being retried to prevent infinite loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  ((response: AxiosResponse) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const endTime = new Date();
      const startTime = response.config.metadata?.startTime;
      if (startTime) {
        const duration = endTime.getTime() - startTime.getTime();
        console.log(
          `🚀 ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`,
        );
      }
    }

    // Return the data directly for successful responses
    return response.data as SuccessResponse<unknown>;
  }) as unknown as Parameters<typeof api.interceptors.response.use>[0],
  async (error: AxiosError<ErrorResponse>) => {
    const { response, config } = error;
    const originalRequest = config as RetryableAxiosRequestConfig;

    // Handle network errors
    if (!response) {
      throw new ApiError({
        success: false,
        statusCode: 0,
        message: 'Network error occurred. Please check your connection.',
        timestamp: new Date().toISOString(),
        path: config?.url || '',
        errorCode: 'NETWORK_ERROR',
      });
    }

    const errorData = response.data;

    // Handle authentication errors with token refresh
    if (errorData.statusCode === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to prevent infinite loops
      const isAuthEndpoint = originalRequest.url?.includes('/auth/');

      // Don't logout/redirect for login and register endpoints - let component handle the error
      const isLoginOrRegister =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register');

      if (isAuthEndpoint) {
        // For login/register, just throw the error without logout/redirect
        if (isLoginOrRegister) {
          throw new ApiError(errorData);
        }

        // For other auth endpoints (e.g., profile), logout and redirect
        const { logout } = useAuthStore.getState();
        logout();

        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        throw new ApiError(errorData);
      }

      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry original request with new token
            const { accessToken } = useAuthStore.getState();
            if (originalRequest.headers && accessToken) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            throw err;
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshTokens } = useAuthStore.getState();
        const refreshSuccess = await refreshTokens();

        if (refreshSuccess) {
          const { accessToken } = useAuthStore.getState();
          processQueue(null, accessToken);

          // Retry original request with new token
          if (originalRequest.headers && accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return api(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth and redirect - this will happen in the store's refreshTokens method
        // for expired refresh tokens, otherwise redirect to login
        if (
          !(
            refreshError instanceof Error &&
            refreshError.message === 'REFRESH_TOKEN_EXPIRED'
          )
        ) {
          const { logout } = useAuthStore.getState();
          logout();

          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }

        throw new ApiError(errorData);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle server errors with retry logic for specific endpoints
    if (errorData.statusCode >= 500 && config && shouldRetry(config)) {
      return retryRequest(config);
    }

    // Throw ApiError for consistent error handling
    throw new ApiError(errorData);
  },
);

// Retry logic for failed requests
const shouldRetry = (config: RetryableAxiosRequestConfig): boolean => {
  const retryCount = config.__retryCount || 0;
  return retryCount < API_CONFIG.RETRY_ATTEMPTS && config.method === 'get';
};

const retryRequest = async (config: RetryableAxiosRequestConfig) => {
  config.__retryCount = (config.__retryCount || 0) + 1;

  const delay = API_CONFIG.RETRY_DELAY * config.__retryCount;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return api(config);
};

// Extend axios config interface to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
    __retryCount?: number;
  }

  interface AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T>;
    patch<T = unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    put<T = unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T>;
  }
}

export default api;
