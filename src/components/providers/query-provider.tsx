'use client'

/**
 * Query Provider Component
 * Client-side provider for TanStack Query to avoid SSR issues
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ApiError } from '@/types/api'
import { toast } from 'sonner'
import { restoreAuthFromStorage } from '@/stores/auth.store'


interface QueryProviderProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: false,
      onError: (error: Error) => {
        // Check if it's an ApiError and handle accordingly
        if (error instanceof ApiError) {
          toast.error(error.message || 'An API error occurred')
        } else {
          toast.error(error.message || 'An error occurred')
        }
      }
    },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
    useEffect(() => {
    restoreAuthFromStorage()
  }, [])

  // Create QueryClient inside the component to avoid SSR issue
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools temporarily disabled to prevent memory issues */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}