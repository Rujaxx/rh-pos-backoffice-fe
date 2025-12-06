import { QueryParams } from './api';

export interface Permission extends Record<string, unknown> {
  _id: string;
  name: string;
}

export interface PermissionModuleGroup extends Record<string, unknown> {
  module: string;
  permissions: Permission[];
}

export interface PermissionModulesResponse extends Record<string, unknown> {
  data: PermissionModuleGroup[];
}

export interface PermissionQueryParams extends QueryParams {
  module?: string;
}
