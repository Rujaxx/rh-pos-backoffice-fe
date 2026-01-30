import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { DiscountReportData } from '@/types/discount-report.type';

// Service class for Discount Reports
class DiscountReportService extends BaseApiService<DiscountReportData> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.DISCOUNT_REPORT);
  }

  async getDiscountReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<DiscountReportData>> {
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
    return api.get<SuccessResponse<DiscountReportData>>(url);
  }

  async generateDiscountReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<{ message: string }>> {
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

    // Add isDownload=true for report generation
    searchParams.append('isDownload', 'true');

    const url = `${this.baseEndpoint}?${searchParams.toString()}`;
    return api.get<SuccessResponse<{ message: string }>>(url);
  }

  async generateItemWiseReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<{ message: string }>> {
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

    // Add isDownload=true for report generation
    searchParams.append('isDownload', 'true');

    const url = `${API_ENDPOINTS.REPORTS.ITEM_WISE_DISCOUNT_REPORT}?${searchParams.toString()}`;
    return api.get<SuccessResponse<{ message: string }>>(url);
  }
}

const discountReportService = new DiscountReportService();

// Hook for fetching Simple Discount Report table data
export const useDiscountReport = (
  params: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<DiscountReportData>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.DISCOUNT_REPORT(params),
    queryFn: () => discountReportService.getDiscountReport(params),
    ...options,
  });
};

// Hook for generating Item Wise Discount Report (download trigger)
export const useGenerateItemWiseDiscountReport = () => {
  return useMutation({
    mutationFn: (params: ReportQueryParams) =>
      discountReportService.generateItemWiseReport(params),
  });
};

// Hook for generating Simple Discount Report (download trigger)
export const useGenerateDiscountReport = () => {
  return useMutation({
    mutationFn: (params: ReportQueryParams) =>
      discountReportService.generateDiscountReport(params),
  });
};
