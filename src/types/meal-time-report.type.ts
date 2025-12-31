import { ReportQueryParams, ReportGenerationStatus } from './report.type';

export interface MealTimeReportQueryParams extends ReportQueryParams {
  // Meal time specific filters
  mealTimeIds?: string[];
  categoryIds?: string[];
}

// Meal Time Report Type
export enum MealTimeReportType {
  MEAL_TIME_SALES = 'MEAL_TIME_SALES',
  MEAL_TIME_DETAILED = 'MEAL_TIME_DETAILED',
}

// Generated Meal Time Report
export interface GeneratedMealTimeReport {
  _id: string;
  generateDate: string;
  reportCompleteTime?: string;
  generatedBy: string;
  generatedByName?: string;
  reportType: MealTimeReportType;
  generationStatus: ReportGenerationStatus;
  downloadUrl?: string;
  errorMessage?: string;
  filters?: ReportQueryParams;
  mealTimeIds?: string[];
  createdAt: string;
  updatedAt: string;
}

// Meal Time Configuration (for config modal)
export interface MealTimeConfig {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  mealSlotNames?: string[];
  brandId?: string;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Meal Time Report Data (actual report data)
export interface MealTimeReportData {
  mealTimeId: string;
  mealTimeName: string;
  startTime: string;
  endTime: string;
  totalBills: number;
  totalRevenue: number;
  totalTax: number;
  totalDiscount: number;
  averageBillValue: number;
  bills: MealTimeBillDetail[];
}

export interface MealTimeBillDetail {
  billId: string;
  billNo: string;
  billTime: string;
  revenue: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  status: string;
}
