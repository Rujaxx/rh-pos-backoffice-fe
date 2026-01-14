// Zod schema for Image Library form validation
import { z } from 'zod';

export const imageLibrarySchema = z.object({
  dishName: z.object({
    en: z.string().min(1, { message: 'English name is required' }),
    ar: z.string().optional(),
  }),
  url: z.string().min(1, { message: 'Image is required' }),
  tags: z.array(z.string()).optional(),
  // Internal field to track upload IDs for confirmation (not sent to backend)
  _uploadIds: z.array(z.string()).optional(),
});

export type ImageLibraryFormValues = z.infer<typeof imageLibrarySchema>;
