import { TDSReportFilter, TodaysSalesReport } from '@/types/todays-report.type';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { BaseApiService } from '../../base/client';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import api from '@/lib/axios';

class TDSReportService extends BaseApiService<
  TodaysSalesReport,
  TDSReportFilter,
  TDSReportFilter
> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.LIST_TDS);
  }
  async getTDSReport(
    params?: ReportQueryParams,
  ): Promise<PaginatedResponse<TodaysSalesReport>> {
    return this.getAll(params);
  }

  async generateReport(
    body: TDSReportFilter,
  ): Promise<SuccessResponse<TodaysSalesReport>> {
    const url = API_ENDPOINTS.REPORTS.GENERATE_TDS;
    return api.post(url, body);
  }
}

const tdsReportService = new TDSReportService();

export const useTDSReports = (
  params?: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TodaysSalesReport>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS.LIST_TDS, params],
    queryFn: () => tdsReportService.getTDSReport(params),
    ...options,
  });
};

export { tdsReportService };
