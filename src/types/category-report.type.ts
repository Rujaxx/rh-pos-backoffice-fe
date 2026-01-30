export interface CategoryReportItem {
  categoryName: string;
  parentCategoryName: string | null;
  totalItemSold: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface CategoryReportResponse {
  data: CategoryReportItem[];
}
