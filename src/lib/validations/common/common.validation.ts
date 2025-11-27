import { MultilingualText } from '@/types/common/common.type';
import { z } from 'zod';

export const multilingualTextSchema = z
  .object({
    en: z.string().min(0),
    ar: z.string().min(0).optional(),
  })
  .refine((data) => data.en.trim() || data.ar?.trim(), {
    message: 'At least one language is required',
    path: ['en'],
  }) satisfies z.ZodType<MultilingualText>;

export const addressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});

// Common validation utilities

// Generic validation helper with enhanced error handling
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  fieldErrors?: Record<string, string[]>;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      const fieldErrors: Record<string, string[]> = {};

      error.issues.forEach((err) => {
        const path = err.path.join('.');
        const message = err.message;

        // Store the first error message for each field path
        if (!errors[path]) {
          errors[path] = message;
        }

        // Store all error messages for each field (useful for multiple validation rules)
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(message);
      });

      return { success: false, errors, fieldErrors };
    }

    // Handle non-Zod errors
    return {
      success: false,
      errors: {
        general: error instanceof Error ? error.message : 'Validation failed',
      },
    };
  }
}

// Safe validation helper that returns parsed data or null
export function safeValidateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T | null {
  const result = validateFormData(schema, data);
  return result.success ? result.data! : null;
}

// Validation helper specifically for form submissions
export function validateFormSubmission<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  onSuccess?: (data: T) => void,
  onError?: (errors: Record<string, string>) => void,
): boolean {
  const result = validateFormData(schema, data);

  if (result.success && result.data) {
    onSuccess?.(result.data);
    return true;
  } else if (result.errors) {
    onError?.(result.errors);
    return false;
  }

  return false;
}

// Utility to format validation errors for display
export function formatValidationErrors(
  errors: Record<string, string>,
): string[] {
  return Object.entries(errors).map(([field, message]) => {
    // Convert dot notation to readable field names
    const readableField = field
      .split('.')
      .map((part) => {
        // Handle array indices
        if (/^\d+$/.test(part)) {
          return `item ${parseInt(part) + 1}`;
        }
        // Convert camelCase to readable format
        return part
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase()
          .replace(/^./, (str) => str.toUpperCase());
      })
      .join(' → ');

    return `${readableField}: ${message}`;
  });
}

// Helper to get nested field errors for react-hook-form integration
export function getNestedFieldError(
  errors: Record<string, string> | undefined,
  fieldPath: string,
): string | undefined {
  return errors?.[fieldPath];
}
