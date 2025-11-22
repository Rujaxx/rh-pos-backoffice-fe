import { z } from "zod";
import { multilingualTextSchema } from "./common/common.validation";

export const menuSchema = z.object({
  _id: z.string().optional(),
  brandId: z.string().min(1, "Brand ID is required"),
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  shortCode: z.string().trim().min(1, "Short code is required"),
  name: multilingualTextSchema,
  shortName: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  isPosDefault: z.boolean().default(false),
  isDigitalDefault: z.boolean().default(false),
  isDigitalMenu: z.boolean().default(false),
  isMobileApp: z.boolean().default(false),
  isONDC: z.boolean().default(false),
});

export type MenuFormData = z.input<typeof menuSchema>;
