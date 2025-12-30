import { DailyReportType } from '@/types/report.type';
import {
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Package,
  Receipt,
  TrendingUp,
} from 'lucide-react';

// Report Type Labels
export const REPORT_TYPE_LABELS: Record<DailyReportType, string> = {
  [DailyReportType.DSR_BILL_WISE]: 'reports.dailySales.reportTypes.dsrBillWise',
  [DailyReportType.BILL_WISE_LIQUOR_SALE]:
    'reports.dailySales.reportTypes.billWiseLiquorSale',
  [DailyReportType.B2B_SALES]: 'reports.dailySales.reportTypes.b2bSales',
  [DailyReportType.BILL_NO_SERIES]:
    'reports.dailySales.reportTypes.billNoSeries',
  [DailyReportType.DSR_ITEM_WISE]: 'reports.dailySales.reportTypes.dsrItemWise',
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
};

// Report Type Buttons
export const REPORT_TYPE_BUTTONS = [
  {
    type: DailyReportType.DSR_BILL_WISE,
    translationKey: 'reports.dailySales.reportTypes.dsrBillWise',
    icon: FileText,
  },
  {
    type: DailyReportType.BILL_WISE_LIQUOR_SALE,
    translationKey: 'reports.dailySales.reportTypes.billWiseLiquorSale',
    icon: Receipt,
  },
  {
    type: DailyReportType.B2B_SALES,
    translationKey: 'reports.dailySales.reportTypes.b2bSales',
    icon: Package,
  },
  {
    type: DailyReportType.BILL_NO_SERIES,
    translationKey: 'reports.dailySales.reportTypes.billNoSeries',
    icon: BarChart3,
  },
  {
    type: DailyReportType.DSR_ITEM_WISE,
    translationKey: 'reports.dailySales.reportTypes.dsrItemWise',
    icon: FileSpreadsheet,
  },
  {
    type: DailyReportType.DSR_BILL_MONTH_WISE,
    translationKey: 'reports.dailySales.reportTypes.dsrBillMonthWise',
    icon: Calendar,
  },
  {
    type: DailyReportType.DSR_DAY_WISE,
    translationKey: 'reports.dailySales.reportTypes.dsrDayWise',
    icon: Calendar,
  },
  {
    type: DailyReportType.DSR_DAY_WISE_SUMMARY,
    translationKey: 'reports.dailySales.reportTypes.dsrDayWiseSummary',
    icon: ClipboardList,
  },
  {
    type: DailyReportType.SIMPLIFIED_DAY_WISE_DSR,
    translationKey: 'reports.dailySales.reportTypes.simplifiedDayWiseDsr',
    icon: FileText,
  },
  {
    type: DailyReportType.MALL_REPORT,
    translationKey: 'reports.dailySales.reportTypes.mallReport',
    icon: Building2,
  },
  {
    type: DailyReportType.TAX_SUBMISSION,
    translationKey: 'reports.dailySales.reportTypes.taxSubmission',
    icon: DollarSign,
  },
  {
    type: DailyReportType.TAX_SUBMISSION_PAYMENT,
    translationKey: 'reports.dailySales.reportTypes.taxSubmissionPayment',
    icon: Receipt,
  },
  {
    type: DailyReportType.ORDER_TYPE_DAY_WISE,
    translationKey: 'reports.dailySales.reportTypes.orderTypeDayWise',
    icon: BarChart3,
  },
  {
    type: DailyReportType.MONTH_WISE_SALES,
    translationKey: 'reports.dailySales.reportTypes.monthWiseSales',
    icon: TrendingUp,
  },
];
