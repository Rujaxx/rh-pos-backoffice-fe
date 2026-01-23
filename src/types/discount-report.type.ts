// Discount Summary
export interface DiscountSummary {
  totalOrders: number;
  totalDiscountAmount: number;
  averageDiscountPercentage: number;
  mostUsedDiscountType: string;
  totalRevenue: number;
  discountByType: Array<{
    type: string;
    count: number;
    totalAmount: number;
  }>;
  discountByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  topDiscounts: Array<{
    discountCode: string;
    usageCount: number;
    totalDiscountAmount: number;
  }>;
}

// Discount Report Item
export interface DiscountReportItem {
  _id: string;
  orderNumber: string;
  orderFrom: string;
  customerName?: string;
  orderDate: string;
  totalAmount: number;
  discountAmount: number;
  discountPercentage: number;
  discountType: string;
  discountCode?: string;
  appliedBy?: string;
  status: string;
  restaurantName: string;
  orderType: string;
  billStatus?: string;
  createdAt: string;
  updatedAt: string;
}

// Discount Report Data
export interface DiscountReportData {
  summary: DiscountSummary;
  items: DiscountReportItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
