import * as z from 'zod';
import { addressSchema } from './common/common.validation';
import {
  countryCodeSchemaOptional,
  phoneNumberSchemaOptional,
  validatePhoneForCountry,
  PHONE_VALIDATION,
} from './common/phone.validation';

export const customerSchema = z
  .object({
    _id: z.string().optional(),
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must be less than 100 characters' }),

    countryCode: countryCodeSchemaOptional,
    phoneNumber: phoneNumberSchemaOptional,

    loyaltyPoints: z
      .number()
      .min(0, { message: 'Loyalty points cannot be negative' })
      .default(0),

    address: addressSchema.optional(),
    billId: z.string().optional(),
  })
  .refine(
    (data) => {
      // If phone is provided, country code must be provided
      if (data.phoneNumber && !data.countryCode) {
        return false;
      }
      return validatePhoneForCountry(data.phoneNumber, data.countryCode);
    },
    {
      message: PHONE_VALIDATION.COUNTRY_MESSAGE,
      path: ['phoneNumber'],
    },
  );

export type CustomerFormData = z.input<typeof customerSchema>;
