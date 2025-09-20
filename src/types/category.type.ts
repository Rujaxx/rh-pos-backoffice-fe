import { MultilingualText } from '@/types/common/common.type';

export interface Category extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  shortCode: string;
  isActive: boolean;
  sortOrder: number;
  restaurantId?: string;
  brandId?: string;
  parentCategoryId?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryFormData extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  shortCode: string;
  parentCategoryId?: string;
  isActive: boolean;
  sortOrder: number;
  brandId: string;
  restaurantId?: string;
}

export interface CategoryTableColumn {
  id: keyof Category | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface CategoryTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (item: T) => boolean;
}
