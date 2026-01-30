import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { KitchenDepartmentReportItem } from '@/types/kitchen-department-report.type';

class KitchenDepartmentReportService extends BaseApiService<
  KitchenDepartmentReportItem[]
> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.KITCHEN_DEPARTMENT);
  }

  async getReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<KitchenDepartmentReportItem[]>> {
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
    return api.get<SuccessResponse<KitchenDepartmentReportItem[]>>(url);
  }
}

const kitchenDepartmentReportService = new KitchenDepartmentReportService();

export const useKitchenDepartmentReport = (
  params: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<KitchenDepartmentReportItem[]>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.KITCHEN_DEPARTMENT(params),
    queryFn: () => kitchenDepartmentReportService.getReport(params),
    ...options,
  });
};
