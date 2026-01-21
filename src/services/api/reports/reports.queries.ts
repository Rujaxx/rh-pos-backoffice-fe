import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  OrderTypeReportItem,
  ReportData,
  ReportQueryParams,
} from '@/types/report.type';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { DiscountReportData } from '@/types/discount-report.type';
import { BillerWiseReportItem } from '@/types/biller-wise-report.type';

// Reports service - custom implementation since ReportData has unique structure
class BaseReportService {
  async getReports(
    endpoint: string,
    params?: ReportQueryParams,
  ): Promise<SuccessResponse<ReportData>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle arrays (restaurantIds, brandIds, paymentModes, billStatus)
          if (Array.isArray(value)) {
            value.forEach((item) => {
              searchParams.append(key, String(item));
            });
          } else {
            // Handle primitive values
            searchParams.append(key, String(value));
          }
        }
      });
    }

    const url = searchParams.toString()
      ? `${endpoint}?${searchParams.toString()}`
      : endpoint;

    return api.get(url);
  }

  // Method for discount reports
  async getDiscountReports(
    endpoint: string,
    params?: ReportQueryParams,
  ): Promise<SuccessResponse<DiscountReportData>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              searchParams.append(key, String(item));
            });
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }

    const url = searchParams.toString()
      ? `${endpoint}?${searchParams.toString()}`
      : endpoint;

    return api.get(url);
  }

  // Separate method for order type reports
  async getOrderTypeReports(
    params?: ReportQueryParams,
  ): Promise<PaginatedResponse<OrderTypeReportItem>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              searchParams.append(key, String(item));
            });
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }

    const url = searchParams.toString()
      ? `${API_ENDPOINTS.REPORTS.ORDER_TYPE}?${searchParams.toString()}`
      : API_ENDPOINTS.REPORTS.ORDER_TYPE;

    return api.get(url);
  }

  async getBillerWiseReports(
    params?: ReportQueryParams,
  ): Promise<PaginatedResponse<BillerWiseReportItem>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              searchParams.append(key, String(item));
            });
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }

    const url = searchParams.toString()
      ? `${API_ENDPOINTS.REPORTS.BILLER_WISE}?${searchParams.toString()}`
      : API_ENDPOINTS.REPORTS.BILLER_WISE;

    return api.get(url);
  }
}

const reportService = new BaseReportService();

// Generic query hook factory
const createReportHook = (endpoint: string, queryKeyPrefix: string) => {
  return (
    params?: ReportQueryParams,
    options?: Omit<
      UseQueryOptions<SuccessResponse<ReportData>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      queryKey: [queryKeyPrefix, 'list', params],
      queryFn: () => reportService.getReports(endpoint, params),
      ...options,
    });
  };
};

// Sales report hook (general sales endpoint)
export const useReports = createReportHook(
  API_ENDPOINTS.REPORTS.LIST_SALES,
  'reports',
);

// Daily Sales Report hook
export const useDailySalesReports = createReportHook(
  API_ENDPOINTS.REPORTS.LIST_SALES,
  'daily-sales-reports',
);

// Todays Sales Report hook
export const useTodaysSalesReports = createReportHook(
  API_ENDPOINTS.REPORTS.LIST_SALES,
  'todays-sales-reports',
);

// Meal-Time Sales Report hook
export const useMealTimeReports = createReportHook(
  API_ENDPOINTS.REPORTS.LIST_SALES,
  'meal-time-reports',
);

// Order Type Report hook
export const useOrderTypeReports = (
  params?: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<OrderTypeReportItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['order-type-reports', 'list', params],
    queryFn: () => reportService.getOrderTypeReports(params),
    ...options,
  });
};

// Meal-Time Sales Report hook
export const useDiscountReports = createReportHook(
  API_ENDPOINTS.REPORTS.LIST_SALES,
  'meal-time-reports',
);

export const useBillerWiseReports = (
  params?: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<BillerWiseReportItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['biller-wise-reports', 'list', params],
    queryFn: () => reportService.getBillerWiseReports(params),
    ...options,
  });
};

export { reportService };
