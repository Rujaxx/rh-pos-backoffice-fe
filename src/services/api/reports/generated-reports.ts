import { useQuery } from '@tanstack/react-query';
import {
  GeneratedReport,
  ReportGenerationStatus,
  PaymentReportType,
  DailyReportType,
  HourlyReportType,
  PaymentMethodsEnum,
  KitchenDepartmentReportType,
  DiscountReportType,
  BillPrintReportType,
} from '@/types/report.type';
import { MealTimeReportType } from '@/types/meal-time-report.type';

// Centralized mock data for ALL generated reports across the system
const MOCK_ALL_GENERATED_REPORTS: GeneratedReport[] = [
  // Payment Reports
  {
    _id: 'payment-1',
    generateDate: '2025-12-29T10:30:00Z',
    reportCompleteTime: '2025-12-29T10:32:15Z',
    generatedBy: 'user123',
    generatedByName: 'John Doe',
    reportType: PaymentReportType.PAYMENT_ORDER_DETAILS,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-29T23:59:59Z',
      restaurantIds: ['rest1', 'rest2'],
      paymentMethods: [
        PaymentMethodsEnum.CASH,
        PaymentMethodsEnum.CARD,
        PaymentMethodsEnum.UPI,
      ],
    },
    createdAt: '2025-12-29T10:30:00Z',
    updatedAt: '2025-12-29T10:32:15Z',
  },
  {
    _id: 'payment-2',
    generateDate: '2025-12-29T09:15:00Z',
    reportCompleteTime: '2025-12-29T09:16:45Z',
    generatedBy: 'user456',
    generatedByName: 'Jane Smith',
    reportType: PaymentReportType.PAYMENT_SUMMARY,
    generationStatus: ReportGenerationStatus.PROCESSING,
    downloadUrl: '',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-28T23:59:59Z',
      restaurantIds: ['rest1'],
    },
    createdAt: '2025-12-29T09:15:00Z',
    updatedAt: '2025-12-29T09:16:45Z',
  },

  // Daily Sales Reports
  {
    _id: 'daily-1',
    generateDate: '2025-12-29T11:45:00Z',
    reportCompleteTime: '2025-12-29T11:47:30Z',
    generatedBy: 'user123',
    generatedByName: 'John Doe',
    reportType: DailyReportType.DSR_BILL_WISE,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-29T23:59:59Z',
      restaurantIds: ['rest1', 'rest2'],
      b2bInvoices: true,
      liquorExemptedSales: false,
    },
    createdAt: '2025-12-29T11:45:00Z',
    updatedAt: '2025-12-29T11:47:30Z',
  },
  {
    _id: 'daily-2',
    generateDate: '2025-12-29T08:20:00Z',
    reportCompleteTime: '2025-12-29T08:21:45Z',
    generatedBy: 'user456',
    generatedByName: 'Jane Smith',
    reportType: DailyReportType.BILL_WISE_LIQUOR_SALE,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-28T23:59:59Z',
      restaurantIds: ['rest1'],
    },
    createdAt: '2025-12-29T08:20:00Z',
    updatedAt: '2025-12-29T08:21:45Z',
  },
  {
    _id: 'daily-3',
    generateDate: '2025-12-29T07:10:00Z',
    reportCompleteTime: '',
    generatedBy: 'user789',
    generatedByName: 'Bob Wilson',
    reportType: DailyReportType.DSR_BILL_MONTH_WISE,
    generationStatus: ReportGenerationStatus.PENDING,
    downloadUrl: '',
    filters: {
      from: '2025-12-27T00:00:00Z',
      to: '2025-12-28T23:59:59Z',
      restaurantIds: ['rest2', 'rest3'],
    },
    createdAt: '2025-12-29T07:10:00Z',
    updatedAt: '2025-12-29T07:10:00Z',
  },

  // Hourly Reports
  {
    _id: 'hourly-1',
    generateDate: '2025-12-29T14:30:00Z',
    reportCompleteTime: '2025-12-29T14:32:00Z',
    generatedBy: 'user123',
    generatedByName: 'John Doe',
    reportType: HourlyReportType.DAY_WISE,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-29T23:59:59Z',
      restaurantIds: ['rest1'],
    },
    createdAt: '2025-12-29T14:30:00Z',
    updatedAt: '2025-12-29T14:32:00Z',
  },
  {
    _id: 'hourly-2',
    generateDate: '2025-12-29T13:15:00Z',
    reportCompleteTime: '',
    generatedBy: 'user456',
    generatedByName: 'Jane Smith',
    reportType: HourlyReportType.MONTH_WISE,
    generationStatus: ReportGenerationStatus.FAILED,
    downloadUrl: '',
    filters: {
      from: '2025-12-01T00:00:00Z',
      to: '2025-12-31T23:59:59Z',
      restaurantIds: ['rest1', 'rest2'],
    },
    createdAt: '2025-12-29T13:15:00Z',
    updatedAt: '2025-12-29T13:16:30Z',
  },
];

