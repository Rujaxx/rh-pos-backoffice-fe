export interface PaymentMethodReportItem {
  method: string;
  amount: number;
}

export interface PaymentReportItem {
  date: string;
  paymentMethods: PaymentMethodReportItem[];
  totalAmount: number;
}

export interface PaymentReportResponse {
  dailyReports: PaymentReportItem[];
  totalAmount: number;
}

export enum PaymentMethodsEnum {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING',
  PHONEPE = 'PHONEPE',
  OTHER = 'OTHER',
}
