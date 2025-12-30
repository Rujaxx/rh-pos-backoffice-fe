// src/app/reports/todays-report/types.ts
import { ReportQueryParams } from './report.type';

export type PaperSize = 'A4' | '80MM' | '58MM';

export interface TodaysReportFilterState extends ReportQueryParams {
  // Section toggles
  showSalesSummary: boolean;
  showZReportSummary: boolean;
  showOrderTypeSummary: boolean;
  showPaymentTypeSummary: boolean;
  showDiscountSummary: boolean;
  showExpenseSummary: boolean;
  showBillSummary: boolean;
  showDeliveryBoySummary: boolean;
  showWaiterSummary: boolean;
  showProductGroupSummary: boolean;
  showKitchenDepartmentSummary: boolean;
  showCategorySummary: boolean;
  showSoldItemsSummary: boolean;
  showCancelItemsSummary: boolean;
  showWalletSummary: boolean;
  showDuePaymentReceivedSummary: boolean;
  showDuePaymentReceivableSummary: boolean;
  showPaymentVarianceSummary: boolean;
  showCurrencyDenominationsSummary: boolean;
  showOrderSourceSummary: boolean;
}

// Sample data interfaces
export interface SalesSummaryData {
  netSale: number;
  totalTax: number;
  vat: number;
  totalSales: number;
  roundOff: number;
  discount: number;
  charges: number;
  cancelledOrders: number;
  pendingOrders: number;
  deletedOrders: number;
  duePayments: number;
}

export interface OrderTypeSummaryData {
  type: 'Dine In' | 'Pickup' | 'Delivery';
  orders: number;
  charges: number;
  discount: number;
  netSale: number;
  grossSale: number;
}

export interface PaymentTypeSummaryData {
  method: string;
  count: number;
  amount: number;
}

export interface BillSummaryData {
  billNo: string;
  qty: number;
  tax: number;
  discount: number;
  amount: number;
  status: string;
  payMode: string;
}

export interface ProductGroupSummaryData {
  productGroup: string;
  amount: number;
  discount: number;
}

export interface KitchenDepartmentSummaryData {
  kitchen: string;
  soldItems: number;
  amount: number;
}

export interface CategorySummaryData {
  category: string;
  soldItems: number;
  amount: number;
}

export interface SoldItemsSummaryData {
  itemName: string;
  quantity: number;
  amount: number;
}
