export interface CategoryReportItem {
  id: string;
  categoryName: string;
  parentCategory: string;
  soldItems: number;
  totalAmount: number;
}
export interface CategoryReportResponse {
  data: CategoryReportItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary?: {
    totalSoldItems: number;
    totalAmount: number;
    totalRevenue: number;
  };
}
