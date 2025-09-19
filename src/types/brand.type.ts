import { MultilingualText } from "./common/common.type";

export interface Address extends Record<string, unknown> {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}


export interface Brand extends Record<string, unknown> {
  _id?: string;
  name: MultilingualText;
  description: MultilingualText;
  logo: string;
  menuLink: string;
  website?: string;
  isActive?: boolean;
  phone?: string;
  fssaiNo?: string;
  trnOrGstNo?: string;
  panNo?: string;
  address: Address;
  createBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BrandFormData extends Record<string, unknown> {
  name: MultilingualText;
  description: MultilingualText;
  logo: string;
  menuLink: string;
  website?: string;
  isActive: boolean;
  phone?: string;
  fssaiNo?: string;
  trnOrGstNo?: string;
  panNo?: string;
  address: Address;
}

export interface BrandTableColumn {
  id: keyof Brand | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableAction<T = Record<string, unknown>> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (item: T) => boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Array<{
    id: string;
    label: string;
    accessor?: keyof T | ((item: T) => React.ReactNode);
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  }>;
  actions?: TableAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string | number | boolean>) => void;
  onSearch?: (query: string) => void;
}
