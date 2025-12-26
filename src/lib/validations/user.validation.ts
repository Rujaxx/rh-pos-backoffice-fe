import { z } from 'zod';

export const userSchema = z.object({
  _id: z.string().optional(),

  name: z.string().min(3),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/),
  email: z.email(),
  password: z.string().min(4).max(30).optional(),

  countryCode: z.string().optional().or(z.literal('')).nullable(),
  phoneNumber: z.string().nullable().optional(),
  address: z.string().optional().or(z.literal('')),
  designation: z.string().max(100).optional().or(z.literal('')),

  role: z.string().optional(),

  restaurantIds: z.array(z.string()).min(1),
  brandIds: z.array(z.string()).min(1),

  isActive: z.boolean(),
  agreeToTerms: z.boolean(),
  webAccess: z.boolean(),

  shiftStart: z.number().min(0).max(1439),
  shiftEnd: z.number().min(0).max(1439),

  macAddress: z.string().optional().or(z.literal('')),
  language: z.string(),
  timeZone: z.string(),

  effectivePermissions: z.array(z.string()).optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
