'use client';

import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Copy,
  AlertCircle,
} from 'lucide-react';
import { useActiveMenuItems } from '@/services/api/menu-items/menu-items.queries';
import { useRecipes } from '@/services/api/inventory/recipes/recipes.queries';
import { useI18n } from '@/providers/i18n-provider';
import { MenuItem } from '@/types/menu-item.type';
import { Recipe, RecipeItem } from '@/types/recipes.type';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CopyRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId?: string;
  restaurantId?: string;
}

interface CopyAssignment {
  fromMenuItemId: string;
  toMenuItemId: string;
  recipeItems: RecipeItem[];
}

// ============ MOCK DATA - LIKE QUICK RECIPE ============
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    _id: 'm1',
    menuId: 'menu1',
    shortCode: 'PAVBHJ',
    itemName: { en: 'Pav Bhaji [Regular]', ar: '' },
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
    _id: 'm2',
    menuId: 'menu1',
    shortCode: 'CHPAVBHJ',
    itemName: { en: 'Cheese Pav Bhaji [Regular]', ar: '' },
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
    _id: 'm3',
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
    _id: 'm4',
    menuId: 'menu1',
    shortCode: 'ALOOGOBI',
    itemName: { en: 'Aloo Gobi Masala', ar: '' },
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
    _id: 'm5',
    menuId: 'menu1',
    shortCode: 'BUTTPNR',
    itemName: { en: 'Butter Paneer Rice Bowl', ar: '' },
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
    _id: 'm6',
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
    _id: 'm7',
    menuId: 'menu1',
    shortCode: 'ARRPASTA',
    itemName: { en: 'Arrabita Pasta', ar: '' },
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
    _id: 'm8',
    menuId: 'menu1',
    shortCode: 'AVAKAI',
    itemName: { en: 'Avakai Pulao', ar: '' },
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
  {
    _id: 'm9',
    menuId: 'menu1',
    shortCode: 'BLKCOFF',
    itemName: { en: 'Black Coffee', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 50,
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
    _id: 'm10',
    menuId: 'menu1',
    shortCode: 'BOTWAT',
    itemName: { en: 'Bottled Water', ar: '' },
    description: { en: '', ar: '' },
    baseItemPrice: 20,
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

const MOCK_RECIPES: Recipe[] = [
  {
    _id: 'r1',
    name: { en: 'Pav Bhaji Recipe', ar: '' },
    menuItemId: 'm1',
    restaurantId: 'rest1',
    brandId: 'brand1',
    recipeItems: [
      { itemId: '1', quantity: 123 },
      { itemId: '2', quantity: 12 },
      { itemId: '3', quantity: 12 },
      { itemId: '4', quantity: 12 },
      { itemId: '5', quantity: 12 },
      { itemId: '6', quantity: 12 },
    ],
    isActive: true,
    createdBy: 'mock',
    updatedBy: 'mock',
    createdAt: new Date(),
    updatedAt: new Date(),
    menuItemName: { en: 'Pav Bhaji [Regular]', ar: '' },
  },
];

const MOCK_RAW_MATERIALS = [
  { _id: '1', name: 'Potato', baseUnit: 'GM' },
  { _id: '2', name: 'Green Pea', baseUnit: 'GM' },
  { _id: '3', name: 'Salt', baseUnit: 'gram' },
  { _id: '4', name: 'Oil', baseUnit: 'ML' },
  { _id: '5', name: 'Pav', baseUnit: 'Piece' },
  { _id: '6', name: 'Pav Bhaji Masala Paste', baseUnit: 'GM' },
];
// ============ END MOCK DATA ============

// Step 1: Select Source Recipe (FROM)
function Step1SelectSourceRecipe({
  onSelect,
  selectedSourceId,
  brandId,
  restaurantId,
}: {
  onSelect: (id: string) => void;
  selectedSourceId: string;
  brandId?: string;
  restaurantId?: string;
}) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: menuItemsResponse, isLoading: isLoadingMenu } =
    useActiveMenuItems({
      brandId,
      restaurantId,
      term: searchTerm || undefined,
      isActive: 'true',
      limit: 100,
    });

  const { data: recipesResponse, isLoading: isLoadingRecipes } = useRecipes({
    brandId,
    restaurantId,
  });

  // Use mock data if no real data - LIKE QUICK RECIPE
  const menuItems: MenuItem[] =
    menuItemsResponse?.data && menuItemsResponse.data.length > 0
      ? menuItemsResponse.data
      : MOCK_MENU_ITEMS;

  const recipes: Recipe[] =
    recipesResponse?.data && recipesResponse.data.length > 0
      ? recipesResponse.data
      : MOCK_RECIPES;

  const menuItemsWithRecipes = menuItems.filter((menuItem: MenuItem) =>
    recipes.some((recipe: Recipe) => recipe.menuItemId === menuItem._id),
  );

  const isLoading = isLoadingMenu || isLoadingRecipes;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">
          {t('copyRecipe.step1') || 'Copy From'}
        </h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('copyRecipe.search') || 'Search:'}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">
              {t('copyRecipe.menuItemName') || 'Menu Item Name'}
            </Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('common.loading')}
                </div>
              ) : menuItemsWithRecipes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? t('copyRecipe.noSearchResults') || 'No results found'
                    : t('copyRecipe.noRecipes') || 'No recipes available'}
                </div>
              ) : (
                menuItemsWithRecipes.map((menuItem: MenuItem) => (
                  <div
                    key={menuItem._id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={selectedSourceId === menuItem._id}
                      onCheckedChange={() => onSelect(menuItem._id)}
                      id={menuItem._id}
                    />
                    <Label
                      htmlFor={menuItem._id}
                      className="cursor-pointer flex-1"
                    >
                      <span className="font-medium">
                        {menuItem.itemName[locale] || menuItem.itemName.en}
                      </span>
                      {menuItem.shortCode && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({menuItem.shortCode})
                        </span>
                      )}
                      <Badge variant="outline" className="ml-2">
                        {t('copyRecipe.hasRecipe') || 'Has Recipe'}
                      </Badge>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 2: Select Target Menu Items (TO)
function Step2SelectTargetItems({
  selectedSourceId,
  selectedTargetIds,
  onSelectTarget,
  brandId,
  restaurantId,
}: {
  selectedSourceId: string;
  selectedTargetIds: Set<string>;
  onSelectTarget: (ids: Set<string>) => void;
  brandId?: string;
  restaurantId?: string;
}) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: menuItemsResponse, isLoading: isLoadingMenu } =
    useActiveMenuItems({
      brandId,
      restaurantId,
      term: searchTerm || undefined,
      isActive: 'true',
      limit: 100,
    });

  const { data: recipesResponse, isLoading: isLoadingRecipes } = useRecipes({
    brandId,
    restaurantId,
  });

  // Use mock data if no real data - LIKE QUICK RECIPE
  const menuItems: MenuItem[] =
    menuItemsResponse?.data && menuItemsResponse.data.length > 0
      ? menuItemsResponse.data
      : MOCK_MENU_ITEMS;

  const recipes: Recipe[] =
    recipesResponse?.data && recipesResponse.data.length > 0
      ? recipesResponse.data
      : MOCK_RECIPES;

  const availableTargets = menuItems.filter((menuItem: MenuItem) => {
    if (menuItem._id === selectedSourceId) return false;
    const hasRecipe = recipes.some(
      (recipe: Recipe) => recipe.menuItemId === menuItem._id,
    );
    return !hasRecipe;
  });

  const isLoading = isLoadingMenu || isLoadingRecipes;
  const isAllSelected =
    availableTargets.length > 0 &&
    availableTargets.every((item) => selectedTargetIds.has(item._id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(availableTargets.map((item) => item._id));
      onSelectTarget(allIds);
    } else {
      onSelectTarget(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedTargetIds);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    onSelectTarget(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">
          {t('copyRecipe.step2') || 'Copy To'}
        </h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('copyRecipe.search') || 'Search:'}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                {t('copyRecipe.menuItemName') || 'Menu Item Name'}
              </Label>
              {availableTargets.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <Label
                    htmlFor="select-all"
                    className="text-sm cursor-pointer"
                  >
                    {t('copyRecipe.selectAll') || 'Select All'}
                  </Label>
                </div>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('common.loading')}
                </div>
              ) : availableTargets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    {t('copyRecipe.noAvailableTargets') || 'No items available'}
                  </p>
                </div>
              ) : (
                availableTargets.map((menuItem: MenuItem) => (
                  <div
                    key={menuItem._id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={selectedTargetIds.has(menuItem._id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(menuItem._id, checked as boolean)
                      }
                      id={menuItem._id}
                    />
                    <Label
                      htmlFor={menuItem._id}
                      className="cursor-pointer flex-1"
                    >
                      <span className="font-medium">
                        {menuItem.itemName[locale] || menuItem.itemName.en}
                      </span>
                      {menuItem.shortCode && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({menuItem.shortCode})
                        </span>
                      )}
                      <Badge variant="secondary" className="ml-2">
                        {t('copyRecipe.noRecipe') || 'No Recipe'}
                      </Badge>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTargetIds.size > 0 && (
        <div className="bg-muted/30 p-3 rounded-lg">
          <span className="text-sm font-medium">
            {selectedTargetIds.size}{' '}
            {t('copyRecipe.itemsSelected') || 'selected'}
          </span>
        </div>
      )}
    </div>
  );
}

// Step 3: Review and Customize Recipe Items
function Step3ReviewAndCustomize({
  selectedSourceId,
  selectedTargetIds,
  brandId,
  restaurantId,
  onComplete,
}: {
  selectedSourceId: string;
  selectedTargetIds: Set<string>;
  brandId?: string;
  restaurantId?: string;
  onComplete: (assignments: CopyAssignment[]) => void;
}) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());

  const { data: recipesResponse, isLoading: isLoadingRecipes } = useRecipes({
    brandId,
    restaurantId,
  });

  const { data: menuItemsResponse, isLoading: isLoadingMenu } =
    useActiveMenuItems({
      brandId,
      restaurantId,
    });

  // Use mock data if no real data - LIKE QUICK RECIPE
  const recipes: Recipe[] =
    recipesResponse?.data && recipesResponse.data.length > 0
      ? recipesResponse.data
      : MOCK_RECIPES;

  const menuItems: MenuItem[] =
    menuItemsResponse?.data && menuItemsResponse.data.length > 0
      ? menuItemsResponse.data
      : MOCK_MENU_ITEMS;

  const sourceRecipe = recipes.find(
    (r: Recipe) => r.menuItemId === selectedSourceId,
  );
  const sourceMenuItem = menuItems.find(
    (m: MenuItem) => m._id === selectedSourceId,
  );
  const targetMenuItems = menuItems.filter((m: MenuItem) =>
    selectedTargetIds.has(m._id),
  );

  useEffect(() => {
    if (sourceRecipe?.recipeItems) {
      const allItemIds = new Set(
        sourceRecipe.recipeItems.map((item) => item.itemId),
      );
      setSelectedItems(allItemIds);

      const initialQuantities = new Map();
      sourceRecipe.recipeItems.forEach((item) => {
        initialQuantities.set(item.itemId, item.quantity);
      });
      setQuantities(initialQuantities);
    }
  }, [sourceRecipe]);

  const handleSelectAll = (checked: boolean) => {
    if (sourceRecipe?.recipeItems) {
      if (checked) {
        const allIds = new Set(
          sourceRecipe.recipeItems.map((item) => item.itemId),
        );
        setSelectedItems(allIds);
      } else {
        setSelectedItems(new Set());
      }
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleQuantityChange = (itemId: string, quantity: string) => {
    const numValue = parseFloat(quantity);
    const newQuantities = new Map(quantities);
    if (!isNaN(numValue) && numValue > 0) {
      newQuantities.set(itemId, numValue);
    } else {
      newQuantities.delete(itemId);
    }
    setQuantities(newQuantities);
  };

  const handleSubmit = () => {
    if (selectedItems.size === 0) {
      toast.error(
        t('copyRecipe.selectAtLeastOneItem') || 'Select at least one item',
      );
      return;
    }

    const recipeItems: RecipeItem[] = [];
    selectedItems.forEach((itemId) => {
      const quantity = quantities.get(itemId);
      if (quantity && quantity > 0) {
        recipeItems.push({
          itemId,
          quantity,
        });
      }
    });

    const assignments: CopyAssignment[] = [];
    targetMenuItems.forEach((targetItem) => {
      assignments.push({
        fromMenuItemId: selectedSourceId,
        toMenuItemId: targetItem._id,
        recipeItems: [...recipeItems],
      });
    });

    onComplete(assignments);
  };

  const isAllSelected =
    sourceRecipe?.recipeItems?.every((item) =>
      selectedItems.has(item.itemId),
    ) ?? false;
  const isLoading = isLoadingRecipes || isLoadingMenu;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (!sourceRecipe) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {t('copyRecipe.recipeNotFound') || 'Recipe not found'}
        </h3>
        <p className="text-muted-foreground">
          {t('copyRecipe.recipeNotFoundDesc') || 'Selected item has no recipe'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">
          {t('copyRecipe.step3') || 'Review & Customize'}
        </h3>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('copyRecipe.from') || 'From:'}
              </span>
              <span className="font-medium">
                {sourceMenuItem?.itemName[locale] ||
                  sourceMenuItem?.itemName.en}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('copyRecipe.to') || 'To:'}
              </span>
              <span className="font-medium">
                {targetMenuItems.length} {t('copyRecipe.items') || 'items'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {t('copyRecipe.recipeFor') || 'Recipe For'}{' '}
              {sourceMenuItem?.itemName[locale] || sourceMenuItem?.itemName.en}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                id="select-all-items"
              />
              <Label
                htmlFor="select-all-items"
                className="text-sm cursor-pointer"
              >
                {t('copyRecipe.selectAll') || 'Select All'}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>{t('copyRecipe.name') || 'Name'}</TableHead>
                <TableHead>{t('copyRecipe.quantity') || 'Quantity'}</TableHead>
                <TableHead>{t('copyRecipe.unit') || 'Unit'}</TableHead>
                <TableHead>{t('copyRecipe.area') || 'Area'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourceRecipe.recipeItems?.map(
                (item: RecipeItem, index: number) => {
                  const rawMaterial = MOCK_RAW_MATERIALS.find(
                    (r) => r._id === item.itemId,
                  );
                  return (
                    <TableRow key={item.itemId || index}>
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedItems.has(item.itemId)}
                          onCheckedChange={(checked) =>
                            handleItemSelect(item.itemId, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {rawMaterial?.name || item.itemId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={quantities.get(item.itemId)?.toString() || ''}
                          onChange={(e) =>
                            handleQuantityChange(item.itemId, e.target.value)
                          }
                          className="w-24 h-8"
                          disabled={!selectedItems.has(item.itemId)}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {rawMaterial?.baseUnit || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">-</span>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          {t('copyRecipe.copyRecipe') || 'Copy Recipe'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Main Copy Recipe Modal
export function CopyRecipeModal({
  isOpen,
  onClose,
  brandId,
  restaurantId,
}: CopyRecipeModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(1);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedTargetIds, setSelectedTargetIds] = useState<Set<string>>(
    new Set(),
  );

  const handleSourceSelect = (id: string) => {
    setSelectedSourceId((prev: string) => (prev === id ? '' : id));
  };

  const handleTargetSelect = (ids: Set<string>) => {
    setSelectedTargetIds(ids);
  };

  const handleStep2Complete = () => {
    if (selectedTargetIds.size === 0) {
      toast.error(
        t('copyRecipe.selectAtLeastOneTarget') || 'Select at least one item',
      );
      return;
    }
    setStep(3);
  };

  const handleStep3Complete = (assignments: CopyAssignment[]) => {
    console.log('Copying recipes:', assignments);
    toast.success(t('copyRecipe.success') || 'Recipe copied successfully');
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSourceId('');
    setSelectedTargetIds(new Set());
    onClose();
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && !selectedSourceId) {
      toast.error(
        t('copyRecipe.selectSourceFirst') || 'Please select a recipe',
      );
      return;
    }
    if (step === 1) {
      setStep(2);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            {t('copyRecipe.title') || 'Copy Recipe'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <Step1SelectSourceRecipe
            onSelect={handleSourceSelect}
            selectedSourceId={selectedSourceId}
            brandId={brandId}
            restaurantId={restaurantId}
          />
        ) : step === 2 ? (
          <Step2SelectTargetItems
            selectedSourceId={selectedSourceId}
            selectedTargetIds={selectedTargetIds}
            onSelectTarget={handleTargetSelect}
            brandId={brandId}
            restaurantId={restaurantId}
          />
        ) : (
          <Step3ReviewAndCustomize
            selectedSourceId={selectedSourceId}
            selectedTargetIds={selectedTargetIds}
            brandId={brandId}
            restaurantId={restaurantId}
            onComplete={handleStep3Complete}
          />
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          {step > 1 && (
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
          {step === 2 && (
            <Button onClick={handleStep2Complete} className="ml-auto">
              {t('common.next') || 'Next'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
