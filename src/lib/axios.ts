/**
 * Axios Configuration
 * Advanced HTTP client setup with interceptors, retry logic, and error handling
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/config/api'
import { ApiError, ErrorResponse, SuccessResponse } from '@/types/api'
import { useAuthStore } from '@/stores/auth.store'

// Interface for config with retry properties
interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  __retryCount?: number
  method?: string
}

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from store
    const { accessToken } = useAuthStore.getState()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  ((response: AxiosResponse) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const endTime = new Date()
      const startTime = response.config.metadata?.startTime
      if (startTime) {
        const duration = endTime.getTime() - startTime.getTime()
        console.log(`🚀 ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
      }
    }

    // Return the data directly for successful responses
    return response.data as SuccessResponse<unknown>
  }) as unknown as Parameters<typeof api.interceptors.response.use>[0],
  async (error: AxiosError<ErrorResponse>) => {
    const { response, config } = error

    // Handle network errors
    if (!response) {
      throw new ApiError({
        success: false,
        statusCode: 0,
        message: 'Network error occurred. Please check your connection.',
        timestamp: new Date().toISOString(),
        path: config?.url || '',
        errorCode: 'NETWORK_ERROR',
      })
    }

    const errorData = response.data

    // Handle authentication errors
    if (errorData.statusCode === 401) {
      const { logout } = useAuthStore.getState()
      logout()

      // Redirect to login if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Handle server errors with retry logic for specific endpoints
    if (errorData.statusCode >= 500 && config && shouldRetry(config)) {
      return retryRequest(config)
    }

    // Throw ApiError for consistent error handling
    throw new ApiError(errorData)
  }
)

// Retry logic for failed requests
const shouldRetry = (config: RetryableAxiosRequestConfig): boolean => {
  const retryCount = config.__retryCount || 0
  return retryCount < API_CONFIG.RETRY_ATTEMPTS && config.method === 'get'
}

const retryRequest = async (config: RetryableAxiosRequestConfig) => {
  config.__retryCount = (config.__retryCount || 0) + 1

  const delay = API_CONFIG.RETRY_DELAY * config.__retryCount
  await new Promise(resolve => setTimeout(resolve, delay))

  return api(config)
}

// Extend axios config interface to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date
    }
    __retryCount?: number
  }

  interface AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  }
}

export default api