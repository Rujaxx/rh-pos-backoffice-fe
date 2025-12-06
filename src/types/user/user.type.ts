/**
 * User Types
 * Defines user and role-related types and interfaces
 */

import { LocalizedName } from '../common/common.type';

// Role entity
export interface Role {
  _id: string;
  name: LocalizedName;
  permissions?: string[];
  description?: LocalizedName;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// User entity
export interface User {
  _id: string;
  sessionId?: string;
  username: string;
  name: string;
  email: string;
  webAccess: boolean;
  brandIds: string[];
  restaurantIds: string[];
  effectivePermissions: string[];
  role: Role;
  designation?: string;
  isActive?: boolean;
  accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  agreeToTerms?: boolean;
  termsAgreedAt?: string;
  termsVersion?: string;
}

// User creation payload
export interface CreateUserPayload {
  username: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  brandIds?: string[];
  restaurantIds?: string[];
  designation?: string;
  phone?: string;
}

// User update payload
export interface UpdateUserPayload
  extends Partial<Omit<CreateUserPayload, 'password'>> {
  isActive?: boolean;
  accountStatus?: User['accountStatus'];
}

// User query parameters
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  brandId?: string;
  restaurantId?: string;
  isActive?: boolean;
  accountStatus?: User['accountStatus'];
  sort?: string;
  order?: 'asc' | 'desc';
}

// User statistics
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: Record<string, number>;
  byBrand: Record<string, number>;
}
