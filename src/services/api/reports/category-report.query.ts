import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { CategoryReportItem } from '@/types/category-report.type';

class CategoryReportService extends BaseApiService<CategoryReportItem[]> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.CATEGORY);
  }

  async getReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<CategoryReportItem[]>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const url = `${this.baseEndpoint}?${searchParams.toString()}`;
    return api.get<SuccessResponse<CategoryReportItem[]>>(url);
  }
}

const categoryReportService = new CategoryReportService();

export const useCategoryReport = (
  params: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<CategoryReportItem[]>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.CATEGORY(params),
    queryFn: () => categoryReportService.getReport(params),
    ...options,
  });
};
