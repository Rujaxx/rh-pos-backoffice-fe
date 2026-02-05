import { QueryParams } from './api';
import { MultilingualText } from './common/common.type';

export interface IdsDto {
  _id: string;
  name: MultilingualText;
}

export interface UserDto {
  _id: string;
  name: string;
  email: string;
}

// Download Report Status Enum
export enum DownloadReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface DownloadReportItem {
  _id: string;
  brandId: IdsDto;
  restaurantIds: IdsDto[];
  name: string;
  type: string;
  dateRange: string;
  status: DownloadReportStatus;
  downloadUrl: string;
  generatedBy: UserDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface DownloadReportQueryParams extends QueryParams {
  brandId?: string;
  restaurantId?: string;
  page?: number;
  limit?: number;
}
