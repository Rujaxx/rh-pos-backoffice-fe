import { z } from 'zod';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

/**
 * Phone Number Validation Constants
 *
 * These constants define the standardized phone number validation pattern
 * used across the entire application.
 */
export const PHONE_VALIDATION = {
  FORMAT_REGEX: /^[\d\s\-()]+$/,
  FORMAT_MESSAGE:
    'Phone number can only contain digits, spaces, dashes, and parentheses',
  COUNTRY_MESSAGE:
    'Please provide a valid phone number for the selected country',
};

export const COUNTRY_CODE_VALIDATION = {
  REGEX: /^[A-Z]{2}$/,
  LENGTH: 2,
  MESSAGE: 'Country code must be in ISO format (e.g., US, UK, CA, IN, AE)',
};

/**
 * Transforms phone number by removing formatting characters
 * @param value - Raw phone number input
 * @returns Cleaned phone number with only digits
 */
export function cleanPhoneNumber(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/[\s\-()]/g, '');
}

/**
 * Transforms country code to uppercase and trims whitespace
 * @param value - Raw country code input
 * @returns Cleaned country code in uppercase
 */
export function cleanCountryCode(value: string | null | undefined): string {
  if (!value) return '';
  return value.toUpperCase().trim();
}

/**
 * Validates phone number against country code using libphonenumber-js
 * @param phoneNumber - Phone number to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if valid, false otherwise
 */
export function validatePhoneForCountry(
  phoneNumber: string | null | undefined,
  countryCode: string | null | undefined,
): boolean {
  if (!phoneNumber || !countryCode) return true; // Skip validation if either is missing

  try {
    const cleanedPhone = cleanPhoneNumber(phoneNumber);
    const cleanedCountry = cleanCountryCode(countryCode);

    if (!cleanedPhone || !cleanedCountry) return true;

    // Validate country code format
    if (!COUNTRY_CODE_VALIDATION.REGEX.test(cleanedCountry)) {
      return false;
    }

    // Use libphonenumber-js for validation
    return isValidPhoneNumber(cleanedPhone, cleanedCountry as CountryCode);
  } catch (error) {
    console.error('Phone validation error:', error);
    return false;
  }
}

/**
 * Standard Country Code Schema
 *
 * Validates ISO 3166-1 alpha-2 country codes (e.g., US, UK, CA, IN, AE)
 */
export const countryCodeSchema = z
  .string()
  .length(COUNTRY_CODE_VALIDATION.LENGTH, {
    message: 'Country code must be exactly 2 characters',
  })
  .transform(cleanCountryCode)
  .refine((val) => COUNTRY_CODE_VALIDATION.REGEX.test(val), {
    message: COUNTRY_CODE_VALIDATION.MESSAGE,
  });

/**
 * Standard Phone Number Schema (Required)
 *
 * Use this for required phone number fields.
 * Must be used in conjunction with a countryCode field.
 *
 * @example
 * const schema = z.object({
 *   countryCode: countryCodeSchema,
 *   phoneNumber: phoneNumberSchema,
 * }).refine(
 *   (data) => validatePhoneForCountry(data.phoneNumber, data.countryCode),
 *   { message: PHONE_VALIDATION.COUNTRY_MESSAGE, path: ['phoneNumber'] }
 * );
 */
export const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(PHONE_VALIDATION.FORMAT_REGEX, {
    message: PHONE_VALIDATION.FORMAT_MESSAGE,
  })
  .transform(cleanPhoneNumber);

/**
 * Optional Phone Number Schema
 *
 * Use this for optional phone number fields.
 * Must be used in conjunction with a countryCode field.
 *
 * @example
 * const schema = z.object({
 *   countryCode: countryCodeSchemaOptional,
 *   phoneNumber: phoneNumberSchemaOptional,
 * }).refine(
 *   (data) => validatePhoneForCountry(data.phoneNumber, data.countryCode),
 *   { message: PHONE_VALIDATION.COUNTRY_MESSAGE, path: ['phoneNumber'] }
 * );
 */
export const phoneNumberSchemaOptional = z
  .string()
  .regex(PHONE_VALIDATION.FORMAT_REGEX, {
    message: PHONE_VALIDATION.FORMAT_MESSAGE,
  })
  .transform(cleanPhoneNumber)
  .nullable()
  .optional();

/**
 * Optional Country Code Schema
 */
export const countryCodeSchemaOptional = z
  .string()
  .length(COUNTRY_CODE_VALIDATION.LENGTH, {
    message: 'Country code must be exactly 2 characters',
  })
  .transform(cleanCountryCode)
  .refine((val) => COUNTRY_CODE_VALIDATION.REGEX.test(val), {
    message: COUNTRY_CODE_VALIDATION.MESSAGE,
  })
  .nullable()
  .optional();

/**
 * Helper function to create a phone validation schema with country code
 *
 * @param required - Whether the phone number is required
 * @returns Zod schema for phone number with country code validation
 *
 * @example
 * const userSchema = z.object({
 *   name: z.string(),
 *   ...createPhoneSchema(false), // Optional phone
 * });
 */
export function createPhoneSchema(required: boolean = false) {
  if (required) {
    return z
      .object({
        countryCode: countryCodeSchema,
        phoneNumber: phoneNumberSchema,
      })
      .refine(
        (data) => validatePhoneForCountry(data.phoneNumber, data.countryCode),
        {
          message: PHONE_VALIDATION.COUNTRY_MESSAGE,
          path: ['phoneNumber'],
        },
      );
  }

  return z
    .object({
      countryCode: countryCodeSchemaOptional,
      phoneNumber: phoneNumberSchemaOptional,
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
}

/**
 * Array of phone numbers schema (for notification phones, etc.)
 *
 * @example
 * const schema = z.object({
 *   notificationPhone: phoneNumberArraySchema,
 * });
 */
export const phoneNumberArraySchema = z
  .array(
    z
      .string()
      .regex(PHONE_VALIDATION.FORMAT_REGEX, {
        message: PHONE_VALIDATION.FORMAT_MESSAGE,
      })
      .transform(cleanPhoneNumber),
  )
  .default([]);
