import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ReportData, ReportQueryParams } from '@/types/report.type';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';

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

export { reportService };
