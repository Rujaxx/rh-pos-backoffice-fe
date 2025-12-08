import { z } from 'zod';
import {
  multilingualTextSchema,
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
} from './common/common.validation';

// Category validation schema matching backend CreateCategoryDto
export const categorySchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  shortCode: z
    .string()
    .min(1, 'Short code is required')
    .max(10, 'Short code must be 10 characters or less'),
  parentCategoryId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0, 'Sort order must be 0 or greater').default(0),
  brandId: z.string().min(1, 'Brand is required'),
  restaurantId: z.string().optional(),
});

export type CategoryFormData = z.input<typeof categorySchema>;

// Re-export common validation utilities for convenience
export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
