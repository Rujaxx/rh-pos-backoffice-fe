/**
 * Authentication Mutations
 * TanStack Query mutations for authentication operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import { LoginCredentials, AuthUser } from '@/types/auth';
import { User } from '@/types/user';
import { SuccessResponse, MutationResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import {
  RegisterFormData,
  ForgotPasswordFormData,
} from '@/lib/validations/auth.validation';

// Login mutation
export const useLogin = (
  options?: UseMutationOptions<
    SuccessResponse<AuthUser>,
    Error,
    LoginCredentials
  >,
) => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials): Promise<SuccessResponse<AuthUser>> => {
      const response = await api.post<SuccessResponse<AuthUser>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );

      if (response.data.user.webAccess === false) {
        throw new Error('Web access is denied');
      }

      return response;
    },

    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data;
      login({ accessToken, refreshToken, user });
    },

    // Don't handle loading in the mutation - let the component handle it
    ...options,
  });
};

// Register mutation
export const useRegister = (
  options?: UseMutationOptions<
    SuccessResponse<AuthUser>,
    Error,
    RegisterFormData
  >,
) => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (registerData): Promise<SuccessResponse<AuthUser>> => {
      const response = await api.post<SuccessResponse<AuthUser>>(
        API_ENDPOINTS.AUTH.REGISTER,
        registerData,
      );

      if (response.data.user.webAccess === false) {
        throw new Error('Web access is denied');
      }

      return response;
    },

    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data;
      login({ accessToken, refreshToken, user });
    },

    ...options,
  });
};

// Forgot password mutation
export const useForgotPassword = (
  options?: UseMutationOptions<
    SuccessResponse<{ message: string }>,
    Error,
    ForgotPasswordFormData
  >,
) => {
  return useMutation({
    mutationFn: async (data): MutationResponse<{ message: string }> => {
      return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    },

    ...options,
  });
};

// Logout mutation
export const useLogout = (
  options?: UseMutationOptions<
    SuccessResponse<void>,
    Error,
    { sessionId: string }
  >,
) => {
  const { logout, accessToken } = useAuthStore();

  return useMutation({
    mutationFn: async ({ sessionId }): MutationResponse<void> => {
      if (accessToken) {
        return api.post(API_ENDPOINTS.AUTH.LOGOUT, { sessionId });
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
        path: '',
        data: undefined,
      };
    },

    onSettled: () => {
      logout();
    },

    ...options,
  });
};

// Refresh token mutation
export const useRefreshToken = (
  options?: UseMutationOptions<SuccessResponse<AuthUser>, Error, void>,
) => {
  const { refreshToken, setTokens, logout } = useAuthStore();

  return useMutation({
    mutationFn: async (): MutationResponse<AuthUser> => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      return api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    },

    onSuccess: (data) => {
      const { accessToken, refreshToken: newRefreshToken } = data.data;
      setTokens({ accessToken, refreshToken: newRefreshToken });
    },

    onError: () => {
      // If refresh fails, logout user
      logout();
    },

    ...options,
  });
};

// Update profile mutation
export const useUpdateProfile = (
  options?: UseMutationOptions<SuccessResponse<User>, Error, Partial<User>>,
) => {
  const { updateUser, user } = useAuthStore();
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (userData: Partial<User>): MutationResponse<User> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      return api.patch(`/users/${user._id}`, userData);
    },

    onSuccess: (data) => {
      updateUser(data.data);

      // Invalidate user-related queries
      queryUtils.invalidateQueries(QUERY_KEYS.AUTH.ME);
    },

    ...options,
  });
};

// Change password mutation
export const useChangePassword = (
  options?: UseMutationOptions<
    SuccessResponse<void>,
    Error,
    { currentPassword: string; newPassword: string }
  >,
) => {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }): MutationResponse<void> => {
      return api.patch('/auth/change-password', data);
    },

    ...options,
  });
};
