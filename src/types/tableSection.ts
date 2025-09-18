import { MultilingualText, TableAction } from "./brand"; // same as you used for Restaurant

export type { TableAction }

export interface TableSection extends Record<string, unknown> {
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

