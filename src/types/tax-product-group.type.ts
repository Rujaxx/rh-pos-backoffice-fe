import { MultilingualText } from '@/types/common/common.type';

export interface TaxProductGroup extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  productGroupName: string;
  taxType: 'Percentage' | 'Fixed Amount';
  taxValue: number;
  isActive: boolean;
  brandId: string;
  restaurantId?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaxProductGroupFormData extends Record<string, unknown> {
  name: MultilingualText;
  productGroupName: string;
  taxType: 'Percentage' | 'Fixed Amount';
  taxValue: number;
  isActive: boolean;
  brandId: string;
  restaurantId?: string;
}

export interface TaxProductGroupTableColumn {
  id: keyof TaxProductGroup | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}
