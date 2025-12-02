import { QueryParams } from './api';

// Payment enums
export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIALLY_PAID = 'PartiallyPaid',
  PAID = 'Paid',
  REFUNDED = 'Refunded',
}

export enum BillStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum PaymentMethods {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'Upi',
  PAYTM = 'Paytm',
  GOOGLE_PAY = 'GooglePay',
  FREE_CHARGE = 'FreeCharge',
}

// Bill Item interface
export interface BillItem {
  menuItemId: string;
  name: { [key: string]: string };
  quantity: number;
  price: number;
  taxAmount: number;
  notes?: string;
}

// Payment interface
export interface Payment {
  method: PaymentMethods;
  amount: number;
  transactionId?: string;
  paymentDate: Date | string;
}

// Bill interface (matches backend schema)
export interface Bill {
  _id: string;
  billNumber: string;
  restaurantId: string;
  brandId: string;
  orderTypeId: string;
  tableId?: string;
  waiterId: string;
  waiterName?: string;
  customerName?: string;
  customerPhone?: string;
  items: BillItem[];
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  packagingCharges: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  status: BillStatus;
  payments: Payment[];
  closedAt?: Date | string;
  createdBy: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Report Summary
export interface ReportSummary {
  totalRevenue: number;
  totalTax: number;
  totalBills: number;
  totalDiscount: number;
  cancelledBills: number;
}

// Report Response
export interface ReportData {
  summary: ReportSummary;
  bills: Bill[];
}

// Query Parameters
export interface ReportQueryParams extends QueryParams {
  date?: string; // ISO date string (YYYY-MM-DD)
  from?: string; // ISO date string
  to?: string; // ISO date string
  restaurantIds?: string[]; // Array of restaurant IDs
  brandIds?: string[]; // Array of brand IDs
  paymentModes?: PaymentMethods[]; // Array of payment modes
  billStatus?: BillStatus[]; // Array of bill statuses
}

// Update Bill Status DTO
export interface UpdateBillStatusDto {
  status: BillStatus;
}

// Update Payment Status DTO
export interface UpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
}
