import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import {
  DownloadReportItem,
  DownloadReportQueryParams,
} from '@/types/download-report.type';

class DownloadReportService extends BaseApiService<DownloadReportItem[]> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.LIST);
  }

  async getReports(
    params: DownloadReportQueryParams,
  ): Promise<SuccessResponse<DownloadReportItem[]>> {
    const searchParams = new URLSearchParams();

    // Add brandId and restaurantId to query params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const url = searchParams.toString()
      ? `${this.baseEndpoint}?${searchParams.toString()}`
      : this.baseEndpoint;

    return api.get<SuccessResponse<DownloadReportItem[]>>(url);
  }
}

const downloadReportService = new DownloadReportService();

export const useDownloadReports = (
  params: DownloadReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<DownloadReportItem[]>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.LIST(params),
    queryFn: () => downloadReportService.getReports(params),
    ...options,
  });
};
