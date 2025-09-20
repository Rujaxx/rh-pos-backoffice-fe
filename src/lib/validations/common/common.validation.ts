import { MultilingualText } from '@/types/common/common.type';
import { z } from 'zod';

export const multilingualTextSchema = z
  .object({
    en: z.string().min(0),
    ar: z.string().min(0),
  })
  .refine((data) => data.en.trim() || data.ar.trim(), {
    message: 'At least one language is required',
    path: ['en'],
  }) satisfies z.ZodType<MultilingualText>;

export const addressSchema = z.object({
  street: z.string().min(0),
  city: z.string().min(0),
  state: z.string().min(0),
  country: z.string().min(0),
  zipCode: z.string().min(0),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
