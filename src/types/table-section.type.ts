// same as you used for Restaurant
import { TableAction } from '@/types/common/common.type';
import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

export type { TableAction };

// Table Section interface matching backend TableSectionResponseDto
export interface TableSection extends Record<string, unknown> {
  _id: string;
  name: MultilingualText; // multilingual section name
  restaurantId: string; // ObjectId of Restaurant
  restaurantName: MultilingualText; // restaurant name from API
  isActive: boolean; // active status
  createdBy: string; // ObjectId of User
  updatedBy: string; // ObjectId of User
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
}

// Form data interface for creating/updating table sections (matches CreateTableSectionDto)
export interface TableSectionFormData extends Record<string, unknown> {
  name: MultilingualText;
  restaurantId: string;
  isActive?: boolean;
}

// Query parameters for table section API matching backend TableSectionQueryDto
export interface TableSectionQueryParams extends QueryParams {
  // From PaginationQueryDto
  page?: number;
  limit?: number;

  // From BaseQueryDto
  term?: string; // Search term
  fields?: string[]; // Fields to search in

  // From TableSectionQueryDto
  restaurantId?: string; // Filter by restaurant ID
  isActive?: string; // Filter by active/inactive status
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc'; // Sort order
}
