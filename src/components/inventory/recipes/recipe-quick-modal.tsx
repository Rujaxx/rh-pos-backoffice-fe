'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Package,
  Utensils,
  Zap,
} from 'lucide-react';
import { useActiveRawItems } from '@/services/api/inventory/raw-materials/raw-materials.queries';
import { useActiveMenuItems } from '@/services/api/menu-items/menu-items.queries';
import { useActiveRecipes } from '@/services/api/inventory/recipes/recipes.queries';
import { useI18n } from '@/providers/i18n-provider';
import { RawItem } from '@/types/raw-materials.type';
import { MenuItem } from '@/types/menu-item.type';
import { Recipe } from '@/types/recipes.type';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { RecipeItem } from '@/types/recipes.type';

interface QuickRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId?: string;
  restaurantId?: string;
}

interface MenuItemAssignment {
  menuItemId: string;
  rawMaterialId: string;
  quantity: number;
}

// Mock data - defined once at the top
const MOCK_RAW_MATERIALS: RawItem[] = [
  {
    _id: '1',
    name: 'Pov',
    baseUnit: 'piece',
    type: 'RAW',
    restaurantId: 'rest1',
    brandId: 'brand1',
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    minimumStock: 0,
    expectedWasteRatio: 0,
  },
  {
    _id: '2',
    name: '500 Gm Box',
    baseUnit: 'piece',
    type: 'RAW',
    restaurantId: 'rest1',
    brandId: 'brand1',
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    minimumStock: 0,
    expectedWasteRatio: 0,
  },
  {
    _id: '3',
    name: 'Test For Private',
    baseUnit: 'piece',
    type: 'RAW',
    restaurantId: 'rest1',
    brandId: 'brand1',
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    minimumStock: 0,
    expectedWasteRatio: 0,
  },
  {
    _id: '4',
    name: 'Packaging Box',
    baseUnit: 'piece',
    type: 'RAW',
    restaurantId: 'rest1',
    brandId: 'brand1',
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    minimumStock: 0,
    expectedWasteRatio: 0,
  },
];

