/**
 * Authentication Store
 * Zustand store for managing authentication state with persistence and devtools
 */

import { create } from 'zustand'
import { AuthTokens } from '@/types/auth'
import { User } from '@/types/user'

// Auth state interface
interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (data: AuthTokens & { user: User }) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
}

// Create simplified auth store without problematic middleware
export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    ...initialState,
    
    // Login action
    login: ({ accessToken, refreshToken, user }) => {
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      })
      
      // Manual localStorage save
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('rh-pos-auth', JSON.stringify({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          }))
        } catch (error) {
          console.warn('Failed to save auth to localStorage:', error)
        }
      }
    },
    
    // Logout action
    logout: () => {
      set(initialState)
      
      // Manual localStorage clear
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('rh-pos-auth')
        } catch (error) {
          console.warn('Failed to clear auth from localStorage:', error)
        }
      }
    },
    
    // Update user data
    updateUser: (userData) => {
      const currentUser = get().user
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData }
        set({ user: updatedUser })
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem('rh-pos-auth')
            if (stored) {
              const parsed = JSON.parse(stored)
              localStorage.setItem('rh-pos-auth', JSON.stringify({
                ...parsed,
                user: updatedUser,
              }))
            }
          } catch (error) {
            console.warn('Failed to update user in localStorage:', error)
          }
        }
      }
    },
    
    // Set tokens only (for refresh)
    setTokens: ({ accessToken, refreshToken }) => {
      set({ accessToken, refreshToken })
    },
    
    // Set loading state
    setLoading: (isLoading) => {
      set({ isLoading })
    },
    
    // Clear all auth data
    clearAuth: () => {
      set(initialState)
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('rh-pos-auth')
        } catch (error) {
          console.warn('Failed to clear auth from localStorage:', error)
        }
      }
    },
  })
)

// Selectors for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthTokens = () => useAuthStore((state) => ({
  accessToken: state.accessToken,
  refreshToken: state.refreshToken,
}))
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)

// Computed selectors
export const useHasPermission = (permission: string) => 
  useAuthStore((state) => 
    state.user?.effectivePermissions.includes(permission) ?? false
  )

export const useIsInRole = (roleId: string) =>
  useAuthStore((state) => state.user?.role._id === roleId)

// Function to restore auth state from localStorage
export const restoreAuthFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('rh-pos-auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.isAuthenticated && parsed.user && parsed.accessToken) {
          useAuthStore.setState({
            user: parsed.user,
            accessToken: parsed.accessToken,
            refreshToken: parsed.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        }
      }
    } catch (error) {
      console.warn('Failed to restore auth from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem('rh-pos-auth')
    }
  }
}
