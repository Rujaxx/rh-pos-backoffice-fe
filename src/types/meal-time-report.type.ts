import { ReportQueryParams, ReportGenerationStatus } from './report.type';

export interface MealTimeReportQueryParams extends ReportQueryParams {
  // Meal time specific filters
  mealTimeIds?: string[];
  categoryIds?: string[];
  brandId?: string;
  restaurantId?: string;
  menuId?: string;
  categoryId?: string;
}

export interface MealTimeReportItem {
  name: string;
  slot: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topSellingItem: string;
}

export interface MealTimeReportResponseData {
  report: MealTimeReportItem[];
  generatedBy: string;
  generatedAt: string;
}

// Meal Time Report Type
export enum MealTimeReportType {
  MEAL_TIME_SALES = 'MEAL_TIME_SALES',
  MEAL_TIME_DETAILED = 'MEAL_TIME_DETAILED',
}

// Generated Meal Time Report
export interface MealTimeReport {
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
  from: string;
  to: string;
  isActive: boolean;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}
