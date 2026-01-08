import { QueryParams } from './api';
import { Bill, BillStatus, PaymentMethodsEnum } from './bill.type';

// Report Summary for Sales Reports
export interface ReportSummary {
  totalRevenue: number;
  totalTax: number;
  totalBills: number;
  totalDiscount: number;
  cancelledBills: number;
  duePayment: number;
}

// Report Data for Sales Reports Page
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

// Report Generation Status
export enum ReportGenerationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Daily Report Types (for DSR Page)
export enum DailyReportType {
  DSR_BILL_WISE = 'DSR_BILL_WISE',
  BILL_WISE_LIQUOR_SALE = 'BILL_WISE_LIQUOR_SALE',
  B2B_SALES = 'B2B_SALES',
  BILL_NO_SERIES = 'BILL_NO_SERIES',
  DSR_ITEM_WISE = 'DSR_ITEM_WISE',
  DSR_BILL_MONTH_WISE = 'DSR_BILL_MONTH_WISE',
  DSR_DAY_WISE = 'DSR_DAY_WISE',
  DSR_DAY_WISE_SUMMARY = 'DSR_DAY_WISE_SUMMARY',
  SIMPLIFIED_DAY_WISE_DSR = 'SIMPLIFIED_DAY_WISE_DSR',
  MALL_REPORT = 'MALL_REPORT',
  TAX_SUBMISSION = 'TAX_SUBMISSION',
  TAX_SUBMISSION_PAYMENT = 'TAX_SUBMISSION_PAYMENT',
  ORDER_TYPE_DAY_WISE = 'ORDER_TYPE_DAY_WISE',
  MONTH_WISE_SALES = 'MONTH_WISE_SALES',
}

// Generated Report (for DSR Page table)
export interface GeneratedReport {
  _id: string;
  generateDate: string;
  reportCompleteTime?: string;
  generatedBy: string;
  generatedByName?: string;
  reportType: DailyReportType;
  generationStatus: ReportGenerationStatus;
  downloadUrl?: string;
  errorMessage?: string;
  filters?: ReportQueryParams;
  createdAt: string;
  updatedAt: string;
}

// Base Query Parameters
export interface ReportQueryParams extends QueryParams {
  // Date filters
  date?: string; // ISO date string (YYYY-MM-DD)
  from?: string; // ISO date string
  to?: string; // ISO date string

  // Location filters
  restaurantIds?: string[];
  brandIds?: string[];
  outletIds?: string[];

  // Menu filters
  menuIds?: string[];

  // Order filters
  orderTypeIds?: string[];

  // Payment filters
  paymentMethods?: PaymentMethodsEnum[];

  // Bill filters
  billStatus?: BillStatus[];

  // Search
  term?: string;

  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

  // DSR specific filters
  b2bInvoices?: boolean;
  liquorExemptedSales?: boolean;
}

// API Response for Generated Reports
export interface GeneratedReportsResponse {
  success: boolean;
  data: GeneratedReport[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

// Generate Report Request
export interface GenerateReportRequest {
  reportType: DailyReportType;
  filters: ReportQueryParams;
  email?: string;
  fileName?: string;
}

// Generate Report Response
export interface GenerateReportResponse {
  success: boolean;
  data: {
    reportId: string;
    message: string;
    estimatedTime?: number;
  };
  message?: string;
}

// Status Data
export interface StatusData {
  active: number;
  completed: number;
  cancelled: number;
  pending?: number;
  other?: number;
}
