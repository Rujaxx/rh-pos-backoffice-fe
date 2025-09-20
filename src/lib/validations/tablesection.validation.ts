import { z } from "zod";
import { multilingualTextSchema } from "./common/common.validation";


export const TableSectionSchema = z.object({
    _id: z.string().optional(),
    restaurantId: z.string().min(1, "Restaurant is required"),
    name: multilingualTextSchema,
    isActive: z.boolean(),
});

export type TableSectionFormData = z.infer<typeof TableSectionSchema>;