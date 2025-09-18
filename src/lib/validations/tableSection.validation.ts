import { z } from "zod";
import { multilingualTextSchema } from "../validations";


export const TableSectionSchema = z.object({
    restaurantId: z.string().min(1, "Restaurant is required"),
    name: multilingualTextSchema,
    isActive: z.boolean(),
});

export type TableSectionFormData = z.infer<typeof TableSectionSchema>;