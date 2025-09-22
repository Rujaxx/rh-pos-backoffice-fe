import { z } from 'zod';
import { 
  addressSchema, 
  multilingualTextSchema,
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
} from './common/common.validation';


// Brand validation schema
export const brandSchema = z.object({
  _id: z.string().optional(),
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

// Re-export common validation utilities for convenience
export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
