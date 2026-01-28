/**
 * Authentication Service
 * Handles all authentication-related API calls including token refresh
 */

import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import { AuthTokens, AuthUser, LoginCredentials } from '@/types/auth/auth.type';
import { socketService } from '@/services/socket/socket.service';

export class AuthService {
  /**
   * Login user with credentials
   */
  static async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await api.post<AuthUser>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return response;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await api.post<AuthTokens>(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });
      return response;
    } catch (error) {
      console.warn(error);
      // If refresh fails, the token is expired or invalid
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response;
  }

  /**
   * Logout user (optional: call backend logout endpoint)
   */
  static async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Ignore logout errors - we'll clear local state anyway
      console.warn('Logout request failed:', error);
    } finally {
      // Disconnect socket on logout
      socketService.disconnect();
    }
  }
}

/**
 * Helper function to get current access token from storage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('rh-pos-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.accessToken || null;
    }
  } catch (error) {
    console.warn('Failed to get token from localStorage:', error);
  }

  return null;
}
