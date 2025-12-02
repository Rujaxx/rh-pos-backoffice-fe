import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

export interface Discount extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  isActive: boolean;
  brandId: string;
  brandName: MultilingualText;
  restaurantId?: string;
  categoryIds: string[];
  taxProductGroupIds: string[];
  orderTypeIds: string[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DiscountFormData extends Record<string, unknown> {
  name: MultilingualText;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  isActive: boolean;
  brandId: string;
  restaurantId?: string;
  categoryIds: string[];
  taxProductGroupIds: string[];
  orderTypeIds: string[];
}

export interface DiscountQueryParams extends QueryParams {
  page?: number;
  limit?: number;

  term?: string;
  fields?: string[];

  brandId?: string;
  restaurantId?: string;
  isActive?: string;

  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'discountValue';
  sortOrder?: 'asc' | 'desc';
}
