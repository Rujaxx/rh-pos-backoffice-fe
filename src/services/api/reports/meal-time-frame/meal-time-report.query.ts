import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import {
  MealTimeReportResponse,
  MealTimeReportQueryParams,
} from '@/types/meal-time-report.type';

class MealTimeReportService extends BaseApiService<MealTimeReportResponse> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.MEAL_TIME);
  }

  async getReport(
    params: MealTimeReportQueryParams,
  ): Promise<SuccessResponse<MealTimeReportResponse>> {
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
    // Use api.get directly as BaseApiService.getAll expects array response
    return api.get<SuccessResponse<MealTimeReportResponse>>(url);
  }
}

const mealTimeReportService = new MealTimeReportService();

export const useMealTimeReport = (
  params: MealTimeReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<MealTimeReportResponse>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.MEAL_TIME(params),
    queryFn: () => mealTimeReportService.getReport(params),
    ...options,
  });
};
