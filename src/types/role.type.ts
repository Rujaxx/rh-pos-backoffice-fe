import { QueryParams } from "./api";
import { MultilingualText } from "./common/common.type";
import { Permission } from "./permission.type";

export interface Role extends Record<string, unknown> {
  _id: string;
  brandId: string;
  name: MultilingualText;
  description?: MultilingualText;
  permissions: Permission[];
  permissionCount?: number;
  isSystemRole: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleQueryParams extends QueryParams {
  sortOrder?: string;
  isSystemRole?: boolean;
}
