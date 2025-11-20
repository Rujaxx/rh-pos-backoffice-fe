import { Address } from "./common/common.type";
import { MultilingualText } from "./common/common.type";
import { QueryParams } from "./api";

// Restaurant-specific settings interfaces
export interface SendReportsSettings {
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
}

export interface PaymentLinkSettings {
  onWhatsapp: boolean;
  onSms: boolean;
}

export interface EBillSettings {
  onEmail: boolean;
  onWhatsapp: boolean;
  onSms: boolean;
}

// Enums for better type safety
export type ResetBillFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type SmsWhatsappSelection = "none" | "sms" | "whatsapp" | "both";
export type TimezoneType = string; // Could be expanded with specific timezone values

export interface CustomQRCode {
  qrCodeTitle: string;
  qrCodeLink: string;
}

// Main Restaurant interface following brand pattern
export interface Restaurant extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  description?: MultilingualText;
  brandId: string;
  brandName: MultilingualText;
  logo?: string;
  address?: Address;
  timezone: TimezoneType;
  startDayTime: number; // Time format: 0-2359
  endDayTime: number; // Time format: 0-2359
  nextResetBillFreq: ResetBillFrequency;
  nextResetBillDate?: Date;
  phoneNumber?: string;
  contactEmail?: string;
  countryCode?: string;
  notificationPhone: string[];
  notificationEmails: string[];
  isActive: boolean;
  restoCode?: string;
  posLogoutOnClose: boolean;
  isFeedBackActive: boolean;
  trnOrGstNo?: string;
  customQRcode: CustomQRCode[];
  inventoryWarehouse?: string;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deductFromInventory: boolean;
  multiplePriceSetting: boolean;
  tableReservation: boolean;
  autoUpdatePos: boolean;
  sendReports: SendReportsSettings;
  allowMultipleTax: boolean;
  generateOrderTypeWiseOrderNo: boolean;
  smsAndWhatsappSelection: SmsWhatsappSelection;
  whatsAppChannel?: string;
  paymentLinkSettings: PaymentLinkSettings;
  eBillSettings: EBillSettings;
  billPrefix?: string;
  kotPrefix?: string;
}

// Form data interface for creating/updating restaurants (matches CreateRestaurantDto)
export interface RestaurantFormData extends Record<string, unknown> {
  name: MultilingualText;
  description?: MultilingualText;
  brandId: string;
  logo?: string;
  address?: Address;
  timezone: string;
  startDayTime: number;
  endDayTime: number;
  nextResetBillFreq: ResetBillFrequency;
  notificationPhone?: string[];
  notificationEmails?: string[];
  isActive?: boolean;
  restoCode?: string;
  posLogoutOnClose: boolean;
  isFeedBackActive: boolean;
  trnOrGstNo?: string;
  customQRcode: CustomQRCode[];
  deductFromInventory: boolean;
  multiplePriceSetting: boolean;
  tableReservation: boolean;
  autoUpdatePos: boolean;
  sendReports: SendReportsSettings;
  allowMultipleTax: boolean;
  generateOrderTypeWiseOrderNo: boolean;
  smsAndWhatsappSelection: SmsWhatsappSelection;
  whatsAppChannel?: string;
  paymentLinkSettings: PaymentLinkSettings;
  eBillSettings: EBillSettings;
}

// Query parameters for restaurant API matching backend RestaurantQueryDto
export interface RestaurantQueryParams extends QueryParams {
  // From PaginationQueryDto
  page?: number;
  limit?: number;

  // From BaseQueryDto
  term?: string; // Search term
  fields?: string[]; // Fields to search in

  // From RestaurantQueryDto
  brandId?: string; // Filter by brand
  isActive?: string; // Filter by active/inactive status
  sortOrder?: "asc" | "desc"; // Sort order
}
