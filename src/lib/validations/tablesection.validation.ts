import { z } from "zod";
import {
  multilingualTextSchema,
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
} from "./common/common.validation";

// Table section validation schema matching backend CreateTablesectionDto
export const tableSectionSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  restaurantId: z.string().min(14, { message: "Restaurant is required" }),
  isActive: z.boolean().default(true),
});

// Create schema without _id for creation
export const createTableSectionSchema = tableSectionSchema.omit({ _id: true });

// Update schema with _id required for updates
export const updateTableSectionSchema = tableSectionSchema.extend({
  _id: z.string().min(1, { message: "ID is required for updates" }),
});

export type TableSectionFormData = z.input<typeof tableSectionSchema>;
export type CreateTableSectionData = z.input<typeof createTableSectionSchema>;
export type UpdateTableSectionData = z.input<typeof updateTableSectionSchema>;

// Re-export common validation utilities for convenience
export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
