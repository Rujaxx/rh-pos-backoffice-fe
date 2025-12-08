import { QueryParams } from './api';
import { Bill, BillStatus, PaymentMethodsEnum } from './bill.type';

// Report Summary
export interface ReportSummary {
  totalRevenue: number;
  totalTax: number;
  totalBills: number;
  totalDiscount: number;
  cancelledBills: number;
  duePayment: number;
}

// Report Response
export interface ReportData {
  summary: ReportSummary;
  bills: Bill[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Query Parameters
export interface ReportQueryParams extends QueryParams {
  date?: string; // ISO date string (YYYY-MM-DD)
  from?: string; // ISO date string
  to?: string; // ISO date string
  restaurantIds?: string[]; // Array of restaurant IDs
  brandIds?: string[]; // Array of brand IDs
  menuIds?: string[]; // Array of menu IDs
  orderTypeIds?: string[]; // Array of order type IDs
  paymentMethods?: PaymentMethodsEnum[]; // Array of payment modes
  billStatus?: BillStatus[]; // Array of bill statuses
  term?: string; // Search term
  sortBy?: string; // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort order
}
