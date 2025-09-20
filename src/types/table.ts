import { TableAction } from "./brand.type"; // same as Restaurant
import { MultilingualText } from "./common/common.type";

export type { TableAction };

export interface Table extends Record<string, unknown> {
    _id?: string,
    tableSectionId: string;        // ObjectId of TableSection
    label: string;                 // table label
    capacity: string;              // seating capacity
    isAvailable: boolean;          // availability status
    restaurantId: string;          // ObjectId of Restaurant
    restaurantName: MultilingualText; // multilingual restaurant name for display
    createdBy: string;             // ObjectId of User
    updatedBy: string;             // ObjectId of User
    deletedBy?: string;            // ObjectId of User
    deletedAt?: Date;              // deletion timestamp
    createdAt?: Date;              // auto by mongoose timestamps
    updatedAt?: Date;              // auto by mongoose timestamps
}

export interface TableColumn {
    id: keyof Table | "actions";
    label: string;
    sortable?: boolean;
    filterable?: boolean;
}
