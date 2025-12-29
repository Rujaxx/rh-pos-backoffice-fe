import { z } from 'zod';
import {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
} from './common/common.validation';

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register validation schema - matches backend RegisterRequestDto
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .transform((val) => val.trim()),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must not exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    )
    .transform((val) => val.trim().toLowerCase()),
  email: z
    .string()
    .min(1, 'Email is required')
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().email('Please provide a valid email address')),
  company: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters long')
    .max(100, 'Company name must not exceed 100 characters')
    .transform((val) => val.trim().replace(/\s+/g, ' ')),
  countryCode: z
    .string()
    .min(1, 'Country code is required')
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.toUpperCase().trim();
    })
    .refine(
      (val) => {
        if (val === undefined) return true;
        return /^[A-Z]{2}$/.test(val);
      },
      {
        message: 'Country code must be exactly 2 letters',
      },
    ),
  phoneNumber: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val.replace(/[\s-()]/g, '');
    })
    .refine(
      (val) => {
        if (val === undefined) return true;
        return /^[\d]+$/.test(val);
      },
      {
        message: 'Phone number must contain only digits',
      },
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters long')
    .max(128, 'Password must not exceed 128 characters'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type RegisterFormData = {
  name: string;
  username: string;
  email: string;
  company: string;
  countryCode?: string;
  phoneNumber?: string;
  password: string;
  agreeToTerms: boolean;
};

// Forgot password validation schema - matches backend PasswordResetRequestDto
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().email({ message: 'Invalid email address' })),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password validation schema - matches backend PasswordResetDto
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters long')
    .max(128, 'Password must not exceed 128 characters'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Re-export common validation utilities for convenience
export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
