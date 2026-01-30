// Discount Report Item DTO
export interface DiscountReportItemDto {
  orderType: string;
  billStatus: string;
  totalDiscount: number;
  billCount: number;
}

// Discount Report Response DTO
export interface DiscountReportData {
  report: DiscountReportItemDto[];
  totalDiscount: number;
}

// Re-export for component compatibility (aliasing)
export type DiscountReportItem = DiscountReportItemDto;
