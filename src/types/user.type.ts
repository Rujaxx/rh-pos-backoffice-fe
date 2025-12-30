import { QueryParams } from './api';
import { MultilingualText, TableAction } from './common/common.type';

// Re-export TableAction for backward compatibility
export type { TableAction };
export type UserTableAction<T = Record<string, unknown>> = TableAction<T>;

// Account status values
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

// Used for permissions and access control
export type Permission = string;

// Used for system-level feature flags (e.g., web access)
export type AccessType = 'WEB' | 'POS' | 'BOTH';

export interface User extends Record<string, unknown> {
  _id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  phoneNumber?: string | null;
  countryCode?: string | null;
  address?: string;
  role: UserRole;
  designation?: string;
  restaurantIds: Restaurant[];
  brandIds: Brand[];
  isActive: boolean;
  agreeToTerms: boolean;
  shiftStart?: number;
  shiftEnd?: number;
  webAccess: boolean;
  macAddress?: string;
  language?: string;
  timeZone?: string;
  effectivePermissions?: string[];
  createdBy?: string;
  updatedBy?: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
}

export interface Restaurant {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  location?: string;
}
export interface Brand {
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

export interface UserFormData extends Record<string, unknown> {
  name?: string;
  username: string;
  role: string;
  email: string;
  phoneNumber?: string | null;
  countryCode?: string | null;
  password?: string;
  address?: string;
  shiftStart?: number;
  shiftEnd?: number;
  macAddress?: string;
  language?: string;
  timeZone?: string;
  agreeToTerms?: boolean;
  designation?: string;
  webAccess?: boolean;
  brandIds?: string[];
  restaurantIds?: string[];
  isActive?: boolean;
  effectivePermissions?: string[];
}

export interface UserQueryParams extends QueryParams {
  term?: string; // search keyword
  fields?: string[]; // fields to search within
  roleId?: string;
  brandId?: string;
  restaurantId?: [string];
  isActive?: string;
  accountStatus?: AccountStatus;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats extends Record<string, unknown> {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: Record<string, number>;
  byBrand: Record<string, number>;
}
