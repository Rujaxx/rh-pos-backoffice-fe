import { TableAction } from "./common/common.type";
import { MultilingualText } from "./common/common.type";
import { QueryParams } from './api';

export type { TableAction };

// Table interface matching backend TableResponseDto
export interface Table extends Record<string, unknown> {
    _id: string;
    tableSectionId: string;        // ObjectId of TableSection
    label: string;                 // table label
    capacity: number;              // seating capacity
    isAvailable: boolean;          // availability status
    restaurantId: string;          // ObjectId of Restaurant
    restaurantName?: MultilingualText; // multilingual restaurant name for display (populated)
    createdBy: string;             // ObjectId of User
    updatedBy: string;             // ObjectId of User
    deletedBy?: string;            // ObjectId of User
    deletedAt?: Date;              // deletion timestamp
    createdAt?: Date;              // auto by mongoose timestamps
    updatedAt?: Date;              // auto by mongoose timestamps
}

// Form data interface for creating/updating tables (matches CreateTableDto)
export interface TableFormData extends Record<string, unknown> {
    label: string;
    capacity: number;
    tableSectionId: string;
    restaurantId: string;
    isAvailable?: boolean;
}

// Query parameters for table API matching backend TableQueryDto
export interface TableQueryParams extends QueryParams {
  // From PaginationQueryDto
  page?: number;
  limit?: number;
  
  // From BaseQueryDto  
  term?: string; // Search term
  fields?: string[]; // Fields to search in
  
  // From TableQueryDto
  isAvailable?: string; // Filter by availability status
  capacity?: number; // Filter by minimum capacity
  sortOrder?: 'asc' | 'desc'; // Sort order
}

export interface TableColumn {
    id: keyof Table | "actions";
    label: string;
    sortable?: boolean;
    filterable?: boolean;
}
