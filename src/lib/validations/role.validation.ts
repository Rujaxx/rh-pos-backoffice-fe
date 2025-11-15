import { z } from "zod";
import { multilingualTextSchema } from "./common/common.validation";

// Role validation schema
export const roleSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  permissions: z
    .array(z.string())
    .min(1, "At least one permission must be selected")
    .refine(
      (permissions) => permissions.length > 0,
      "At least one permission is required",
    ),
  brandId: z.string().min(1, "Brand is required"),
});

// Type inference for the form data
export type RoleFormData = z.infer<typeof roleSchema>;

// Schema for role creation (without ID)
export const createRoleSchema = roleSchema;

// Schema for role update (with optional ID)
export const updateRoleSchema = roleSchema.extend({
  _id: z.string().optional(),
});

// Available permissions list (matches the permission categories from user-permissions-modal)
export const AVAILABLE_PERMISSIONS = [
  // System Access
  "read",
  "write",
  "delete",

  // User Management
  "manageUsers",
  "manageRoles",

  // Order Management
  "viewOrders",
  "processOrders",
  "voidOrders",

  // Menu Management
  "viewMenu",
  "editMenu",

  // Financial Access
  "viewReports",
  "managePayments",
] as const;

// Permission validation
export const validatePermissions = (permissions: string[]): boolean => {
  return permissions.every((permission) =>
    AVAILABLE_PERMISSIONS.includes(
      permission as (typeof AVAILABLE_PERMISSIONS)[number],
    ),
  );
};

// Role name validation helper
export const validateRoleName = (name: { en: string; ar: string }): boolean => {
  return name.en.trim().length > 0 && name.ar.trim().length > 0;
};
