import { z } from 'zod';

export const multilingualTextSchema = z
  .object({
    en: z.string().min(0), // Remove .default("") and make it required
    ar: z.string().min(0), // Remove .default("") and make it required
  })
  .refine((data) => data.en.trim() || data.ar.trim(), {
    message: 'At least one language is required',
    path: ['en'], // This will show the error on the en field
  });
