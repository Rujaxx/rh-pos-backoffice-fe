// types/report.type.ts - Update these interfaces
export interface BillerWiseReportData {
  totalBills: number;
  fulfilledBills: number;
  cancelledBills: number;
  totalRevenue: number;
  complementaryItems: number;
  cancelledItems: number;
  paymentMethods: Record<string, number>;
}

// Keep the old interfaces if they're used elsewhere, but add the correct one
export interface BillerWiseReportItem {
  billerId: string;
  billerName: string;
  billerUsername: string;
  totalOrders: number;
  grossSales: number;
  cancelledOrders: number;
  cancelledAmount: number;
  netSales: number;
  paymentDetails?: PaymentBreakdown[];
}

export interface PaymentBreakdown {
  paymentMethod: string;
  ordersCount: number;
  amountCollected: number;
}

export interface BillerWiseReportSummary {
  totalBillers: number;
  totalOrders: number;
  totalSalesAmount: number;
  totalCancelledOrders: number;
  totalCancelledAmount: number;
}

// This might be what the backend actually returns
export interface BillerWiseReportResponse {
  data: BillerWiseReportData;
  success: boolean;
  message?: string;
}