const MOCK_RECIPES: Recipe[] = [
  {
    _id: 'r1',
    name: { en: '7up Recipe', ar: '' },
    menuItemId: 'm1',
    restaurantId: 'rest1',
    brandId: 'brand1',
    recipeItems: [{ itemId: '1', quantity: 2 }],
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    menuItemName: { en: '7up', ar: '' },
  },
  {
    _id: 'r2',
    name: { en: 'Aloo Fry Recipe', ar: '' },
    menuItemId: 'm2',
    restaurantId: 'rest1',
    brandId: 'brand1',
    recipeItems: [{ itemId: '2', quantity: 1.5 }],
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    menuItemName: { en: 'Aloo Fry & Curd Rice Bow', ar: '' },
  },
  {
    _id: 'r3',
    name: { en: 'Aloo Gobi Recipe', ar: '' },
    menuItemId: 'm3',
    restaurantId: 'rest1',
    brandId: 'brand1',
    recipeItems: [{ itemId: '3', quantity: 1 }],
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    menuItemName: { en: 'Aloo Gobli Masala', ar: '' },
  },
  {
    _id: 'r4',
    name: { en: 'Arrabiata Recipe', ar: '' },
    menuItemId: 'm4',
    restaurantId: 'rest1',
    brandId: 'brand1',
    recipeItems: [{ itemId: '4', quantity: 3 }],
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    menuItemName: { en: 'Arrabato Posta', ar: '' },
  },
];

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    _id: 'm1',
    menuId: 'menu1',
    shortCode: '7UP',
    itemName: { en: '7up', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 25,
    categoryId: 'cat1',
    meatType: 'VEG',
    taxProductGroupId: 'tax1',
    kitchenDepartmentId: 'kit1',
    isActive: true,
    isRecommended: false,
    posStatus: true,
    platformStatus: true,
    digitalDiscount: false,
    syncToAggregator: false,
    openItem: false,
    openPrice: false,
    addOns: [],
    comboItems: [],
    isCombo: false,
    isAddon: false,
    images: [],
    brandId: 'brand1',
    restaurantId: 'rest1',
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    multiplePrices: [],
    currentStock: 0,
    hsnCode: '',
    foodType: 'VEG',
    alternativeTitle: '',
    preparationTime: 0,
    itemSortOrder: 0,
    primaryImage: '',
    primaryImageUrl: '',
  },
  {
    _id: 'm2',
    menuId: 'menu1',
    shortCode: 'ALOOFRY',
    itemName: { en: 'Aloo Fry & Curd Rice Bow', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 120,
    categoryId: 'cat1',
    meatType: 'VEG',
    taxProductGroupId: 'tax1',
    kitchenDepartmentId: 'kit1',
    isActive: true,
    isRecommended: false,
    posStatus: true,
    platformStatus: true,
    digitalDiscount: false,
    syncToAggregator: false,
    openItem: false,
    openPrice: false,
    addOns: [],
    comboItems: [],
    isCombo: false,
    isAddon: false,
    images: [],
    brandId: 'brand1',
    restaurantId: 'rest1',
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    multiplePrices: [],
    currentStock: 0,
    hsnCode: '',
    foodType: 'VEG',
    alternativeTitle: '',
    preparationTime: 0,
    itemSortOrder: 0,
    primaryImage: '',
    primaryImageUrl: '',
  },
  {
    _id: 'm3',
    menuId: 'menu1',
    shortCode: 'ALOOGOBI',
    itemName: { en: 'Aloo Gobli Masala', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 150,
    categoryId: 'cat1',
    meatType: 'VEG',
    taxProductGroupId: 'tax1',
    kitchenDepartmentId: 'kit1',
    isActive: true,
    isRecommended: false,
    posStatus: true,
    platformStatus: true,
    digitalDiscount: false,
    syncToAggregator: false,
    openItem: false,
    openPrice: false,
    addOns: [],
    comboItems: [],
    isCombo: false,
    isAddon: false,
    images: [],
    brandId: 'brand1',
    restaurantId: 'rest1',
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    multiplePrices: [],
    currentStock: 0,
    hsnCode: '',
    foodType: 'VEG',
    alternativeTitle: '',
    preparationTime: 0,
    itemSortOrder: 0,
    primaryImage: '',
    primaryImageUrl: '',
  },
  {
    _id: 'm4',
    menuId: 'menu1',
    shortCode: 'ARABIATA',
    itemName: { en: 'Arrabato Posta', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 180,
    categoryId: 'cat1',
    meatType: 'VEG',
    taxProductGroupId: 'tax1',
    kitchenDepartmentId: 'kit1',
    isActive: true,
    isRecommended: false,
    posStatus: true,
    platformStatus: true,
    digitalDiscount: false,
    syncToAggregator: false,
    openItem: false,
    openPrice: false,
    addOns: [],
    comboItems: [],
    isCombo: false,
    isAddon: false,
    images: [],
    brandId: 'brand1',
    restaurantId: 'rest1',
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    multiplePrices: [],
    currentStock: 0,
    hsnCode: '',
    foodType: 'VEG',
    alternativeTitle: '',
    preparationTime: 0,
    itemSortOrder: 0,
    primaryImage: '',
    primaryImageUrl: '',
  },
  {
    _id: 'm5',
    menuId: 'menu1',
    shortCode: 'AVOKAI',
    itemName: { en: 'Avokai Pulao', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 200,
    categoryId: 'cat1',
    meatType: 'VEG',
    taxProductGroupId: 'tax1',
    kitchenDepartmentId: 'kit1',
    isActive: true,
    isRecommended: false,
    posStatus: true,
    platformStatus: true,
    digitalDiscount: false,
    syncToAggregator: false,
    openItem: false,
    openPrice: false,
    addOns: [],
    comboItems: [],
    isCombo: false,
    isAddon: false,
    images: [],
    brandId: 'brand1',
    restaurantId: 'rest1',
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    multiplePrices: [],
    currentStock: 0,
    hsnCode: '',
    foodType: 'VEG',
    alternativeTitle: '',
    preparationTime: 0,
    itemSortOrder: 0,
    primaryImage: '',
    primaryImageUrl: '',
  },
];

// Step 1: Select Raw Material
function Step1SelectRawMaterial({
  onSelect,
  selectedRawMaterialId,
  brandId,
  restaurantId,
}: {
  onSelect: (id: string) => void;
  selectedRawMaterialId: string;
  brandId?: string;
  restaurantId?: string;
}) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rawItemsResponse, isLoading: isLoadingRawItems } =
    useActiveRawItems({
      brandId,
      restaurantId,
      search: searchTerm || undefined,
    });

  const { data: recipesResponse, isLoading: isLoadingRecipes } =
    useActiveRecipes({
      brandId,
      restaurantId,
    });

  // Use mock data if no real data - with safe access
  const rawMaterials: RawItem[] =
    rawItemsResponse?.data && rawItemsResponse.data.length > 0
      ? rawItemsResponse.data
      : MOCK_RAW_MATERIALS;

  const recipes: Recipe[] =
    recipesResponse?.data && recipesResponse.data.length > 0
      ? recipesResponse.data
      : MOCK_RECIPES;

  const getMenuItemNamesForRawMaterial = (rawMaterialId: string): string => {
    const menuItemNames = recipes
      .filter(
        (recipe: Recipe) =>
          recipe.recipeItems?.some(
            (item: RecipeItem) => item.itemId === rawMaterialId,
          ) ?? false,
      )
      .map((recipe: Recipe) => {
        if (recipe.menuItemName) {
          return (
            recipe.menuItemName[locale] || recipe.menuItemName.en || 'Unknown'
          );
        }
        return 'Unknown';
      })
      .join(', ');

    return menuItemNames || '-';
  };

  const getTotalQuantityForRawMaterial = (rawMaterialId: string): string => {
    const total = recipes
      .flatMap((recipe: Recipe) => recipe.recipeItems ?? [])
      .filter((item) => item?.itemId === rawMaterialId)
      .reduce((sum: number, item) => sum + (item?.quantity ?? 0), 0);

    return total > 0 ? total.toFixed(2) : '-';
  };

  const isLoading = isLoadingRawItems || isLoadingRecipes;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">
          {t('quickRecipe.step1') || 'Step 1: Raw Material'}
        </h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('quickRecipe.search') || 'Search:'}
          className="pl-8"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>
                  {t('quickRecipe.rawMaterialName') || 'Raw Materials Name'}
                </TableHead>
                <TableHead>
                  {t('quickRecipe.menuItemName') || 'Menu Item Name'}
                </TableHead>
                <TableHead className="w-[100px]">
                  {t('quickRecipe.quantity') || 'Qty.'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : rawMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchTerm
                      ? t('quickRecipe.noSearchResults') ||
                        'No raw materials found'
                      : t('quickRecipe.noRawMaterials') ||
                        'No raw materials available'}
                  </TableCell>
                </TableRow>
              ) : (
                rawMaterials.map((rawMaterial: RawItem, index: number) => (
                  <TableRow
                    key={rawMaterial._id}
                    className={
                      selectedRawMaterialId === rawMaterial._id
                        ? 'bg-primary/5'
                        : ''
                    }
                  >
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedRawMaterialId === rawMaterial._id}
                          onCheckedChange={() => onSelect(rawMaterial._id)}
                          id={rawMaterial._id}
                        />
                        <label
                          htmlFor={rawMaterial._id}
                          className="cursor-pointer font-medium"
                        >
                          {rawMaterial.name} [{rawMaterial.baseUnit}]
                        </label>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getMenuItemNamesForRawMaterial(rawMaterial._id)}
                    </TableCell>
                    <TableCell>
                      {getTotalQuantityForRawMaterial(rawMaterial._id)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 2: Add to Menu Items - WITH CHECKBOXES, SELECT ALL, AND DEFAULT VALUE AT TOP
function Step2AddToMenuItems({
  selectedRawMaterialId,
  brandId,
  restaurantId,
  onComplete,
}: {
  selectedRawMaterialId: string;
  brandId?: string;
  restaurantId?: string;
  onComplete: (assignments: MenuItemAssignment[]) => void;
}) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [defaultValue, setDefaultValue] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());

  const { data: rawItemsResponse } = useActiveRawItems({
    brandId,
    restaurantId,
  });

  const selectedRawMaterial: RawItem | undefined =
    rawItemsResponse?.data?.find(
      (item: RawItem) => item._id === selectedRawMaterialId,
    ) ??
    MOCK_RAW_MATERIALS.find(
      (item: RawItem) => item._id === selectedRawMaterialId,
    );

  const { data: menuItemsResponse, isLoading } = useActiveMenuItems({
    brandId,
    restaurantId,
    term: searchTerm || undefined,
    isActive: 'true',
    limit: 100,
  });

  // Use mock data if no real data
  const menuItems: MenuItem[] =
    menuItemsResponse?.data && menuItemsResponse.data.length > 0
      ? menuItemsResponse.data
      : MOCK_MENU_ITEMS;

  // Check if all items are selected
  const isAllSelected =
    menuItems.length > 0 &&
    menuItems.every((item) => selectedItems.has(item._id));

  // Handle select all
  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      const allIds = new Set(menuItems.map((item) => item._id));
      setSelectedItems(allIds);

      // Apply default value to all if exists
      const numValue = parseFloat(defaultValue);
      if (!isNaN(numValue) && numValue > 0) {
        const newQuantities = new Map();
        menuItems.forEach((item) => {
          newQuantities.set(item._id, numValue);
        });
        setQuantities(newQuantities);
      }
    } else {
      setSelectedItems(new Set());
      setQuantities(new Map());
    }
  };

  // Handle individual item selection
  const handleItemSelect = (itemId: string, checked: boolean): void => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);

      // Apply default value if exists
      const numValue = parseFloat(defaultValue);
      if (!isNaN(numValue) && numValue > 0) {
        const newQuantities = new Map(quantities);
        newQuantities.set(itemId, numValue);
        setQuantities(newQuantities);
      }
    } else {
      newSelected.delete(itemId);
      // Remove quantity when deselected
      const newQuantities = new Map(quantities);
      newQuantities.delete(itemId);
      setQuantities(newQuantities);
    }
    setSelectedItems(newSelected);
  };

  // Handle default value change - applies to SELECTED items only
  const handleDefaultValueChange = (value: string): void => {
    setDefaultValue(value);
    const numValue = parseFloat(value);

    if (!isNaN(numValue) && numValue > 0) {
      // Apply to ALL selected items
      const newQuantities = new Map(quantities);
      selectedItems.forEach((itemId) => {
        newQuantities.set(itemId, numValue);
      });
      setQuantities(newQuantities);
    }
  };

  const handleQuantityChange = (itemId: string, quantity: string): void => {
    const numericQuantity = parseFloat(quantity);

    const newQuantities = new Map(quantities);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      newQuantities.delete(itemId);
    } else {
      newQuantities.set(itemId, numericQuantity);
    }
    setQuantities(newQuantities);

    // Clear default value when manually editing
    if (defaultValue) {
      setDefaultValue('');
    }
  };

  const getQuantity = (itemId: string): string => {
    return quantities.get(itemId)?.toString() ?? '';
  };

  const handleSubmit = (): void => {
    if (selectedItems.size === 0) {
      toast.error(
        t('quickRecipe.selectAtLeastOneMenuItem') ||
          'Select at least one menu item',
      );
      return;
    }

    // Create assignments only for selected items with valid quantities
    const assignments: MenuItemAssignment[] = [];
    selectedItems.forEach((itemId) => {
      const quantity = quantities.get(itemId);
      if (quantity && quantity > 0) {
        assignments.push({
          menuItemId: itemId,
          rawMaterialId: selectedRawMaterialId,
          quantity,
        });
      }
    });

    if (assignments.length === 0) {
      toast.error(
        t('quickRecipe.enterQuantities') ||
          'Enter quantities for selected items',
      );
      return;
    }

    onComplete(assignments);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Utensils className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">
          {t('quickRecipe.step2') || 'Step 2: Menu Item(s)'}
        </h3>
      </div>

      {selectedRawMaterial && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="text-muted-foreground">
                  {t('quickRecipe.selected') || 'Selected:'}
                </span>
                <span className="ml-2 font-medium">
                  {selectedRawMaterial.name} [{selectedRawMaterial.baseUnit}]
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DEFAULT VALUE SECTION */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <Label className="text-sm font-medium">
          {t('quickRecipe.defaultValue') || 'Default Quantity'}
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={
              t('quickRecipe.defaultValuePlaceholder') || 'Enter quantity...'
            }
            className="w-48"
            value={defaultValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDefaultValueChange(e.target.value)
            }
          />
          <span className="text-sm text-muted-foreground">
            {selectedRawMaterial?.baseUnit}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {t('quickRecipe.defaultValueHint') || 'Applies to selected items'}
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('quickRecipe.search') || 'Search menu items...'}
          className="pl-8"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label={t('quickRecipe.selectAll') || 'Select all'}
                    className="mx-2"
                  />
                </TableHead>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>
                  {t('quickRecipe.menuItemName') || 'Menu Item Name'}
                </TableHead>
                <TableHead className="w-[150px]">
                  {t('quickRecipe.quantity') || 'Qty.'}
                  {selectedRawMaterial && ` (${selectedRawMaterial.baseUnit})`}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchTerm
                      ? t('quickRecipe.noSearchResults') ||
                        'No menu items found'
                      : t('quickRecipe.noMenuItems') ||
                        'No menu items available'}
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((menuItem: MenuItem, index: number) => (
                  <TableRow key={menuItem._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(menuItem._id)}
                        onCheckedChange={(checked: boolean) =>
                          handleItemSelect(menuItem._id, checked)
                        }
                        aria-label={`Select ${menuItem.itemName[locale] || menuItem.itemName.en}`}
                        className="mx-2"
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {menuItem.itemName[locale] ?? menuItem.itemName.en}
                      </span>
                      {menuItem.shortCode && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({menuItem.shortCode})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={getQuantity(menuItem._id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleQuantityChange(menuItem._id, e.target.value)
                        }
                        disabled={!selectedItems.has(menuItem._id)}
                        className="w-24 h-8"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          {selectedItems.size}{' '}
          {t('quickRecipe.itemsSelected') || 'items selected'}
        </span>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          {t('quickRecipe.addToMenuItems') || 'Add to Menu Items'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
// Main Quick Recipe Modal
export function QuickRecipeModal({
  isOpen,
  onClose,
  brandId,
  restaurantId,
}: QuickRecipeModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(1);
  const [selectedRawMaterialId, setSelectedRawMaterialId] =
    useState<string>('');

  const handleRawMaterialSelect = (id: string): void => {
    setSelectedRawMaterialId((prev: string) => (prev === id ? '' : id));
  };

  const handleStep2Complete = (newAssignments: MenuItemAssignment[]): void => {
    console.log('Creating recipes:', newAssignments);
    toast.success(
      t('quickRecipe.success') || 'Quick recipe created successfully',
    );
    handleClose();
  };

  const handleClose = (): void => {
    setStep(1);
    setSelectedRawMaterialId('');
    onClose();
  };

  const handleNext = (): void => {
    if (!selectedRawMaterialId) {
      toast.error(
        t('quickRecipe.selectRawMaterialFirst') ||
          'Please select a raw material',
      );
      return;
    }
    setStep(2);
  };

  const handleBack = (): void => {
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('quickRecipe.title') || 'Quick Recipe'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <Step1SelectRawMaterial
            onSelect={handleRawMaterialSelect}
            selectedRawMaterialId={selectedRawMaterialId}
            brandId={brandId}
            restaurantId={restaurantId}
          />
        ) : (
          <Step2AddToMenuItems
            selectedRawMaterialId={selectedRawMaterialId}
            brandId={brandId}
            restaurantId={restaurantId}
            onComplete={handleStep2Complete}
          />
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          {step === 2 && (
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.back') || 'Back'}
            </Button>
          )}
          {step === 1 && (
            <Button onClick={handleNext} className="ml-auto">
              {t('common.next') || 'Next'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
