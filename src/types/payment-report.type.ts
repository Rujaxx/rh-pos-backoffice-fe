export enum PaymentMethodsEnum {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING',
  PHONEPE = 'PHONEPE',
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
  paymentMethod: PaymentMethodsEnum;
  amount: number;
  orderCount: number;
  percentage: number;
  averageValue: number;
}
