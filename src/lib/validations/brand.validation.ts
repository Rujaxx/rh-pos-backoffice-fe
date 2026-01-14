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
import {
  countryCodeSchema,
  phoneNumberSchema,
  validatePhoneForCountry,
  PHONE_VALIDATION,
} from './common/phone.validation';

// Brand validation schema matching backend CreateBrandDto
export const brandSchema = z
  .object({
    _id: z.string().optional(),
    name: multilingualTextSchema,
    description: multilingualTextSchema.optional(),
    logo: z.string().optional(), // Made optional to match backend
    website: z
      .string()
      .optional()
      .refine(
        (val) => !val || z.string().url().safeParse(val).success,
        'Please enter a valid website URL',
      ),
    isActive: z.boolean(),
    countryCode: countryCodeSchema,
    phone: phoneNumberSchema,
    fssaiNo: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{14}$/.test(val), // Backend expects exactly 14 digits
        'FSSAI number must be 14 digits',
      ),
    trnOrGstNo: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(val),
        'Invalid GST number format',
      ),
    panNo: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
        'Invalid PAN format',
      ),
    address: addressSchema.optional(),
    // Internal field to track upload IDs for confirmation (not sent to backend)
    _uploadIds: z.array(z.string()).optional(),
  })
  .refine((data) => validatePhoneForCountry(data.phone, data.countryCode), {
    message: PHONE_VALIDATION.COUNTRY_MESSAGE,
    path: ['phone'],
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
