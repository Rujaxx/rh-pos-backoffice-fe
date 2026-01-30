import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import {
  SoldItemReportResponse,
  SoldItemsFilterParams,
} from '@/types/item-report.type';
import { GenerateReportResponse } from '@/types/report.type';

class SoldItemReportService extends BaseApiService<SoldItemReportResponse> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.SOLD_ITEM);
  }

  async getReport(
    params: SoldItemsFilterParams,
  ): Promise<SuccessResponse<SoldItemReportResponse>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const url = `${this.baseEndpoint}?${searchParams.toString()}`;
    return api.get<SuccessResponse<SoldItemReportResponse>>(url);
  }
  async downloadReport(
    params: SoldItemsFilterParams,
  ): Promise<SuccessResponse<GenerateReportResponse>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    searchParams.append('isDownload', 'true');

    const url = `${this.baseEndpoint}?${searchParams.toString()}`;
    return api.get<SuccessResponse<GenerateReportResponse>>(url);
  }
}

export const soldItemReportService = new SoldItemReportService();

export const useSoldItemReport = (
  params: SoldItemsFilterParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<SoldItemReportResponse>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.SOLD_ITEM(params),
    queryFn: () => soldItemReportService.getReport(params),
    ...options,
  });
};
