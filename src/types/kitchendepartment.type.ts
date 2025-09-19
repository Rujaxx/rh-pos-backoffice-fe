import { MultilingualText } from './common/common.type';
import { TableAction } from './brand.type';

export type { TableAction };

export interface kitchenDepartment extends Record<string, unknown> {
    _id: string,
    name: MultilingualText,
    shortCode: string,
    isActive: boolean,
    brandId: string,
    brandName: MultilingualText,
    restaurantId: string,
    restaurantName: MultilingualText,
    createdBy: string,
    updatedBy: string,
    deletedBy: string,
    deletedAt: Date
}

export interface KitchenDepartmentColumn {
    id: keyof kitchenDepartment | "actions";
    label: string;
    sortable?: boolean;
    filterable?: boolean;
}