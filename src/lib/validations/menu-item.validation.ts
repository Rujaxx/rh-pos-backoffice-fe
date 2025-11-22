import { z } from "zod";
import {
  validateFormData,
  getNestedFieldError,
  safeValidateFormData,
  formatValidationErrors,
  multilingualTextSchema,
  validateFormSubmission,
} from "./common/common.validation";

// Add-on schema
const addOnSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  price: z.number().min(0, "Price must be positive"),
});

// Combo item schema
const comboItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Multiple price schema
const multiplePriceSchema = z.object({
  orderTypeId: z.string().optional(),
  tableSectionId: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
});

export const menuItemSchema = z
  .object({
    _id: z.string().optional(),

    // Menu & Restaurant
    menuId: z.string().min(1, "Menu is required"),
    brandId: z.string().min(1, "Brand is required"),
    restaurantId: z.string().min(1, "Restaurant is required"),

    // Basic Information
    shortCode: z
      .string()
      .min(1, "Short code is required")
      .max(20, "Short code must be 20 characters or less")
      .transform((val) => val.toUpperCase()),
    itemName: multilingualTextSchema,
    description: multilingualTextSchema.optional(),
    alternativeTitle: z.string().max(100).optional(),

    // Categorization
    categoryId: z.string().min(1, "Category is required"),
    subCategoryId: z.string().optional(),

    // Inventory
    currentStock: z
      .number()
      .int()
      .min(0, "Stock cannot be negative")
      .default(0),
    hsnCode: z.string().optional(),

    // Pricing
    baseItemPrice: z.number().min(0, "Price must be positive"),
    openPrice: z.boolean().default(false),
    openItem: z.boolean().default(false),
    multiplePrices: z.array(multiplePriceSchema).default([]),

    // Discounts
    digitalDiscount: z.boolean().default(false),
    discountType: z.enum(["Percentage", "Fixed Amount"]).optional(),
    discountedPrice: z.number().min(0).optional(),

    // Food Classification
    foodType: z.enum(["VEG", "NON_VEG", "VEGAN"]).optional(),
    meatType: z.enum(["VEG", "CHICKEN", "MUTTON", "FISH"]),

    // Operations
    taxProductGroupId: z.string().min(1, "Tax product group is required"),
    kitchenDepartmentId: z.string().min(1, "Kitchen department is required"),
    preparationTime: z.number().int().min(0).optional(),

    // Status & Availability
    isActive: z.boolean().default(true),
    isRecommended: z.boolean().default(false),
    posStatus: z.boolean().default(true),
    platformStatus: z.boolean().default(true),
    syncToAggregator: z.boolean().default(false),

    // Sorting
    itemSortOrder: z.number().int().min(0).optional(),

    // Add-ons & Combos
    isCombo: z.boolean().default(false),
    addOns: z.array(addOnSchema).default([]),
    comboItems: z.array(comboItemSchema).default([]),

    // Media
    images: z.array(z.string()).default([]),
    primaryImage: z.string().optional(),

    // Prefixes
    billPrefix: z.string().max(10).optional(),
    kotPrefix: z.string().max(10).optional(),
  })
  .refine(
    (data) => {
      // If digitalDiscount is true, discountType and discountedPrice are required
      if (data.digitalDiscount) {
        return data.discountType && data.discountedPrice !== undefined;
      }
      return true;
    },
    {
      message:
        "Discount type and price are required when digital discount is enabled",
      path: ["discountType"],
    },
  )
  .refine(
    (data) => {
      // If isCombo is true, comboItems must have at least one item
      if (data.isCombo) {
        return data.comboItems.length > 0;
      }
      return true;
    },
    {
      message: "At least one combo item is required for combo items",
      path: ["comboItems"],
    },
  );

export type MenuItemFormData = z.input<typeof menuItemSchema>;

// Re-export common validation utilities for convenience
export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
