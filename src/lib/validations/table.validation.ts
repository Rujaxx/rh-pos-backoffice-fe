import { z } from "zod"
import { multilingualTextSchema } from "../validations"

export const tableSchema = z.object({
    tableSectionId: z.string().min(1, "Table section is required"),
    label: z.string().min(1, "Label is required"),
    capacity: z
        .string()
        .min(1, "Capacity is required")
        .refine((val) => /^\d+$/.test(val), {
            message: "Capacity must be a valid number",
        })
        .refine((val) => Number(val) > 0, {
            message: "Capacity must be greater than 0",
        }),
    isAvailable: z.boolean(),
    restaurantId: z.string().min(1, "Restaurant is required"),
    restaurantName: multilingualTextSchema,
})

export type TableFormData = z.infer<typeof tableSchema>