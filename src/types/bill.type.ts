export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum BillStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethodsEnum {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  PAYTM = 'PAYTM',
  GOOGLE_PAY = 'GOOGLE_PAY',
  FREE_CHARGE = 'FREE_CHARGE',
}

// Bill Item interface
export interface BillItem {
  menuItemId: string;
  name: { [key: string]: string };
  quantity: number;
  price: number;
  taxAmount: number;
  notes?: string;
}

// Payment interface
export interface Payment {
  method: PaymentMethodsEnum;
  amount: number;
  transactionId?: string;
  paymentDate: Date | string;
}

// Bill interface (matches backend schema)
export interface Bill {
  _id: string;
  billNumber: string;
  restaurantId: string;
  brandId: string;
  orderTypeId: string;
  tableId?: string;
  waiterId: string;
  waiterName?: string;
  customerName?: string;
  customerPhone?: string;
  items: BillItem[];
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  packagingCharges: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  status: BillStatus;
  payments: Payment[];
  closedAt?: Date | string;
  createdBy: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export const PaymentMethods = [
  { value: 'CASH', label: 'CASH' },
  { value: 'CARD', label: 'CARD' },
  { value: 'UPI', label: 'UPI' },
  { value: 'PAYTM', label: 'PAYTM' },
  { value: 'GOOGLE_PAY', label: 'GOOGLE_PAY' },
  { value: 'FREE_CHARGE', label: 'FREE_CHARGE' },
];
