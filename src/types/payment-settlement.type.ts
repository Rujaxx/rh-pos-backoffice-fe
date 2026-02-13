export type FromType = 'vendor' | 'restaurant' | 'kitchen';

export interface FilterState {
  fromType: FromType;
  selectedVendorId?: string;
  selectedRestaurantId?: string;
  selectedKitchenId?: string;
  startDate: string;
  endDate: string;
}

export interface InvoiceType {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceDate: string;
  invoiceNo: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  payment: number;
}

export interface RestaurantType {
  _id: string;
  name: string;
}

export interface KitchenType {
  _id: string;
  name: string;
}

export interface PaymentSettlementProps {
  preselectedVendorId?: string | null;
}

export interface PaymentSummary {
  totalOutstanding: number;
  totalPaymentAmount: number;
  excessAmount: number;
}

export interface InvoicePayments {
  [invoiceId: string]: number;
}

export interface Vendor {
  _id: string;
  name: string;
}

export interface Invoice {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceDate: string;
  invoiceNo: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  payment?: number;
}
