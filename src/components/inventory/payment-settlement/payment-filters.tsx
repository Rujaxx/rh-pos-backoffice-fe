'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Store, ChefHat } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { FromType } from '@/types/payment-settlement.type';

interface PaymentFiltersProps {
  filters: {
    fromType: FromType;
    selectedVendorId?: string;
    selectedRestaurantId?: string;
    selectedKitchenId?: string;
    startDate: string;
    endDate: string;
  };
  vendors: Array<{ _id: string; name: string }>;
  restaurants: Array<{ _id: string; name: string }>;
  kitchens: Array<{ _id: string; name: string }>;
  onFromTypeChange: (type: FromType) => void;
  onVendorChange: (value: string) => void;
  onRestaurantChange: (value: string) => void;
  onKitchenChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
  searchDisabled: boolean;
}

export function PaymentFilters({
  filters,
  vendors,
  restaurants,
  kitchens,
  onFromTypeChange,
  onVendorChange,
  onRestaurantChange,
  onKitchenChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  searchDisabled,
}: PaymentFiltersProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-2 items-end">
          {/* From Dropdown */}
          <div className="col-span-2">
            <div className="text-xs text-muted-foreground mb-1">
              {t('paymentSettlement.filters.from')}
            </div>
            <Select
              value={filters.fromType}
              onValueChange={(value: FromType) => onFromTypeChange(value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('paymentSettlement.filters.selectType')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendor">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('paymentSettlement.filters.vendor')}
                  </div>
                </SelectItem>
                <SelectItem value="restaurant">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {t('paymentSettlement.filters.restaurant')}
                  </div>
                </SelectItem>
                <SelectItem value="kitchen">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    {t('paymentSettlement.filters.kitchen')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Second Dropdown */}
          <div className="col-span-3">
            <div className="text-xs text-muted-foreground mb-1">
              {filters.fromType === 'vendor' &&
                t('paymentSettlement.filters.vendor')}
              {filters.fromType === 'restaurant' &&
                t('paymentSettlement.filters.restaurant')}
              {filters.fromType === 'kitchen' &&
                t('paymentSettlement.filters.kitchen')}
            </div>

            {filters.fromType === 'vendor' && (
              <Select
                value={filters.selectedVendorId}
                onValueChange={onVendorChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('paymentSettlement.filters.selectVendor')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filters.fromType === 'restaurant' && (
              <Select
                value={filters.selectedRestaurantId}
                onValueChange={onRestaurantChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'paymentSettlement.filters.selectRestaurant',
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filters.fromType === 'kitchen' && (
              <Select
                value={filters.selectedKitchenId}
                onValueChange={onKitchenChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('paymentSettlement.filters.selectKitchen')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {kitchens.map((kitchen) => (
                    <SelectItem key={kitchen._id} value={kitchen._id}>
                      {kitchen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Start Date */}
          <div className="col-span-2">
            <div className="text-xs text-muted-foreground mb-1">
              {t('paymentSettlement.filters.startDate')}
            </div>
            <Input
              value={filters.startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              placeholder={t('paymentSettlement.filters.datePlaceholder')}
              className="h-9"
            />
          </div>

          {/* End Date */}
          <div className="col-span-2">
            <div className="text-xs text-muted-foreground mb-1">
              {t('paymentSettlement.filters.endDate')}
            </div>
            <Input
              value={filters.endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              placeholder={t('paymentSettlement.filters.datePlaceholder')}
              className="h-9"
            />
          </div>

          {/* Search Button */}
          <div className="col-span-1">
            <Button
              className="w-full h-9"
              onClick={onSearch}
              disabled={searchDisabled}
            >
              {t('paymentSettlement.filters.search')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
