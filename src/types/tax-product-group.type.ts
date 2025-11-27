import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

export interface TaxProductGroup extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  billDisplayName: string;
  taxType: 'Percentage' | 'Fixed Amount';
  taxValue: number;
  isActive: boolean;
  isPrimary?: boolean;
  isInclusive: boolean;
  isDivisible: boolean;
  brandId: string;
  brandName: MultilingualText;
  restaurantIds?: string[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaxProductGroupFormData extends Record<string, unknown> {
  name: MultilingualText;
  billDisplayName: string;
  taxType: 'Percentage' | 'Fixed Amount';
  taxValue: number;
  isActive: boolean;
  isPrimary: boolean;
  isInclusive: boolean;
  isDivisible: boolean;
  brandId: string;
  restaurantIds?: string[];
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
