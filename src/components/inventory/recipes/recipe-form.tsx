'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFMultilingualInput,
  RHFSwitch,
  RHFSelect,
  RHFTextarea,
} from '@/components/ui/form-components';
import { Recipe, RecipeItem } from '@/types/recipes.type';
import {
  CreateRecipeData,
  createRecipeSchema,
} from '@/lib/validations/recipe.validations';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';
import { Brand } from '@/types/brand.type';
import { Restaurant } from '@/types/restaurant';
import { Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActiveRawItems } from '@/services/api/inventory/raw-materials/raw-materials.queries';
import { RawItem } from '@/types/raw-materials.type';

interface RecipeFormContentProps {
  form: UseFormReturn<CreateRecipeData>;
  editingRecipe?: Recipe | null;
}

interface RawMaterialOption {
  _id: string;
  name: string;
  unit: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export function RecipeFormContent({
  form,
  editingRecipe,
}: RecipeFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const recipeItems = form.watch('recipeItems');
  const selectedBrandId = form.watch('brandId');
  const selectedRestaurantId = form.watch('restaurantId');

  // Fetch real data for dropdowns
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  // Fetch ONLY raw materials from the database
  const { data: rawItemsResponse, isLoading: isLoadingRawItems } =
    useActiveRawItems({
      brandId: selectedBrandId,
      restaurantId: selectedRestaurantId,
    });

  // Prepare options for dropdowns
  const brandOptions: SelectOption[] = (brandsResponse?.data || []).map(
    (brand: Brand) => ({
      value: brand._id,
      label: brand.name[locale] || brand.name.en || brand._id,
    }),
  );

  const restaurantOptions: SelectOption[] = (
    restaurantsResponse?.data || []
  ).map((restaurant: Restaurant) => ({
    value: restaurant._id,
    label: restaurant.name[locale] || restaurant.name.en || restaurant._id,
  }));

  // Raw materials from DB
  const rawMaterialOptions: RawMaterialOption[] = (
    rawItemsResponse?.data || []
  ).map((rawItem: RawItem) => ({
    _id: rawItem._id,
    name: rawItem.name,
    unit: rawItem.baseUnit,
  }));

  const addRecipeItem = (): void => {
    form.setValue('recipeItems', [
      ...(recipeItems || []),
      { itemId: '', quantity: 0 },
    ]);
  };

  const removeRecipeItem = (index: number): void => {
    const updatedItems = (recipeItems || []).filter((_, i) => i !== index);
    form.setValue('recipeItems', updatedItems);
  };

  const clearAllItems = (): void => {
    form.setValue('recipeItems', []);
  };

  const getItemUnit = (itemId: string): string => {
    const item = rawMaterialOptions.find((i) => i._id === itemId);
    return item?.unit || '';
  };

  const handleQuantityChange = (index: number, value: string): void => {
    const numericValue = parseFloat(value);
    form.setValue(
      `recipeItems.${index}.quantity`,
      isNaN(numericValue) ? 0 : numericValue,
    );
  };

  const handleItemChange = (index: number, value: string): void => {
    form.setValue(`recipeItems.${index}.itemId`, value);
  };

  return (
    <>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('recipes.form.basicInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand */}
            <RHFSelect
              form={form}
              name="brandId"
              label={t('recipes.form.brand')}
              placeholder={
                isLoadingBrands
                  ? t('common.loading')
                  : brandOptions.length === 0
                    ? t('common.noBrandsAvailable')
                    : t('recipes.form.selectBrand')
              }
              options={brandOptions}
              disabled={!!editingRecipe || isLoadingBrands}
            />

            {/* Restaurant */}
            <RHFSelect
              form={form}
              name="restaurantId"
              label={t('recipes.form.restaurant')}
              placeholder={
                isLoadingRestaurants
                  ? t('common.loading')
                  : restaurantOptions.length === 0
                    ? t('restaurants.form.noRestaurantsAvailable')
                    : t('recipes.form.selectRestaurant')
              }
              options={restaurantOptions}
              disabled={!!editingRecipe || isLoadingRestaurants}
            />
          </div>

          {/* Recipe Name - Multilingual */}
          <RHFMultilingualInput
            form={form}
            name="name"
            label={t('recipes.form.recipeName')}
            placeholder={{
              en:
                t('recipes.form.namePlaceholderEn') || 'Recipe name in English',
              ar: t('recipes.form.namePlaceholderAr') || 'اسم الوصفة بالعربية',
            }}
          />

          {/* Instructions */}
          <RHFTextarea
            form={form}
            name="instructions"
            label={t('recipes.form.instructions')}
            placeholder={t('recipes.form.instructionsPlaceholder')}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Recipe Items - Raw Materials from DB */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {t('recipes.form.recipeItems')}
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllItems}
              disabled={!recipeItems || recipeItems.length === 0}
            >
              {t('recipes.form.clearAll')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recipeItems && recipeItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('recipes.form.item')}</TableHead>
                  <TableHead>{t('recipes.form.quantity')}</TableHead>
                  <TableHead>{t('recipes.form.unit')}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipeItems.map(
                  (
                    item: { itemId: string; quantity: number },
                    index: number,
                  ) => {
                    const unit = getItemUnit(item.itemId);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={item.itemId}
                            onValueChange={(value: string) =>
                              handleItemChange(index, value)
                            }
                            disabled={isLoadingRawItems}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isLoadingRawItems
                                    ? t('common.loading')
                                    : !selectedBrandId || !selectedRestaurantId
                                      ? t(
                                          'recipes.form.selectBrandRestaurantFirst',
                                        ) || 'Select brand/restaurant first'
                                      : rawMaterialOptions.length === 0
                                        ? t('recipes.form.noRawMaterials') ||
                                          'No raw materials available'
                                        : t('recipes.form.selectItem')
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {rawMaterialOptions.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  {!selectedBrandId || !selectedRestaurantId
                                    ? 'Select brand and restaurant first'
                                    : 'No raw materials found'}
                                </div>
                              ) : (
                                rawMaterialOptions.map(
                                  (rawMaterial: RawMaterialOption) => (
                                    <SelectItem
                                      key={rawMaterial._id}
                                      value={rawMaterial._id}
                                    >
                                      {rawMaterial.name} ({rawMaterial.unit})
                                    </SelectItem>
                                  ),
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleQuantityChange(index, e.target.value)}
                            placeholder="0.00"
                            disabled={!item.itemId}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {unit || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRecipeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">
                {t('recipes.form.noItems')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {!selectedBrandId || !selectedRestaurantId
                  ? t('recipes.form.selectBrandRestaurantFirst') ||
                    'Select brand and restaurant to add raw materials'
                  : t('recipes.form.addItemsPrompt') ||
                    'Click the button below to add raw materials'}
              </p>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={addRecipeItem}
            className="w-full"
            disabled={
              isLoadingRawItems || !selectedBrandId || !selectedRestaurantId
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('recipes.form.addItem')}
          </Button>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('recipes.form.status')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RHFSwitch
            form={form}
            name="isActive"
            label={t('recipes.form.active')}
            description={t('recipes.form.activeDescription')}
          />
        </CardContent>
      </Card>
    </>
  );
}

// Hook for recipe form logic
export function useRecipeForm(editingRecipe?: Recipe | null) {
  const form = useForm<CreateRecipeData>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      restaurantId: '',
      brandId: '',
      instructions: '',
      recipeItems: [],
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (editingRecipe) {
      // Make sure we're mapping to the correct shape
      const recipeItems =
        editingRecipe.recipeItems?.map((item: RecipeItem) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })) || [];

      form.reset({
        name: editingRecipe.name,
        restaurantId: editingRecipe.restaurantId,
        brandId: editingRecipe.brandId,
        instructions: editingRecipe.instructions || '',
        recipeItems: recipeItems,
        isActive: editingRecipe.isActive ?? true,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        restaurantId: '',
        brandId: '',
        instructions: '',
        recipeItems: [],
        isActive: true,
      });
    }
  }, [editingRecipe, form]);

  return {
    form,
    isEditing: !!editingRecipe,
  };
}
