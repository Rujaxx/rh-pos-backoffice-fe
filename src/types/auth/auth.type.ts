/**
 * Authentication Types
 * Defines authentication-related types and interfaces
 */

import { User } from "../user/user.type";

// Authentication tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Authenticated user with tokens
export interface AuthUser extends AuthTokens {
  user: User;
}

// Login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}

// Registration data
export interface RegisterCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
  roleId?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset confirmation
export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
