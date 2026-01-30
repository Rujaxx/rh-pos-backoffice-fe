import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { PaymentReportResponse } from '@/types/payment-report.type';

class PaymentReportService extends BaseApiService<PaymentReportResponse> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.PAYMENT);
  }

  async getReport(
    params: ReportQueryParams,
  ): Promise<SuccessResponse<PaymentReportResponse>> {
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
    return api.get<SuccessResponse<PaymentReportResponse>>(url);
  }
}

const paymentReportService = new PaymentReportService();

export const usePaymentReport = (
  params: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<SuccessResponse<PaymentReportResponse>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.PAYMENT(params),
    queryFn: () => paymentReportService.getReport(params),
    ...options,
  });
};
