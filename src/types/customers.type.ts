// types/customers.type.ts
import { Address } from './common/common.type';
import { QueryParams } from './api';

// Customer returned from API
export interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  billId?: string;
  address?: Address;
  loyaltyPoints: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Data used in forms (create/update) - Make loyaltyPoints optional
export interface CustomerFormData {
  _id?: string;
  name: string;
  phoneNumber: string | null;
  billId?: string;
  address?: Address;
  loyaltyPoints?: number; // <-- Make this optional
}

// Query params for listing/filtering customers
export interface CustomerQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  term?: string;
  fields?: string[];
  phoneNumber?: string;
  name?: string;
  sortOrder?: 'asc' | 'desc';
  sortBy?: string;
}
