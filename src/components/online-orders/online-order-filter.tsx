'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FilterX,
  Calendar,
  Utensils,
  ChevronDown,
  X,
  Search,
  Hash,
  Package,
  Check,
} from 'lucide-react';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Platform {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface OrderFilterParams {
  from?: string;
  to?: string;
  restaurantIds?: string[];
  search?: string;
  externalOrderId?: string;
  platform?: string;
  orderLater?: boolean;
  [key: string]: unknown;
}

interface LocalChanges {
  fromDatetime?: string;
  toDatetime?: string;
  restaurantIds?: string[];
  search?: string;
  externalOrderId?: string;
  platform?: string;
  orderLater?: boolean;
}

interface OrderFiltersProps {
  filters: OrderFilterParams;
  onFilterChange: (filters: OrderFilterParams) => void;
  onClearFilters: () => void;
  onSubmit?: () => void;
  platforms?: Platform[];
}

export function OrderFilters({
  filters = {},
  onFilterChange,
  onClearFilters,
  onSubmit,
  platforms = [],
}: OrderFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRestaurants, setShowRestaurants] = useState(false);

  const [localChanges, setLocalChanges] = useState<LocalChanges>({});

  // Fetch restaurants
  const { data: restaurantsData } = useActiveRestaurants();
  const restaurants = restaurantsData?.data || [];
  const restaurantOptions = restaurants.map((r) => ({
    label: r.name[locale] || r.name.en,
    value: r._id!,
  }));

  // Get selected restaurants count for display
  const selectedRestaurantsCount = filters?.restaurantIds?.length || 0;

  // Format datetime for display
  const formatDatetimeForDisplay = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy HH:mm');
    } catch (error) {
      return null;
    }
  };

  // Format ISO string to datetime-local input value
  const isoToDatetimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = parseISO(isoString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      return '';
    }
  };

  // Check if any advanced filters are active
  const hasAdvancedFilters =
    (filters?.search && filters.search !== '') ||
    (filters?.externalOrderId && filters.externalOrderId !== '') ||
    (filters?.platform && filters.platform !== '') ||
    filters?.orderLater;

  // Initialize local changes from current filters
  useEffect(() => {
    const changes: LocalChanges = {};

    // Date filters
    changes.fromDatetime = isoToDatetimeLocal(filters?.from);
    changes.toDatetime = isoToDatetimeLocal(filters?.to);

    // Other filters
    changes.restaurantIds = filters?.restaurantIds || [];
    changes.search = filters?.search || '';
    changes.externalOrderId = filters?.externalOrderId || '';
    changes.platform = filters?.platform || '';
    changes.orderLater = filters?.orderLater || false;

    setLocalChanges(changes);
  }, [filters]);

  // Check if any filters have been selected in local state
  const hasLocalChanges = () => {
    return (
      (localChanges.fromDatetime && localChanges.fromDatetime !== '') ||
      (localChanges.toDatetime && localChanges.toDatetime !== '') ||
      (localChanges.restaurantIds && localChanges.restaurantIds.length > 0) ||
      (localChanges.search && localChanges.search !== '') ||
      (localChanges.externalOrderId && localChanges.externalOrderId !== '') ||
      (localChanges.platform &&
        localChanges.platform !== '' &&
        localChanges.platform !== 'all') ||
      localChanges.orderLater
    );
  };

  const handleOpenDatePicker = () => {
    setShowDatePicker(true);
    setShowRestaurants(false);
  };

  const handleOpenRestaurants = () => {
    setShowRestaurants(true);
    setShowDatePicker(false);
  };

  // Clear individual filters (just from local state)
  const clearDateFilter = () => {
    setLocalChanges((prev) => ({
      ...prev,
      fromDatetime: '',
      toDatetime: '',
    }));
  };

  const clearRestaurantsFilter = () => {
    setLocalChanges((prev) => ({
      ...prev,
      restaurantIds: [],
    }));
  };

  const clearAdvancedFilters = () => {
    setLocalChanges((prev) => ({
      ...prev,
      search: '',
      externalOrderId: '',
      platform: '',
      orderLater: false,
    }));
  };

  // Apply ALL filters at once (main Apply button)
  const handleApplyAllFilters = () => {
    const newFilters: OrderFilterParams = {};

    // Date filters
    if (localChanges.fromDatetime) {
      const fromDate = new Date(localChanges.fromDatetime);
      newFilters.from = fromDate.toISOString();
    }

    if (localChanges.toDatetime) {
      const toDate = new Date(localChanges.toDatetime);
      newFilters.to = toDate.toISOString();
    }

    // Restaurant filter
    if (localChanges.restaurantIds && localChanges.restaurantIds.length > 0) {
      newFilters.restaurantIds = localChanges.restaurantIds;
    }

    // Advanced filters
    if (localChanges.search) {
      newFilters.search = localChanges.search;
    }
    if (localChanges.externalOrderId) {
      newFilters.externalOrderId = localChanges.externalOrderId;
    }
    if (localChanges.platform && localChanges.platform !== 'all') {
      newFilters.platform = localChanges.platform;
    }
    if (localChanges.orderLater) {
      newFilters.orderLater = localChanges.orderLater;
    }

    // Apply all changes
    onFilterChange(newFilters);

    // Close all dropdowns
    setShowDatePicker(false);
    setShowRestaurants(false);

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit();
    }
  };

  // Cancel changes in dropdown (just close, don't apply)
  const cancelDateFilter = () => {
    setShowDatePicker(false);
  };

  const cancelRestaurantsFilter = () => {
    setShowRestaurants(false);
  };

  // Clear ALL filters
  const handleClearAllFilters = () => {
    // Reset local state
    setLocalChanges({
      fromDatetime: '',
      toDatetime: '',
      restaurantIds: [],
      search: '',
      externalOrderId: '',
      platform: '',
      orderLater: false,
    });

    // Close all dropdowns
    setShowDatePicker(false);
    setShowRestaurants(false);

    // Call parent's clear function
    onClearFilters();
  };

  // Check if Apply button should be enabled
  const isApplyEnabled = hasLocalChanges();

  return (
    <Card>
      <CardContent>
        {/* Main Filter Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Button & Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 text-sm gap-1.5 pr-2',
                (filters?.from || filters?.to) && 'border-primary bg-primary/5',
              )}
              onClick={handleOpenDatePicker}
            >
              <Calendar className="h-3.5 w-3.5" />
              {filters?.from && filters?.to ? (
                <span className="max-w-[180px] truncate">
                  {formatDatetimeForDisplay(filters.from)} -{' '}
                  {formatDatetimeForDisplay(filters.to)}
                </span>
              ) : (
                <span>Date & Time Range</span>
              )}
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 ml-1 transition-transform',
                  showDatePicker && 'rotate-180',
                )}
              />
              {(filters?.from || filters?.to) && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  ✓
                </Badge>
              )}
            </Button>

            {/* Datetime Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-background border rounded-md shadow-lg p-3 w-80">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">
                    Select Date & Time Range
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateFilter}
                    className="h-6 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* From Datetime */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <label className="text-xs font-medium">From</label>
                    </div>
                    <div>
                      <input
                        type="datetime-local"
                        value={localChanges.fromDatetime || ''}
                        onChange={(e) =>
                          setLocalChanges((prev) => ({
                            ...prev,
                            fromDatetime: e.target.value,
                          }))
                        }
                        className="w-full h-8 px-2 text-sm border rounded-md"
                      />
                    </div>
                  </div>

                  {/* To Datetime */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <label className="text-xs font-medium">To</label>
                    </div>
                    <div>
                      <input
                        type="datetime-local"
                        value={localChanges.toDatetime || ''}
                        onChange={(e) =>
                          setLocalChanges((prev) => ({
                            ...prev,
                            toDatetime: e.target.value,
                          }))
                        }
                        className="w-full h-8 px-2 text-sm border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Actions - Just Done button to close */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelDateFilter}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={cancelDateFilter}
                      className="h-7 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Restaurants Button & Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 text-sm gap-1.5 pr-2',
                selectedRestaurantsCount > 0 && 'border-primary bg-primary/5',
              )}
              onClick={handleOpenRestaurants}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Restaurants</span>
              {selectedRestaurantsCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {selectedRestaurantsCount}
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 ml-1 transition-transform',
                  showRestaurants && 'rotate-180',
                )}
              />
            </Button>

            {/* Restaurants Dropdown */}
            {showRestaurants && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-background border rounded-md shadow-lg w-80">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">Select Restaurants</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRestaurantsFilter}
                      className="h-6 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    <MultiSelectDropdown
                      options={restaurantOptions}
                      value={localChanges.restaurantIds || []}
                      onChange={(value) =>
                        setLocalChanges((prev) => ({
                          ...prev,
                          restaurantIds: value,
                        }))
                      }
                      placeholder="Search restaurants..."
                      className="text-sm h-8"
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelRestaurantsFilter}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={cancelRestaurantsFilter}
                      className="h-7 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* order online filters */}
          <div className="flex items-center gap-2">
            {/* External Order ID Input */}
            <div className="relative">
              <div className="flex items-center gap-1">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Order ID"
                  value={localChanges.externalOrderId || ''}
                  onChange={(e) =>
                    setLocalChanges((prev) => ({
                      ...prev,
                      externalOrderId: e.target.value,
                    }))
                  }
                  className="h-8 w-32 text-sm"
                />
                {localChanges.externalOrderId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setLocalChanges((prev) => ({
                        ...prev,
                        externalOrderId: '',
                      }))
                    }
                    className="h-6 w-6 p-0 absolute right-1 top-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Platform Select */}
            <div className="w-32">
              <Select
                value={localChanges.platform || 'all'}
                onValueChange={(value) =>
                  setLocalChanges((prev) => ({
                    ...prev,
                    platform: value === 'all' ? '' : value,
                  }))
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Platform" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms
                    .filter((platform) => platform.isActive)
                    .map((platform) => (
                      <SelectItem key={platform._id} value={platform.code}>
                        {platform.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Apply All Button - Enabled only when filters are selected */}
            <Button
              onClick={handleApplyAllFilters}
              size="sm"
              className="h-8"
              disabled={!isApplyEnabled}
            >
              {t('common.apply') || 'Apply'}
            </Button>

            {/* Clear All Filters Button - ALWAYS VISIBLE */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAllFilters}
              className="h-8 gap-1.5"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>{t('common.clear') || 'Clear'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
