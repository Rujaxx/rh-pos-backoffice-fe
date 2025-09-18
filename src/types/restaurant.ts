import { Address, MultilingualText, TableAction } from "./brand"

export type { TableAction }

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

export type ResetBillFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type SmsWhatsappSelection = 'none' | 'sms' | 'whatsapp' | 'both';

export interface Restaurant extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  description: MultilingualText;
  brandId: string;
  brandName: MultilingualText,
  logo?: string;
  address: Address;
  timezone: string;
  startDayTime: string;
  endDayTime: string;
  nextResetBillFreq: ResetBillFrequency;
  nextResetBillDate?: string;
  notificationPhone: string[];
  notificationEmails: string[];
  isActive?: boolean;
  restoCode?: string;
  posLogoutOnClose: boolean;
  isFeedBackActive: boolean;
  trnOrGstNo?: string;
  customQRcode: string[];
  inventoryWarehouse: string; // From Types.ObjectId
  createdBy: string; // From Types.ObjectId
  updatedBy: string; // From Types.ObjectId
  deletedBy?: string; // From Types.ObjectId
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deductFromInventory: boolean;
  multiplePriceSetting: boolean;
  tableReservation: boolean;
  autoUpdatePos: boolean;
  sendReports: SendReportsSettings;
  allowMultipleTax: boolean;
  generateOrderTypeWiseOrderNo: boolean;
  smsAndWhatsappSelection: SmsWhatsappSelection;
  whatsAppChannel?: string; // From Types.ObjectId
  paymentLinkSettings: PaymentLinkSettings;
  eBillSettings: EBillSettings;
}

export interface RestaurantTableColumn {
  id: keyof Restaurant | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}
