import { z } from "zod";
import {
  addressSchema,
  multilingualTextSchema,
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
} from "./common/common.validation";

// Brand validation schema matching backend CreateBrandDto
export const brandSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  description: multilingualTextSchema,
  logo: z.string().optional(), // Made optional to match backend
  menuLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid menu URL",
    ),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid website URL",
    ),
  isActive: z.boolean(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{10}$/.test(val), // Backend expects exactly 10 digits
      "Phone must be exactly 10 digits",
    ),
  fssaiNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{14}$/.test(val), // Backend expects exactly 14 digits
      "FSSAI number must be 14 digits",
    ),
  trnOrGstNo: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(val),
      "Invalid GST number format",
    ),
  panNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
      "Invalid PAN format",
    ),
  address: addressSchema.optional(),
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
