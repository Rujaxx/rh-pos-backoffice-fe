import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';

export const recipeItemSchema = z.object({
  itemId: z.string().min(1, 'Item is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  itemName: z.string().optional(),
});

export const createRecipeSchema = z.object({
  name: multilingualTextSchema,
  menuItemId: z.string().min(1, 'Menu item is required'),
  restaurantId: z.string().min(1, 'Restaurant is required'),
  brandId: z.string().min(1, 'Brand is required'),
  instructions: z.string().optional(),
  recipeItems: z
    .array(recipeItemSchema)
    .min(1, 'At least one recipe item is required'),
  isActive: z.boolean().default(true),
});

export type CreateRecipeData = z.input<typeof createRecipeSchema>;
export type RecipeItemData = z.input<typeof recipeItemSchema>;
