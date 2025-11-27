import { z } from 'zod';
import {
  addressSchema,
  multilingualTextSchema,
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
} from './common/common.validation';

// Validation schemas for restaurant settings

export const eBillSettingsSchema = z.object({
  onEmail: z.boolean().default(false),
  onWhatsapp: z.boolean().default(false),
  onSms: z.boolean().default(false),
});

export const paymentLinkSettingsSchema = z.object({
  onWhatsapp: z.boolean().default(false),
  onSms: z.boolean().default(false),
});

export const sendReportsSchema = z.object({
  email: z.boolean().default(false),
  whatsapp: z.boolean().default(false),
  sms: z.boolean().default(false),
});

const customQRCodeSchema = z.object({
  qrCodeTitle: z.string().min(1, 'Title is required'),
  qrCodeLink: z.url('Invalid URL'),
});

// Restaurant validation schema matching backend CreateRestaurantDto
export const restaurantSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  description: multilingualTextSchema.optional(),
  brandId: z.string().min(1, 'Brand is required'),
  logo: z.string().optional(),
  address: addressSchema.optional(),
  timezone: z.string().min(1, 'Timezone is required'),

  startDayTime: z
    .number()
    .min(0, 'Start day time must be between 0 and 1439 minutes')
    .max(1439, 'Start day time must be between 0 and 1439 minutes'),

  endDayTime: z
    .number()
    .min(0, 'End day time must be between 0 and 1439 minutes')
    .max(1439, 'End day time must be between 0 and 1439 minutes'),

  nextResetBillFreq: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  nextResetBillDate: z.string().optional(),
  nextResetKotFreq: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  notificationPhone: z.array(z.string()).default([]),
  notificationEmails: z.array(z.email('Invalid email format')).default([]),
  phoneNumber: z.string().nullable().optional(),
  contactEmail: z.email('Invalid email format').nullable().optional(),
  countryCode: z.string().optional(),
  isActive: z.boolean().default(true),
  restoCode: z
    .string()
    .max(6, 'Resto code must be at most 6 characters')
    .optional(),
  posLogoutOnClose: z.boolean().default(true),
  isFeedBackActive: z.boolean().default(false),
  trnOrGstNo: z.string().max(50).optional(),
  customQRcode: z.array(customQRCodeSchema).default([]),
  inventoryWarehouse: z.string().optional(),
  deductFromInventory: z.boolean().default(true),
  multiplePriceSetting: z.boolean().default(false),
  tableReservation: z.boolean().default(false),
  autoUpdatePos: z.boolean().default(true),
  allowMultipleTax: z.boolean().default(false),
  generateOrderTypeWiseOrderNo: z.boolean().default(false),
  smsAndWhatsappSelection: z
    .enum(['none', 'sms', 'whatsapp', 'both'])
    .default('none'),
  whatsAppChannel: z.string().optional(),
  sendReports: sendReportsSchema.default({
    email: false,
    whatsapp: false,
    sms: false,
  }),
  paymentLinkSettings: paymentLinkSettingsSchema.default({
    onWhatsapp: false,
    onSms: false,
  }),
  eBillSettings: eBillSettingsSchema.default({
    onEmail: false,
    onWhatsapp: false,
    onSms: false,
  }),

  billPrefix: z.string().max(50).optional(),
  kotPrefix: z.string().max(50).optional(),
});

export type RestaurantFormData = z.input<typeof restaurantSchema>;

export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
