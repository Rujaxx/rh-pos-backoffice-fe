import { QueryParams } from './api';
import { ReportGenerationStatus, ReportQueryParams } from './report.type';

export interface TodaysReportFilterState extends ReportQueryParams {
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
  from: string;
  to: string;
  brandIds: string[];
  restaurantIds: string[];
  orderTypeIds: string[];
}

export type PaperSize = 'A4' | '80MM' | '58MM';

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
  taxProductGroup: string;
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

export interface DiscountSummaryData {
  billDiscount: number;
  itemDiscount: number;
  totalDiscount: number;
}

export interface ExpenseSummaryData {
  category: string;
  amount: number;
}

export interface DeliveryBoySummaryData {
  name: string;
  deliveries: number;
  amount: number;
}

export interface WaiterSummaryData {
  name: string;
  tables: number;
  amount: number;
}

export interface CancelItemsSummaryData {
  itemName: string;
  quantity: number;
  amount: number;
}

export interface WalletSummaryData {
  transactions: number;
  totalAmount: number;
}

export interface DuePaymentSummaryData {
  amount: number;
  count: number;
}

export interface PaymentVarianceData {
  method: string;
  variance: number;
}

export interface CurrencyDenominationData {
  denomination: string;
  count: number;
  amount: number;
}

export interface OrderSourceData {
  source: string;
  orders: number;
  amount: number;
}

export interface TodaysReportResponseData {
  salesSummary?: SalesSummaryData;
  orderTypeSummary?: OrderTypeSummaryData[];
  paymentTypeSummary?: PaymentTypeSummaryData[];
  billSummary?: BillSummaryData[];
  productGroupSummary?: ProductGroupSummaryData[];
  kitchenDepartmentSummary?: KitchenDepartmentSummaryData[];
  categorySummary?: CategorySummaryData[];
  soldItemsSummary?: SoldItemsSummaryData[];
  discountSummary?: DiscountSummaryData;
  expenseSummary?: ExpenseSummaryData[];
  deliveryBoySummary?: DeliveryBoySummaryData[];
  waiterSummary?: WaiterSummaryData[];
  cancelItemsSummary?: CancelItemsSummaryData[];
  walletSummary?: WalletSummaryData;
  duePaymentReceivedSummary?: DuePaymentSummaryData;
  duePaymentReceivableSummary?: DuePaymentSummaryData;
  paymentVarianceSummary?: PaymentVarianceData[];
  currencyDenominationsSummary?: CurrencyDenominationData[];
  orderSourceSummary?: OrderSourceData[];
}

export interface GeneratedTimeFrame {
  from: string;
  to: string;
}
export interface TodaysSalesReport extends Record<string, unknown> {
  _id: string;
  generatedTimeFrame: GeneratedTimeFrame;
  generatedByName: string;
  generationStatus: ReportGenerationStatus;
  data: TodaysReportResponseData;
  createdBy: string;
  createdAt: string;
}

export interface TDSReportFilter extends Record<string, unknown> {
  // Filters
  brandIds?: string[];
  restaurantIds?: string[];
  orderTypeId?: string[];
  from: string; // ISO date string
  to: string; // ISO date string

  // Toggles
  sales?: boolean;
  z_report?: boolean;
  order_type?: boolean;
  payment_type?: boolean;
  discount?: boolean;
  expense?: boolean;
  bill?: boolean;
  delivery_boy?: boolean;
  waiter?: boolean;
  tax_product_group?: boolean;
  kitchen_department?: boolean;
  category?: boolean;
  sold_items?: boolean;
  cancel_items?: boolean;
  wallet?: boolean;
  due_payment_received?: boolean;
  due_payment_receivable?: boolean;
  payment_variance?: boolean;
  currency_denominations?: boolean;
  order_source?: boolean;
}

export interface TDSReportQueryParams extends QueryParams {
  from?: string; // ISO date string
  to?: string; // ISO date string

  // Location filters
  restaurantIds?: string[];
  brandIds?: string[];

  // Menu filters
  reports?: string[];
}
