import { MultilingualText } from "@/types/common/common.type";
import { QueryParams } from "./api";

export interface Menu extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  shortCode: string;
  brandId: string;
  restaurantId: string;

  shortName?: string;
  isActive: boolean;
  isPosDefault: boolean;
  isDigitalMenu: boolean;
  isMobileApp: boolean;
  isONDC: boolean;

  menuItemCount: number;

  createdBy: string;
  updatedBy: string;
  deletedBy?: string;

  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFormData extends Record<string, unknown> {
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

export interface MenuQueryParams extends QueryParams {
  page?: number;
  limit?: number;

  term?: string;
  fields?: string[];

  isActive?: string;

  sortBy?: "name" | "createdAt" | "updatedAt" | "shortCode";
  sortOrder?: "asc" | "desc";
}

export interface MenuTableColumn {
  id: keyof Menu | "actions";
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface MenuTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
  disabled?: (item: T) => boolean;
}
