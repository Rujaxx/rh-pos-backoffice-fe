import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface HourlyReportQueryParams {
  from?: string;
  to?: string;
  brandId?: string;
  restaurantId?: string;
  isDownload?: boolean;
}

interface HourlyReportResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Mutation for hourly report generation
export const useGenerateHourlyReport = (
  options?: UseMutationOptions<
    HourlyReportResponse,
    Error,
    HourlyReportQueryParams
  >,
) => {
  return useMutation<HourlyReportResponse, Error, HourlyReportQueryParams>({
    mutationFn: (params: HourlyReportQueryParams) => {
      const response = api.get<HourlyReportResponse>('reports/hourly-report', {
        params,
      });
      return response;
    },
    ...options,
  });
};

// Mutation for monthly hourly report generation
export const useGenerateMonthlyHourlyReport = (
  options?: UseMutationOptions<
    HourlyReportResponse,
    Error,
    HourlyReportQueryParams
  >,
) => {
  return useMutation<HourlyReportResponse, Error, HourlyReportQueryParams>({
    mutationFn: async (params: HourlyReportQueryParams) => {
      const response = await api.get<HourlyReportResponse>(
        'reports/monthly-hourly-report',
        {
          params,
        },
      );
      return response;
    },
    ...options,
  });
};
