import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { SuccessResponse } from '@/types/api';
import { useQueryUtils } from '@/lib/query-client';
import { TDSReportFilter, TodaysSalesReport } from '@/types/todays-report.type';
import { tdsReportService } from './tds-reports.query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/config/api';

interface GenerateReportPayload {
  body: TDSReportFilter;
}

export const useGenerateTdsReprot = (
  options?: UseMutationOptions<
    SuccessResponse<TodaysSalesReport>,
    Error,
    GenerateReportPayload
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ body }: GenerateReportPayload) => {
      const result = await tdsReportService.generateReport(body);
      return result;
    },
    onSuccess: () => {
      toast.success('TDS report generated successfully');
      queryUtils.invalidateQueries(['reports', 'tds-report']);
      //   queryUtils.invalidateQueries(QUERY_KEYS.REPORTS.LIST_TDS());
      queryUtils.refetchQueries(QUERY_KEYS.REPORTS.LIST_TDS());
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to generate TDS report';
      toast.error(errorMessage);
    },
    ...options,
  });
};
