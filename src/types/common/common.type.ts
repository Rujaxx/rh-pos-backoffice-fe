export interface MultilingualText {
  en: string;
  ar: string;
}

// Alias for backward compatibility and semantic clarity
export type LocalizedName = MultilingualText;

// Common address structure matching backend AddressDto
export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  location?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

// Generic table action interface for data tables
export interface TableAction<T = Record<string, unknown>> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
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
  searchValue?: string;
  searchPlaceholder?: string;
  pagination?: boolean;
  loading?: boolean;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  onFilter?: (filters: Record<string, string | number | boolean>) => void;
  onSearch?: (query: string) => void;
}
