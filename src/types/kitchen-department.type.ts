import { MultilingualText, TableAction } from './common/common.type';
import { QueryParams } from './api';

export type { TableAction };

export interface KitchenDepartment extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  shortCode: string;

  isActive: boolean;

  brandId: string;
  brandName: MultilingualText;

  restaurantId: string;
  restaurantName: MultilingualText;

  createdBy: string;
  updatedBy: string;

  deletedBy?: string;
  deletedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

// Form data for creating/updating kitchen departments
export interface KitchenDepartmentFormData extends Record<string, unknown> {
  name: MultilingualText;
  shortCode: string;

  brandId: string;
  restaurantId: string;

  isActive?: boolean;
}

// Query parameters for filtering kitchen departments
export interface KitchenDepartmentQueryParams extends QueryParams {
  // PaginationQueryDto
  page?: number;
  limit?: number;

  // BaseQueryDto
  term?: string;
  fields?: string[];

  // KitchenDepartmentQueryDto
  brandId?: string;
  restaurantId?: string;
  isActive?: string;

  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'shortCode';
  sortOrder?: 'asc' | 'desc';
}
