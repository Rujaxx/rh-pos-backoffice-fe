// services/api/inventory/recipes/recipes.queries.ts
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { BaseApiService } from '@/services/api/base/client';
import { PaginatedResponse } from '@/types/api';
import { Recipe, RecipeQueryParams } from '@/types/recipes.type';

class RecipeService extends BaseApiService<
  Recipe,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(API_ENDPOINTS.RECIPES.LIST);
  }

  // Get active recipes only
  async getActiveRecipes(
    params?: RecipeQueryParams,
  ): Promise<PaginatedResponse<Recipe>> {
    return this.getAll({ ...params, isActive: 'true' });
  }
}

export const recipeService = new RecipeService();

// Get all recipes
export const useRecipes = (params?: RecipeQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPES.LIST(params),
    queryFn: () => recipeService.getAll(params),
  });
};

// Get active recipes only
export const useActiveRecipes = (params?: RecipeQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPES.LIST({ ...params, isActive: 'true' }),
    queryFn: () => recipeService.getActiveRecipes(params),
  });
};

// Get single recipe by ID
export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPES.DETAIL(id),
    queryFn: () => recipeService.getById(id),
    enabled: !!id,
  });
};
