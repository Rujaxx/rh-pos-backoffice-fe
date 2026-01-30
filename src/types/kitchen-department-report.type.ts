export interface KitchenDepartmentReportItem {
  kitchenDepartmentName: string;
  totalItemSold: number;
  totalRevenue: number;
  itemLevelDiscount: number;
  itemLevelCharges: number;
  averagePrice: number;
}

export interface KitchenDepartmentReportResponse {
  data: KitchenDepartmentReportItem[];
}
