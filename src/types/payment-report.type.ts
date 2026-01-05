// types/payment-report.type.ts
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING',
  OTHER = 'OTHER',
}

export interface PaymentSummary {
  totalCollection: number;
  totalOrders: number;
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  walletAmount: number;
  netBankingAmount: number;
  otherAmount: number;
  averageOrderValue: number;
}

export interface PaymentReportData {
  paymentMethod: PaymentMethod;
  amount: number;
  orderCount: number;
  percentage: number;
  averageValue: number;
}
