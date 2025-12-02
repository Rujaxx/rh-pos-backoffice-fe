import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

export interface TaxProductGroup extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  taxType: 'Percentage' | 'Fixed Amount';
  taxValue: number;
  isActive: boolean;
  brandId: string;
  brandName: MultilingualText;
  restaurantId?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaxProductGroupFormData extends Record<string, unknown> {
  name: MultilingualText;
  taxType: 'Percentage' | 'Fixed Amount';
  taxValue: number;
  isActive: boolean;
  brandId: string;
  restaurantId?: string;
}

export interface TaxProductGroupQueryParams extends QueryParams {
  page?: number;
  limit?: number;

  term?: string;
  fields?: string[];

  brandId?: string;
  restaurantId?: string;
  isActive?: string;

  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'shortCode';
  sortOrder?: 'asc' | 'desc';
}
