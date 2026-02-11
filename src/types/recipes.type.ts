import { QueryParams } from './api';
import { MultilingualText } from './common/common.type';

export interface RecipeItem {
  itemId: string;
  quantity: number;
  itemName?: string;
}

export interface Recipe extends Record<string, unknown> {
  _id: string;
  name: MultilingualText;
  menuItemId: string;
  restaurantId: string;
  brandId: string;
  instructions?: string;
  recipeItems: RecipeItem[];
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Joined fields
  brandName?: MultilingualText;
  restaurantName?: MultilingualText;
  menuItemName?: MultilingualText;
}

export interface RecipeQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  term?: string;
  fields?: string[];
  isActive?: string;
  brandId?: string;
  restaurantId?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateRecipeData {
  name: MultilingualText;
  menuItemId: string;
  restaurantId: string;
  brandId: string;
  instructions?: string;
  recipeItems: RecipeItem[];
  isActive?: boolean;
}
