import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ReportData, ReportQueryParams } from '@/types/report.type';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Reports service - custom implementation since ReportData has unique structure
class ReportService {
  private readonly baseEndpoint = API_ENDPOINTS.REPORTS.LIST_SALES;

  async getReports(
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
      ? `${this.baseEndpoint}?${searchParams.toString()}`
      : this.baseEndpoint;

    return api.get(url);
  }
}

const reportService = new ReportService();

// Query hook
export const useReports = (
  params?: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<ReportData>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.LIST(params),
    queryFn: () => reportService.getReports(params),
    ...options,
  });
};

export { reportService };
