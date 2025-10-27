import { MultilingualText } from '@/types/common/common.type';

export interface Menu extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  shortCode: string;
  brandId: string;
  restaurantId: string;
  shortName?: string;
  isActive?: boolean;
  isPosDefault?: boolean;
  isDigitalDefault?: boolean;
  isDigitalMenu?: boolean;
  isMobileApp?: boolean;
  isONDC?: boolean;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuFormData extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  shortCode: string;
  brandId: string;
  restaurantId: string;
  shortName?: string;
  isActive?: boolean;
  isPosDefault?: boolean;
  isDigitalDefault?: boolean;
  isDigitalMenu?: boolean;
  isMobileApp?: boolean;
  isONDC?: boolean;
}

export interface MenuTableColumn {
  id: keyof Menu | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface MenuTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (item: T) => boolean;
}
