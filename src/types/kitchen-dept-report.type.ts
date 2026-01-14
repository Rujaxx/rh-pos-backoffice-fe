export interface KitchenDepartmentReportItem {
  id: string;
  kitchenDepartment: string;
  categoryName: string;
  soldItems: number;
  totalAmount: number;
  itemLevelDiscount: number;
  itemLevelTotalCharges: number;
}

export interface KitchenDepartmentReportResponse {
  data: KitchenDepartmentReportItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
