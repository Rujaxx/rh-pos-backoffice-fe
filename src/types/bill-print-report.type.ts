import { PrintStatus } from './report.type';

// Kitchen Department Report Item
export interface KitchenDepartmentReportItem {
  id: string;
  kitchenDepartment: string;
  categoryName: string;
  soldItems: number;
  totalAmount: number;
  itemLevelDiscount: number;
  itemLevelTotalCharges: number;
}

// Kitchen Department Report Response
export interface KitchenDepartmentReportResponse {
  data: KitchenDepartmentReportItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Bill Print Report Item
export interface BillPrintReportItem {
  id: string;
  orderNumber: string;
  billNumber: string;
  orderType: string; // Using string to match OrderType from database
  date: string;
  amount: number;
  status: PrintStatus;
  printCount: number;
}

// Bill Print Report Response
export interface BillPrintReportResponse {
  data: BillPrintReportItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary?: {
    totalOrders: number;
    fulfilledOrders: number;
    totalAmount: number;
    totalPrints: number;
  };
}
