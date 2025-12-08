import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

export interface OrderType extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderTypeQueryParams extends QueryParams {
  isActive?: string;
}
