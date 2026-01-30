import {
  PaymentReportType,
  DailyReportType,
  HourlyReportType,
  KitchenDepartmentReportType,
  DiscountReportType,
  BillPrintReportType,
} from '@/types/report.type';
import { MealTimeReportType } from '@/types/meal-time-report.type';
import { ItemReportType } from '@/types/item-report.type';

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
    [HourlyReportType.HOURLY_REPORT]: 'reports.hourly.reportTypes.hourlyReport',
    [HourlyReportType.MONTHLY_HOURLY_REPORT]:
      'reports.hourly.reportTypes.monthlyHourlyReport',

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

    // Item Report Types
    [ItemReportType.SOLD_ITEMS_DETAILS]:
      'reports.itemReport.reportTypes.soldItems',
    [ItemReportType.COMPLEMENTARY_ITEMS]:
      'reports.itemReport.reportTypes.complementary',
    [ItemReportType.KOT_ITEMS_REPORT]:
      'reports.itemReport.reportTypes.kotItems',
    [ItemReportType.BILL_DETAILS_REPORT]:
      'reports.itemReport.reportTypes.billDetails',
    [ItemReportType.CONSOLIDATED_ITEM_REPORT]:
      'reports.itemReport.reportTypes.consolidated',
  };

  return labelMap[reportType] || reportType;
}
