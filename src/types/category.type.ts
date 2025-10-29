import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

// Category interface matching backend CategoryResponseDto
export interface Category extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  shortCode: string;
  parentCategoryId?: string;
  isActive: boolean;
  sortOrder?: number;
  brandId: string;
  restaurantId?: string;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Form data interface for creating/updating categories (matches CreateCategoryDto)
export interface CategoryFormData extends Record<string, unknown> {
  name: MultilingualText;
  shortCode: string;
  parentCategoryId?: string;
  isActive?: boolean;
  sortOrder?: number;
  brandId: string;
  restaurantId?: string;
}

// Query parameters for category API matching backend CategoryQueryDto
export interface CategoryQueryParams extends QueryParams {
  // From PaginationQueryDto
  page?: number;
  limit?: number;
  
  // From BaseQueryDto  
  term?: string; // Search term
  fields?: string[]; // Fields to search in
  
  // From CategoryQueryDto
  isActive?: string; // Filter by active/inactive status
  parentCategoryId?: string; // Filter by parent category
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'sortOrder';
  sortOrder?: 'asc' | 'desc'; // Sort order
}

// Category tree structure for hierarchical display
export interface CategoryTree extends Category {
  children?: CategoryTree[];
  level: number;
}

// Category dropdown option
export interface CategoryOption {
  value: string;
  label: string;
  level: number;
  parentId?: string;
}

export interface CategoryTableColumn {
  id: keyof Category | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}
