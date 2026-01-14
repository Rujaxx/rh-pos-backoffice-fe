export interface MealTimeFrame extends Record<string, unknown> {
  _id: string;
  brandId: string;
  name: string;
  from: string;
  to: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealTimeFrameFormData extends Record<string, unknown> {
  brandId: string;
  name: string;
  from: string;
  to: string;
  isActive: boolean;
}
