// types/biller-wise-report.type.ts

export interface BillerWiseReportPaymentResponse {
  paymentMethod: string;
  totalAmount: number;
}

export interface BillerWiseReportResponseDto {
  totalBills: number;
  fulfilledBills: number;
  cancelledBills: number;
  totalRevenue: number;
  complementaryItems: number;
  cancelledItems: number;
  paymentMethods: BillerWiseReportPaymentResponse[];
}
