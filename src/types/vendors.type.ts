import { MultilingualText } from './common/common.type';
import { QueryParams } from './api';

export enum PaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
  CREDIT = 'CREDIT',
}

export enum BalanceType {
  PAYABLE = 'PAYABLE',
  RECEIVABLE = 'RECEIVABLE',
}

export enum VendorStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  BLOCKED = 'Blocked',
}

export interface Vendor {
  _id: string;
  name: string;
  email?: string;
  phone?: string;

  // Tax Information
  gstNumber?: string;
  panNumber?: string;

  // Financial
  paymentType: PaymentMethod;
  creditLimit: number;
  openingBalance: number;
  balanceType: BalanceType;
  currentBalance?: number;

  // Associations
  restaurantId: string;
  brandId: string;

  // Status
  isActive: boolean;
  blockedAt?: Date;
  blockReason?: string;

  // Audit
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Joined fields
  brandName?: MultilingualText;
  restaurantName?: MultilingualText;

  // UI Helper
  status?: VendorStatus;
}

export interface VendorQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  term?: string;
  brandIds?: string[];
  restaurantIds?: string[];
  isActive?: boolean;
  paymentType?: PaymentMethod;
  balanceType?: BalanceType;
  hasCredit?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateVendorData {
  name: string;
  email?: string;
  phone: string;
  gstNumber?: string;
  panNumber?: string;
  restaurantId: string;
  brandId: string;
  paymentType?: PaymentMethod;
  creditLimit?: number;
  openingBalance?: number;
  balanceType?: BalanceType;
  isActive?: boolean;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  blockedAt?: Date;
  blockReason?: string;
}

export interface VendorFormValues {
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  panNumber: string;
  restaurantId: string;
  brandId: string;
  paymentType: PaymentMethod;
  creditLimit: number;
  openingBalance: number;
  balanceType: BalanceType;
  isActive: boolean;
}

export interface VendorOption {
  _id: string;
  name: string;
  phone?: string;
  paymentType?: PaymentMethod;
  creditLimit?: number;
  currentBalance?: number;
}
