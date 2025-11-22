import { MultilingualText } from "@/types/common/common.type";
import { QueryParams } from "./api";

export interface MenuItem {
  _id: string;

  menuId: string;

  shortCode: string;

  itemName: MultilingualText;
  description?: MultilingualText;

  hsnCode?: string;

  currentStock: number;

  baseItemPrice: number;

  categoryId: string;
  subCategoryId?: string;

  foodType?: "VEG" | "NON_VEG" | "VEGAN";

  meatType: "VEG" | "CHICKEN" | "MUTTON" | "FISH";

  taxProductGroupId: string;
  kitchenDepartmentId: string;

  isActive: boolean;
  isRecommended: boolean;

  posStatus: boolean;
  platformStatus: boolean;

  digitalDiscount: boolean;
  discountType?: "Percentage" | "Fixed Amount";
  discountedPrice?: number;

  syncToAggregator: boolean;

  alternativeTitle?: string;

  preparationTime?: number;

  openItem: boolean;
  openPrice: boolean;

  itemSortOrder?: number;

  addOns: AddOn[];
  comboItems: ComboItem[];

  isCombo: boolean;
  isAddon: boolean;

  images: string[];
  primaryImage?: string;

  brandId: string;
  restaurantId: string;

  // Backend-provided name fields for display
  categoryName?: MultilingualText;
  subCategoryName?: MultilingualText;
  taxProductGroupInfo?: {
    name: MultilingualText;
    taxType: string;
    taxValue: number;
  };
  taxProductGroupName?: MultilingualText;
  kitchenDepartmentName?: MultilingualText;
  brandName?: string;
  restaurantName?: MultilingualText;
  menuName?: MultilingualText;

  multiplePrices: MultiplePrice[];

  createdBy: string;
  updatedBy: string;
  deletedBy?: string;

  deletedAt?: string | Date;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ---------------------
// Nested Types
// ---------------------

export interface AddOn {
  itemId: string;
  price: number;
}

export interface ComboItem {
  itemId: string;
  quantity: number;
}

export interface MultiplePrice {
  orderTypeId?: string;
  tableSectionId?: string;
  price: number;
}

// ---------------------
// Form Type for FE (Create/Update)
// ---------------------

export interface MenuItemFormData extends Record<string, unknown> {
  _id?: string;

  menuId: string;

  shortCode: string;

  itemName: MultilingualText;
  description?: MultilingualText;

  hsnCode?: string;

  currentStock: number;

  baseItemPrice: number;

  categoryId: string;
  subCategoryId?: string;

  foodType?: "VEG" | "NON_VEG" | "VEGAN";
  meatType: "VEG" | "CHICKEN" | "MUTTON" | "FISH";

  taxProductGroupId: string;
  kitchenDepartmentId: string;

  isActive: boolean;
  isRecommended: boolean;

  posStatus: boolean;
  platformStatus: boolean;

  digitalDiscount: boolean;
  discountType?: "Percentage" | "Fixed Amount";
  discountedPrice?: number;

  syncToAggregator: boolean;

  alternativeTitle?: string;

  preparationTime?: number;

  openItem: boolean;
  openPrice: boolean;

  itemSortOrder?: number;

  addOns: AddOn[];
  comboItems: ComboItem[];

  isCombo: boolean;
  isAddon: boolean;

  images: string[];
  primaryImage?: string;

  brandId: string;
  restaurantId: string;

  multiplePrices: MultiplePrice[];

  billPrefix?: string;
  kotPrefix?: string;
}

//update item array
export interface MenuItemUpdateArray extends Record<string, unknown> {
  _id: string;

  menuId: string;

  shortCode: string;

  itemName: MultilingualText;
  description?: MultilingualText;

  hsnCode?: string;

  currentStock: number;

  baseItemPrice: number;

  categoryId: string;
  subCategoryId?: string;

  foodType?: "VEG" | "NON_VEG" | "VEGAN";
  meatType: "VEG" | "CHICKEN" | "MUTTON" | "FISH";

  taxProductGroupId: string;
  kitchenDepartmentId: string;

  isActive: boolean;
  isRecommended: boolean;

  posStatus: boolean;
  platformStatus: boolean;

  digitalDiscount: boolean;
  discountType?: "Percentage" | "Fixed Amount";
  discountedPrice?: number;

  syncToAggregator: boolean;

  alternativeTitle?: string;

  preparationTime?: number;

  openItem: boolean;
  openPrice: boolean;

  itemSortOrder?: number;

  addOns: AddOn[];
  comboItems: ComboItem[];

  isCombo: boolean;
  isAddon: boolean;

  images: string[];
  primaryImage?: string;

  brandId: string;
  restaurantId: string;

  multiplePrices: MultiplePrice[];

  billPrefix?: string;
  kotPrefix?: string;
}
// ---------------------
// Query Parameters
// ---------------------

export interface MenuItemQueryParams extends QueryParams {
  // Pagination
  page?: number;
  limit?: number;

  // Search
  term?: string; // Search by name or short code
  fields?: string[]; // Fields to search in

  // Filters
  menuId?: string; // Filter by menu
  categoryId?: string; // Filter by category
  subCategoryId?: string; // Filter by sub-category
  isActive?: string; // "true" | "false"
  isRecommended?: string; // "true" | "false"
  isCombo?: string; // "true" | "false"
  isAddon?: string; // "true" | "false"
  foodType?: "VEG" | "NON_VEG" | "VEGAN";
  meatType?: "VEG" | "CHICKEN" | "MUTTON" | "FISH";
  posStatus?: string; // "true" | "false"
  platformStatus?: string; // "true" | "false"

  // Sorting
  sortBy?:
    | "itemName"
    | "baseItemPrice"
    | "currentStock"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "asc" | "desc";
}
