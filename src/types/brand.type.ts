import { MultilingualText, Address } from "./common/common.type";
import { QueryParams } from "./api";


export interface Brand extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  description: MultilingualText;
  logo?: string;
  menuLink?: string;
  website?: string;
  isActive?: boolean;
  phone?: string;
  fssaiNo?: string;
  trnOrGstNo?: string;
  panNo?: string;
  address?: Address;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Form data for creating/updating brands
export interface BrandFormData extends Record<string, unknown> {
  name: MultilingualText;
  description: MultilingualText;
  logo?: string;
  menuLink?: string;
  website?: string;
  isActive?: boolean;
  phone?: string;
  fssaiNo?: string;
  trnOrGstNo?: string;
  panNo?: string;
  address?: Address;
}

// Query parameters for brand API matching backend BrandQueryDto
export interface BrandQueryParams extends QueryParams {
  // From PaginationQueryDto
  page?: number;
  limit?: number;
  
  // From BaseQueryDto  
  term?: string; // Search term
  fields?: string[]; // Fields to search in
  
  // From BrandQueryDto
  isActive?: string; // Filter by active/inactive status
  sortOrder?: 'asc' | 'desc'; // Sort order
}