// Hook to fetch all generated reports
export function useGeneratedReports() {
  return useQuery({
    queryKey: ['generated-reports'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await axiosInstance.get('/api/reports/generated');
      // return response.data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return mock data sorted by generateDate (newest first)
      return MOCK_ALL_GENERATED_REPORTS.sort(
        (a, b) =>
          new Date(b.generateDate).getTime() -
          new Date(a.generateDate).getTime(),
      );
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute to check for new reports
  });
}

// Helper function to get report type display label
export function getReportTypeLabel(reportType: string): string {
  const labelMap: Record<string, string> = {
    // Payment Reports
    [PaymentReportType.PAYMENT_ORDER_DETAILS]:
      'reports.payment.reportTypes.orderDetails',
    [PaymentReportType.PAYMENT_SUMMARY]: 'reports.payment.reportTypes.summary',

    // Daily Sales Reports
    [DailyReportType.DSR_BILL_WISE]:
      'reports.dailySales.reportTypes.dsrBillWise',
    [DailyReportType.BILL_WISE_LIQUOR_SALE]:
      'reports.dailySales.reportTypes.billWiseLiquorSale',
    [DailyReportType.B2B_SALES]: 'reports.dailySales.reportTypes.b2bSales',
    [DailyReportType.BILL_NO_SERIES]:
      'reports.dailySales.reportTypes.billNoSeries',
    [DailyReportType.DSR_ITEM_WISE]:
      'reports.dailySales.reportTypes.dsrItemWise',
    [DailyReportType.DSR_BILL_MONTH_WISE]:
      'reports.dailySales.reportTypes.dsrBillMonthWise',
    [DailyReportType.DSR_DAY_WISE]: 'reports.dailySales.reportTypes.dsrDayWise',
    [DailyReportType.DSR_DAY_WISE_SUMMARY]:
      'reports.dailySales.reportTypes.dsrDayWiseSummary',
    [DailyReportType.SIMPLIFIED_DAY_WISE_DSR]:
      'reports.dailySales.reportTypes.simplifiedDayWiseDsr',
    [DailyReportType.MALL_REPORT]: 'reports.dailySales.reportTypes.mallReport',
    [DailyReportType.TAX_SUBMISSION]:
      'reports.dailySales.reportTypes.taxSubmission',
    [DailyReportType.TAX_SUBMISSION_PAYMENT]:
      'reports.dailySales.reportTypes.taxSubmissionPayment',
    [DailyReportType.ORDER_TYPE_DAY_WISE]:
      'reports.dailySales.reportTypes.orderTypeDayWise',
    [DailyReportType.MONTH_WISE_SALES]:
      'reports.dailySales.reportTypes.monthWiseSales',

    // Hourly Reports
    [HourlyReportType.DAY_WISE]: 'reports.hourly.reportTypes.dayWise',
    [HourlyReportType.DAY_WISE_SUMMARY]:
      'reports.hourly.reportTypes.dayWiseSummary',
    [HourlyReportType.MONTH_WISE]: 'reports.hourly.reportTypes.monthWise',

    // Meal Time Reports
    [MealTimeReportType.MEAL_TIME_SALES]:
      'reports.mealTime.reportTypes.meal_time_sales',
    [MealTimeReportType.MEAL_TIME_DETAILED]:
      'reports.mealTime.reportTypes.meal_time_detailed',

    // Kitchen Department Report Types
    [KitchenDepartmentReportType.KITCHEN_DEPARTMENT_SUMMARY]:
      'reports.kitchenDepartment.reportTypes.kitchenDeptSummary',

    // Discount Report Types
    [DiscountReportType.DISCOUNT_SUMMARY]:
      'reports.discount.reportTypes.discountSummary',
    [DiscountReportType.DISCOUNT_ITEM_WISE]:
      'reports.discount.reportTypes.discountItemWise',

    [BillPrintReportType.BILL_PRINT_SUMMARY]:
      'reports.billPrint.reportType.summary',
  };

  return labelMap[reportType] || reportType;
}
