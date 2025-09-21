// same as you used for Restaurant
import { TableAction } from "@/types/brand.type";
import { MultilingualText } from "@/types/common/common.type";

export type { TableAction }

export interface TableSection extends Record<string, unknown> {
    _id?: string,
    restaurantId: string;     // store the id of the restaurant
    restaurantName: MultilingualText;  // for display in the table
    name: MultilingualText;// multilingual object
    isActive: boolean,
    createdBy?: string,
    updatedBy?: string,
    deletedBy?: string,
    deletedAt?: Date
}

export interface TableSectionColumn {
    id: keyof TableSection | "actions";
    label: string;
    sortable?: boolean;
    filterable?: boolean;
}
