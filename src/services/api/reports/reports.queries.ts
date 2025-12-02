import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ReportData, ReportQueryParams } from '@/types/report.type';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Reports service
class ReportService {
  private readonly baseEndpoint = API_ENDPOINTS.REPORTS.LIST;

  async getReports(
    params?: ReportQueryParams,
  ): Promise<SuccessResponse<ReportData>> {
    const searchParams = new URLSearchParams();

    if (params) {
      // Handle single date
      if (params.date) {
        searchParams.append('date', params.date);
      }

      // Handle date range
      if (params.from) searchParams.append('from', params.from);
      if (params.to) searchParams.append('to', params.to);

      // Handle array parameters
      if (params.restaurantIds?.length) {
        params.restaurantIds.forEach((id) =>
          searchParams.append('restaurantIds', id),
        );
      }
      if (params.brandIds?.length) {
        params.brandIds.forEach((id) => searchParams.append('brandIds', id));
      }
      if (params.paymentModes?.length) {
        params.paymentModes.forEach((mode) =>
          searchParams.append('paymentModes', mode),
        );
      }
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
