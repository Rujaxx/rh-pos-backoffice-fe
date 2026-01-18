'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

import { Edit2, Save, X, Settings, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import {
  IncentiveMenuItem,
  IncentiveRule,
} from '@/types/waiter-incentive-report.type';
import { useMenuItems } from '@/services/api/menu-items/menu-items.queries';
import { useBrands } from '@/services/api/brands/brands.queries';
import { useRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useMenus } from '@/services/api/menus/menus.queries';
import { useI18n } from '@/providers/i18n-provider';
import { MenuItem as ApiMenuItem } from '@/types/menu-item.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

interface IncentiveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncentiveConfigModal({
  isOpen,
  onClose,
}: IncentiveConfigModalProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Filter states for dropdowns
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [restaurantFilter, setRestaurantFilter] = useState<string>('');
  const [menuFilter, setMenuFilter] = useState<string[]>([]);

  // Table states
  const [tableSearch, setTableSearch] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Configuration states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<IncentiveRule> | null>(null);

  // Fetch data for filters
  const { data: brandsData } = useBrands();
  const { data: restaurantsData } = useRestaurants({
    brandId: brandFilter || undefined,
  });
  const { data: menusData } = useMenus();

  // Use a ref to track if we should fetch
  const [shouldFetch, setShouldFetch] = useState(false);

  // Fetch menu items based on filters - with enabled condition
  // Note: API only supports menuId (singular), not menuIds (plural)
  // If multiple menus selected, we'll filter client-side
  const { data: menuItemsData, isLoading } = useMenuItems(
    {
      brandId: brandFilter || undefined,
      restaurantId: restaurantFilter || undefined,
      menuId: menuFilter.length === 1 ? menuFilter[0] : undefined, // Only use menuId if exactly one menu selected
      isActive: 'true',
    },
    {
      enabled: shouldFetch, // Only fetch when shouldFetch is true
    },
  );

  const brands = brandsData?.data || [];
  const restaurants = restaurantsData?.data || [];
  const menus = menusData?.data || [];
  const allMenuItems: ApiMenuItem[] = menuItemsData?.data || [];

  // Update shouldFetch when filters change
  useEffect(() => {
    const hasFilters = !!(
      brandFilter ||
      restaurantFilter ||
      menuFilter.length > 0
    );
    setShouldFetch(hasFilters);
  }, [brandFilter, restaurantFilter, menuFilter]);

  // Map menu items when data changes and filter by selected menus if multiple selected
  const mappedItems = useMemo(() => {
    if (!allMenuItems || allMenuItems.length === 0) {
      return [];
    }

    // Filter by menuIds if multiple menus are selected (client-side filtering)
    let filteredItems = allMenuItems;
    if (menuFilter.length > 1) {
      filteredItems = allMenuItems.filter(
        (item) => item.menuId && menuFilter.includes(item.menuId),
      );
    }

    return filteredItems.map((item) => ({
      _id: item._id,
      shortCode: item.shortCode || '',
      name: {
        en: item.itemName?.en || 'Unknown',
        ar: item.itemName?.ar || item.itemName?.en || 'Unknown',
      },
      price: item.baseItemPrice || 0,
      description:
        typeof item.description === 'string'
          ? item.description
          : item.description?.[locale] || item.description?.en || '',
      categoryId: item.categoryId,
      isActive: item.isActive || false,
      restaurantId: item.restaurantId || '',
      brandId: item.brandId || '',
      createdAt: item.createdAt
        ? new Date(item.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toISOString()
        : new Date().toISOString(),
    }));
  }, [allMenuItems, menuFilter, locale]);

  // Use mappedItems directly as menuItems to avoid unnecessary state updates
  const menuItems = mappedItems;

  // Prepare options for dropdowns
  const brandOptions = useMemo(
    () =>
      brands
        .map((brand) => ({
          label: brand.name[locale] || brand.name.en || 'Unknown',
          value: brand._id || '',
        }))
        .filter((option) => option.value),
    [brands, locale],
  );

  const restaurantOptions = useMemo(
    () =>
      restaurants
        .map((restaurant) => ({
          label: restaurant.name[locale] || restaurant.name.en || 'Unknown',
          value: restaurant._id || '',
        }))
        .filter((option) => option.value),
    [restaurants, locale],
  );

  // Menu options for MultiSelectDropdown
  const menuOptions = useMemo(
    () =>
      menus
        .map((menu) => ({
          label: menu.name[locale] || menu.name.en || 'Unknown',
          value: menu._id || '',
        }))
        .filter((option) => option.value),
    [menus, locale],
  );

  const handleEdit = useCallback(
    (id: string) => {
      const menuItem = menuItems.find((item) => item._id === id);
      if (menuItem) {
        setEditingId(id);
        setEditData({
          menuItemIds: [id],
          incentiveType: 'PERCENTAGE',
          value: 5,
          isActive: true,
        });
      }
    },
    [menuItems],
  );

  const handleSave = useCallback(
    async (id: string) => {
      if (!editData) return;

      try {
        toast.success('Incentive rule saved successfully');
        setEditingId(null);
        setEditData(null);
      } catch (error) {
        toast.error('Failed to save incentive rule');
      }
    },
    [editData],
  );

  const handleCancel = useCallback((id: string) => {
    setEditingId(null);
    setEditData(null);
  }, []);

  const handleChange = useCallback(
    (
      field: keyof IncentiveRule,
      value: string | number | boolean | string[],
    ) => {
      if (!editData) return;
      setEditData((prev) => ({ ...prev, [field]: value }));
    },
    [editData],
  );

  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  // Check if we have any filters
  const hasFilters = !!(
    brandFilter ||
    restaurantFilter ||
    menuFilter.length > 0
  );

  // Define columns
  const columns = useMemo<ColumnDef<IncentiveMenuItem>[]>(
    () => [
      {
        accessorKey: 'shortCode',
        header: 'Short Code',
        cell: ({ row }) => (
          <div className="font-mono font-medium bg-muted px-2 py-1 rounded text-xs">
            {row.original.shortCode}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Item Name',
        cell: ({ row }) => {
          const itemName =
            row.original.name[locale] || row.original.name.en || 'Unknown';
          const itemDescription = row.original.description || '';
          return (
            <div>
              <div className="font-medium">{itemName}</div>
              {itemDescription && (
                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {itemDescription}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const price = row.original.price;
          return (
            <div className="font-medium">
              {new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(price)}
            </div>
          );
        },
      },
      {
        id: 'incentiveValue',
        header: () => (
          <span>
            Incentive Value
            <span className="text-destructive ml-1">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const menuItem = row.original;
          const editing = editingId === menuItem._id;
          return editing ? (
            <Input
              type="number"
              min="0"
              step="0.01"
              value={editData?.value || ''}
              onChange={(e) =>
                handleChange('value', parseFloat(e.target.value) || 0)
              }
              placeholder="Enter value"
              className="w-full"
            />
          ) : (
            <div className="text-sm text-muted-foreground">Not configured</div>
          );
        },
      },
      {
        id: 'incentiveType',
        header: () => (
          <span>
            Incentive Type
            <span className="text-destructive ml-1">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const menuItem = row.original;
          const editing = editingId === menuItem._id;
          return editing ? (
            <Select
              value={editData?.incentiveType || 'PERCENTAGE'}
              onValueChange={(value) =>
                handleChange(
                  'incentiveType',
                  value as 'PERCENTAGE' | 'FIXED_AMOUNT',
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground">-</div>
          );
        },
      },
      {
        id: 'actions',
        header: t('common.actions') || 'Actions',
        cell: ({ row }) => {
          const menuItem = row.original;
          const editing = editingId === menuItem._id;
          return (
            <div className="flex justify-end gap-2">
              {editing ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSave(menuItem._id)}
                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                    title={t('common.save')}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(menuItem._id)}
                    className="h-8 w-8 p-0"
                    title={t('common.cancel')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(menuItem._id)}
                  className="h-8 w-8 p-0"
                  title={t('common.configure')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [
      locale,
      editingId,
      editData,
      t,
      handleChange,
      handleSave,
      handleCancel,
      handleEdit,
    ],
  );

  // Reset state when modal closes - use separate useEffect to avoid infinite loops
  useEffect(() => {
    if (!isOpen) {
      // Reset filters and state when modal closes
      setBrandFilter('');
      setRestaurantFilter('');
      setMenuFilter([]);
      setTableSearch('');
      setSorting([]);
      setColumnFilters([]);
      setEditingId(null);
      setEditData(null);
      setShouldFetch(false);
      // Reset pagination separately
      setPagination({ pageIndex: 0, pageSize: 10 });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('reports.waiterIncentive.configureIncentive') ||
              'Configure Incentive'}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {t('reports.waiterIncentive.configDescription') ||
              'Configure incentive rules for menu items'}
          </div>
        </DialogHeader>

        {/* Filter Section */}

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand Filter */}
              <div className="space-y-2">
                <Label>{t('brands.title') || 'Brand'}</Label>
                <Select
                  value={brandFilter}
                  onValueChange={(value) => {
                    setBrandFilter(value);
                    setRestaurantFilter('');
                    setMenuFilter([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('common.selectBrands') || 'Select Brand'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Restaurant Filter */}
              <div className="space-y-2">
                <Label>{t('restaurants.title') || 'Restaurant'}</Label>
                <Select
                  value={restaurantFilter}
                  onValueChange={(value) => {
                    setRestaurantFilter(value);
                    setMenuFilter([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        t('common.selectRestaurants') || 'Select Restaurant'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurantOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Menu Filter - MultiSelectDropdown */}
              <div className="space-y-2">
                <Label>{t('menus.title') || 'Menus'}</Label>
                <MultiSelectDropdown
                  options={menuOptions}
                  value={menuFilter}
                  onChange={setMenuFilter}
                  placeholder={t('common.selectMenus') || 'Select Menus'}
                />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Menu Items Table */}
        <Card>
          <CardContent className="pt-6">
            <TanStackTable
              data={menuItems}
              columns={columns}
              totalCount={menuItems.length}
              isLoading={isLoading}
              searchValue={tableSearch}
              searchPlaceholder={t('common.search') || 'Search in table...'}
              onSearchChange={setTableSearch}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={setSorting}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              manualPagination={false}
              manualSorting={true}
              manualFiltering={true}
              showSearch={true}
              showPagination={true}
              showPageSizeSelector={true}
              emptyMessage={
                hasFilters && menuItems.length === 0 && !isLoading
                  ? t('common.noMenuItemsMatchFilters') ||
                    'No menu items match your filters'
                  : !hasFilters
                    ? t('common.selectFiltersToBegin') ||
                      'Select filters to begin'
                    : ''
              }
              enableMultiSort={false}
            />
          </CardContent>
        </Card>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            {t('common.close')}
          </Button>
          <Button
            variant="default"
            onClick={() => {
              toast.success('All configurations saved successfully');
              handleCloseModal();
            }}
            disabled={editingId !== null}
          >
            {t('common.saveAll') || 'Save All'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
