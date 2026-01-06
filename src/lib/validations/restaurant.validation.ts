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
import {
  countryCodeSchemaOptional,
  phoneNumberSchemaOptional,
  phoneNumberArraySchema,
  validatePhoneForCountry,
  PHONE_VALIDATION,
} from './common/phone.validation';

export const PaymentGatewayConfigurationSchema = z.object({
  cash: z.boolean().default(true),
  card: z.boolean().default(false),
  cod: z.boolean().default(true),
  payLater: z.boolean().default(false),
  razorPay: z.boolean().default(false),
  upi: z.boolean().default(false),
  paytm: z.boolean().default(false),
  phonePe: z.boolean().default(false),
  googlePay: z.boolean().default(false),
  stripe: z.boolean().default(false),
  applePay: z.boolean().default(false),
  careemPay: z.boolean().default(false),
  wallet: z.boolean().default(false),
});

export const DigitalOrderSettingsSchema = z.object({
  isDigitalOrderingEnabled: z.boolean().default(true),
  sendDigitalOrdersNotificationOn: z
    .enum(['All', 'WhatsApp', 'SMS', 'None'])
    .default('All'),
  reduceInventoryForDigitalOrderPlatform: z.boolean().default(false),
  whatsAppNumber: z.string().optional(),
  customizedMessageForWhatsapp: z.string().max(150).optional(),
  showCategoryFirst: z.boolean().default(false),

  // --- Item Level Settings ---
  showDescriptionOnDigitalPlatform: z.boolean().default(true),
  showPreparationTimeOnDigitalPlatform: z.boolean().default(true),
  showNutritionInfo: z.boolean().default(true),

  // --- Other Digital Order Settings ---
  orderTypes: z
    .array(
      z.object({
        orderTypeId: z.string().min(1),
        allowedPaymentMethods: z.array(z.string()),
      }),
    )
    .default([]),

  autoAcceptOrder: z.boolean().default(false),
  autoAcceptOrderOnCashPayment: z.boolean().default(false),
  sendOtpVia: z.enum(['SMS', 'WhatsApp']).default('SMS'),
  loginWithTruecaller: z.boolean().default(false),
  dineInTitle: z.string().optional(),
  dineInTitlePlaceholder: z.string().optional(),
  askForOrderTypeBeforePlacingOrder: z.boolean().default(true),
  showWhatsappLinkOnDigitalPlatform: z.boolean().default(true),
  showGridViewOnDigitalPlatform: z.boolean().default(false),
  showListViewOnDigitalPlatform: z.boolean().default(true),
  language: z.string().optional(),
  skipOtpVerification: z.boolean().default(false),
  enableForCategorySortingOnDigitalPlatform: z.boolean().default(false),
  autoCompleteOrderAfterAccept: z.boolean().default(false),
  sendEbillAfterComplete: z.boolean().default(false),

  showContactNo: z.boolean().default(false),
  contactNo: z.string().optional(),
  whatsappLink: z.string().optional(),
  showFacebookLink: z.boolean().default(false),
  facebookLink: z.string().optional(),
  showInstagramLink: z.boolean().default(false),
  instagramLink: z.string().optional(),
  showWebsiteLink: z.boolean().default(false),
  websiteLink: z.string().optional(),
  showPinterestLink: z.boolean().default(false),
  pinterestLink: z.string().optional(),
  showLinkedInLink: z.boolean().default(false),
  linkedInLink: z.string().optional(),
  showYouTubeLink: z.boolean().default(false),
  youTubeLink: z.string().optional(),
});

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

export const customQRCodeSchema = z.object({
  qrCodeTitle: z.string().min(1, 'Title is required'),
  qrCodeLink: z.url('Invalid URL'),
});

// Restaurant validation schema matching backend CreateRestaurantDto
export const restaurantSchema = z
  .object({
    _id: z.string().optional(),
    name: multilingualTextSchema,
    description: multilingualTextSchema.optional(),
    brandId: z.string().min(1, 'Brand is required'),
    logo: z.string().optional(),
    address: addressSchema.optional(),
    timezone: z.string().min(1, 'Timezone is required'),

    startDayTime: z
      .number()
      .transform((val) => Math.max(0, Math.min(1439, val))) // Clamp to 0-1439 FIRST
      .pipe(
        z
          .number()
          .min(0, 'Start day time must be between 0 and 1439 minutes')
          .max(1439, 'Start day time must be between 0 and 1439 minutes'),
      ),

    endDayTime: z
      .number()
      .transform((val) => Math.max(0, Math.min(1439, val))) // Clamp to 0-1439 FIRST
      .pipe(
        z
          .number()
          .min(0, 'End day time must be between 0 and 1439 minutes')
          .max(1439, 'End day time must be between 0 and 1439 minutes'),
      ),

    nextResetBillFreq: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    nextResetBillDate: z.string().optional(),
    nextResetKotFreq: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    notificationPhone: phoneNumberArraySchema,
    notificationEmails: z.array(z.email('Invalid email format')).default([]),
    phoneNumber: phoneNumberSchemaOptional,
    contactEmail: z.email('Invalid email format').nullable().optional(),
    countryCode: countryCodeSchemaOptional,
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

    billPrefix: z.string().max(10).optional(),
    kotPrefix: z.string().max(10).optional(),
    digitalOrderSettings: DigitalOrderSettingsSchema.optional(),
    currency: z.string().optional(),
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

export type RestaurantFormData = z.input<typeof restaurantSchema>;

export {
  validateFormData,
  safeValidateFormData,
  validateFormSubmission,
  formatValidationErrors,
  getNestedFieldError,
};
