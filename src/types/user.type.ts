import { MultilingualText, TableAction } from './common/common.type';

// Re-export TableAction for backward compatibility
export type { TableAction };
export type UserTableAction<T = Record<string, unknown>> = TableAction<T>;

export interface User extends Record<string, unknown> {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  designation: string;
  restaurants: string[]; // Array of restaurant IDs
  isActive: boolean;
  profileImage?: string;
  lastLogin?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRole extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  permissions: string[];
  isActive: boolean;
}

export interface Restaurant {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  location?: string;
}

export interface UserTableColumn {
  id: keyof User | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

