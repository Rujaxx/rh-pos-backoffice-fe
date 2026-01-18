import { ReportGenerationStatus, ReportQueryParams } from './report.type';

export interface IncentiveMenuItem {
  _id: string;
  shortCode: string;
  name: {
    en: string;
    ar?: string;
  };
  price: number;
  description?: string;
  categoryId?: string;
  isActive: boolean;
  restaurantId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncentiveRule {
  _id: string;
  name: string;
  description?: string;
  menuItemIds: string[];
  employeeTypeIds?: string[];
  incentiveType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  brandId: string;
  restaurantIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WaiterIncentiveReportItem {
  _id: string;
  orderId: string;
  orderNumber: string;
  orderDate: string;
  waiterId: string;
  waiterName: string;
  waiterCode?: string;
  menuItemId: string;
  menuItemName: string;
  menuItemShortCode: string;
  price: number;
  quantity: number;
  amount: number; // price * quantity
  incentiveValue: number;
  incentiveType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  totalIncentive: number; // incentiveValue * amount (if percentage) or incentiveValue (if fixed)
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  restaurantId: string;
  restaurantName: string;
  brandId: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}

export enum WaiterIncentiveReportType {
  DETAILED = 'WAITER_INCENTIVE_DETAILED',
  SUMMARY = 'WAITER_INCENTIVE_SUMMARY',
  WAITER_WISE = 'WAITER_INCENTIVE_WAITER_WISE',
}

export interface GeneratedWaiterIncentiveReport {
  _id: string;
  generateDate: string;
  reportCompleteTime?: string;
  generatedBy: string;
  generatedByName?: string;
  reportType: WaiterIncentiveReportType;
  generationStatus: ReportGenerationStatus;
  downloadUrl?: string;
  errorMessage?: string;
  filters?: ReportQueryParams;
  createdAt: string;
  updatedAt: string;
}
