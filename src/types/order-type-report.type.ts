export interface OrderTypeStatusBreakdown {
  billStatus: string;
  totalRevenue: number;
  billCount: number;
}

export interface OrderTypeGroupedItem {
  orderType: string;
  totalRevenue: number;
  totalBillCount: number;
  breakdown: OrderTypeStatusBreakdown[];
}
