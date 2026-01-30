import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BaseApiService } from '@/services/api/base/client';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { ReportQueryParams } from '@/types/report.type';
import { BillPrintReportItem } from '@/components/reports/bill-print-reports/bill-print-columns';

class BillPrintReportService extends BaseApiService<BillPrintReportItem[]> {
  constructor() {
    super(API_ENDPOINTS.REPORTS.BILL_PRINT);
  }

  async getReport(
    params: ReportQueryParams,
  ): Promise<PaginatedResponse<BillPrintReportItem>> {
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

    // Check if it is a download request
    const isDownload = params.isDownload;

    // Choose endpoint based on isDownload
    const endpoint = isDownload
      ? API_ENDPOINTS.REPORTS.BILL_PRINT_DOWNLOAD
      : API_ENDPOINTS.REPORTS.BILL_PRINT;

    const url = `${endpoint}?${searchParams.toString()}`;
    // Based on other services (e.g. BillerWise), we expect PaginatedResponse if manual pagination is needed.
    // However, download might return a list?
    // If download returns a list but view returns paginated, we need to handle types carefully.
    // But usually 'download' triggers a generated report creation (SuccessResponse<GeneratedReport>),
    // OR it returns the CSV/file directly,
    // OR it returns the data list to be downloaded on client.

    // In previous steps, we treated 'download' as triggering a report generation process (returning a list of generated reports? No, the mock returned a single item to add to list).
    // The previous implementation of `handleDownloadReport` in the MOCK version added a `GeneratedReport` to a list.
    // The NEW implementation using `useBillPrintReport` was using `isDownload: true`.

    // If `isDownload: true` points to `/download/bill-print-report`, what does that endpoint return?
    // If it triggers a download, it might return a Blob or a success message.
    // However, the current code in `page.tsx` just calls `refetch()` when `isDownload` is true, and expects `reportsData` to update.
    // This implies `reportsData` is used to populate the table.

    // Wait, if `isDownload` is true, we usually want to Download the file.
    // But the user asked to "follow the category report flow".
    // "Category report flow" -> "Download button calls api: download/bill-print-report" and "refresh the download component".
    // This implies `download/bill-print-report` is an ACTION that starts a download generation (or returns file).
    // It does NOT replace the table data with "downloaded data".
    // The table view should stay on "View" data.

    // So `useBillPrintReport` should probably BE for the "View" (table) data, which is paginated.
    // The "Download" action might need a separate mutation or a different usage.
    // BUT, the USER requirement said: "the donwload button should call the api: download/bill-print-report".

    // If I change `useBillPrintReport` to return `PaginatedResponse`, that works for the Table.
    // What about the Download?
    // In `page.tsx`, `handleApplyFilters(true)` sets `isDownload: true`.
    // Then `queryParams` updates, `refetch` happens.
    // If `isDownload` is set, `getReport` calls `BILL_PRINT_DOWNLOAD`.
    // If `BILL_PRINT_DOWNLOAD` returns a file or a message, `PaginatedResponse` type might be wrong.

    // However, for the purpose of "fixing pagination for the submit button" (View mode),
    // I definitely need `PaginatedResponse` for the View mode.
    // I'll assume for now `BILL_PRINT_DOWNLOAD` also mimics the structure or I can use a Union type,
    // OR better: The "Download" flow usually doesn't update the View Table with the result of the download call.
    // But keeping it simple as per previous "Implementation Plan" (which just switched endpoints).

    // I will strictly fix the Pagination for the "Submit" button (View mode) as requested.

    return api.get<PaginatedResponse<BillPrintReportItem>>(url);
  }
}

const billPrintReportService = new BillPrintReportService();

export const useBillPrintReport = (
  params: ReportQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<BillPrintReportItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['reports', 'bill-print-report', params],
    queryFn: () => billPrintReportService.getReport(params),
    ...options,
  });
};
