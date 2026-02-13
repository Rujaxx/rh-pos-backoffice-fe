import { QueryParams } from './api';
import { MultilingualText } from './common/common.type';

export type RawItemType = 'RAW' | 'SEMI' | 'FINISHED';

export type Unit =
  | 'kg'
  | 'gm'
  | 'mg'
  | 'ml'
  | 'ltr'
  | 'box'
  | 'piece'
  | 'pack'
  | 'dozen'
  | 'crate';

export interface RawItem extends Record<string, unknown> {
  _id: string;
  name: string;
  type: RawItemType;
  baseUnit: Unit;
  costPerUnit?: number;
  expectedWasteRatio?: number;
  minimumStock?: number;
  restaurantId: string;
  brandId: string;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  brandName?: MultilingualText;
  restaurantName?: MultilingualText;
}

export interface RawItemQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  term?: string;
  fields?: string[];
  isActive?: string;
  type?: RawItemType;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateRawItemData {
  name: string;
  type: RawItemType;
  baseUnit: Unit;
  expectedWasteRatio?: number;
  minimumStock?: number;
  restaurantId: string;
  brandId: string;
  isActive?: boolean;
}
