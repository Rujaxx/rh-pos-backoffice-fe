import { z } from 'zod';

// Common validation schemas
export const multilingualTextSchema = z
  .object({
    en: z.string().min(0), // Remove .default("") and make it required
    ar: z.string().min(0), // Remove .default("") and make it required
  })
  .refine((data) => data.en.trim() || data.ar.trim(), {
    message: 'At least one language is required',
    path: ['en'], // This will show the error on the en field
  });

export const addressSchema = z.object({
  street: z.string().min(0), // Change from optional to required empty string
  city: z.string().min(0),
  state: z.string().min(0),
  country: z.string().min(0),
  zipCode: z.string().min(0),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Brand validation schema
export const brandSchema = z.object({
  name: multilingualTextSchema,
  description: multilingualTextSchema,
  logo: z.string().min(1, 'Logo is required'),
  menuLink: z.url('Please enter a valid menu URL'),
  website: z
    .string()
    .min(0)
    .refine(
      // Change from optional to required empty string
      (val) => !val || z.url().safeParse(val).success,
      'Please enter a valid website URL'
    ),
  isActive: z.boolean(),
  phone: z
    .string()
    .min(0)
    .refine(
      // Change from optional to required empty string
      (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
      'Please enter a valid phone number'
    ),
  fssaiNo: z.string().min(0), // Change from optional to required empty string
  trnOrGstNo: z.string().min(0), // Change from optional to required empty string
  panNo: z.string().min(0), // Change from optional to required empty string
  address: addressSchema,
});

export type BrandFormData = z.infer<typeof brandSchema>;

// Generic validation helper with enhanced error handling
// Generic validation helper with enhanced error handling
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
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
  data: unknown
): T | null {
  const result = validateFormData(schema, data);
  return result.success ? result.data! : null;
}

// Validation helper specifically for form submissions
export function validateFormSubmission<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  onSuccess?: (data: T) => void,
  onError?: (errors: Record<string, string>) => void
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
  errors: Record<string, string>
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
  fieldPath: string
): string | undefined {
  return errors?.[fieldPath];
}
