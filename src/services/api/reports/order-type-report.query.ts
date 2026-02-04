import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { OrderTypeGroupedItem } from '@/types/order-type-report.type';

class OrderTypeReportService extends BaseApiService<OrderTypeGroupedItem[]> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.ORDER_TYPE);
  }

  async getReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<OrderTypeGroupedItem[]>> {
    const searchParams = new URLSearchParams();

    // Remove isDownload from params for view requests
    const { ...viewParams } = params;

    Object.entries(viewParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const url = `${this.baseEndpoint}?${searchParams.toString()}`;
    return api.get<SuccessResponse<OrderTypeGroupedItem[]>>(url);
  }

  async downloadReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<OrderTypeGroupedItem[]>> {
    const searchParams = new URLSearchParams();

    // Include isDownload for the backend
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'isDownload') {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    searchParams.append('isDownload', 'true');

    const url = `${this.baseEndpoint}?${searchParams.toString()}`;

    // The backend returns empty array for download, but we still expect the SuccessResponse wrapper
    return api.get<SuccessResponse<OrderTypeGroupedItem[]>>(url);
  }
}

const orderTypeReportService = new OrderTypeReportService();

export const useOrderTypeReport = (
  params: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<OrderTypeGroupedItem[]>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.ORDER_TYPE(params),
    queryFn: () => orderTypeReportService.getReport(params),
    ...options,
  });
};

export const useDownloadOrderTypeReport = () => {
  return useMutation({
    mutationFn: (params: ReportQueryParams) =>
      orderTypeReportService.downloadReport(params),
  });
};
