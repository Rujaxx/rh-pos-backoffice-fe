import { ReportQueryParams } from '@/types/report.type';

// Report Tab Types
export type ItemReportTab =
  | 'sold-items'
  | 'complimentary'
  | 'kot-items'
  | 'bill-details';

// Item Report Types
export enum ItemReportType {
  SOLD_ITEMS_DETAILS = 'SOLD_ITEMS_DETAILS',
  COMPLEMENTARY_ITEMS = 'COMPLEMENTARY_ITEMS',
  KOT_ITEMS_REPORT = 'KOT_ITEMS_REPORT',
  BILL_DETAILS_REPORT = 'BILL_DETAILS_REPORT',
  CONSOLIDATED_ITEM_REPORT = 'CONSOLIDATED_ITEM_REPORT',
}

// Data Types
export interface SoldItem {
  _id: string;
  itemName: string;
  averagePrice: number;
  quantity: number;
  totalQty: number;
  discountOnItem: number;
  parentCategory: string;
  subCategory: string;
}

export interface ComplementaryItem {
  _id: string;
  itemName: string;
  price: number;
  quantity: number;
  totalQty: number;
  reason: string;
  date: string;
}

export interface KotItem {
  _id: string;
  kotNumber: string;
  itemName: string;
  orderType: string;
  tableNumber: string;
  status: 'placed' | 'settled' | 'cancelled';
  username: string;
  placedQty: number;
  settleQty: number;
  price: number;
  date: string;
}

export interface BillDetail {
  _id: string;
  billNumber: string;
  orderId: string;
  grandTotal: number;
  user: string;
  kotNumber: string;
  dateTime: string;
}

export interface ConsolidatedReportData {
  totalAmount: number;
  totalItems: number;
  averagePrice: number;
  itemCount: number;
}

// Filter Types
export interface SoldItemsFilterParams extends ReportQueryParams {
  categoryId?: string;
  subCategoryId?: string;
  quantity?: number;
  itemName?: string;
}

export interface ComplementaryFilterParams extends ReportQueryParams {
  reason?: string;
  itemName?: string;
}

export interface KotItemsFilterParams extends ReportQueryParams {
  kotNumber?: string;
  tableNumber?: string;
  orderType?: string;
  status?: string;
  username?: string;
}

export interface BillDetailsFilterParams extends ReportQueryParams {
  billNumber?: string;
  user?: string;
  kotNumber?: string;
}

// Tab Config
export interface ItemReportTabConfig {
  id: ItemReportTab;
  label: string;
  description: string;
  reportType: ItemReportType;
  icon: React.ComponentType<{ className?: string }>;
}
