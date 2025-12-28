import { z } from 'zod';
import {
  countryCodeSchemaOptional,
  phoneNumberSchemaOptional,
  validatePhoneForCountry,
  PHONE_VALIDATION,
} from './common/phone.validation';

export const userSchema = z
  .object({
    _id: z.string().optional(),

    name: z.string().min(3),
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_-]+$/),
    email: z.email(),
    password: z.string().min(4).max(30).optional(),

    countryCode: countryCodeSchemaOptional,
    phoneNumber: phoneNumberSchemaOptional,
    address: z.string().optional().or(z.literal('')),
    designation: z.string().max(100).optional().or(z.literal('')),

    role: z.string().min(1),

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

export type UserFormData = z.infer<typeof userSchema>;
