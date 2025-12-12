import * as z from 'zod';
import { addressSchema } from './common/common.validation';

export const customerSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' }),

  countryCode: z
    .string()
    .min(2, { message: 'Invalid country code' })
    .max(4, { message: 'Invalid country code length' })
    .regex(/^[0-9]{1,4}$/, { message: 'Country code must be numeric' })
    .optional(),

  phoneNumber: z.string().nullable().optional(),

  loyaltyPoints: z
    .number()
    .min(0, { message: 'Loyalty points cannot be negative' })
    .default(0),

  address: addressSchema.optional(),
  billId: z.string().optional(),
});

export type CustomerFormData = z.input<typeof customerSchema>;
