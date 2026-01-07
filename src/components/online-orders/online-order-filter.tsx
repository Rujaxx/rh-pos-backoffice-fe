'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AdditionalFilters {
  externalOrderId: string;
  platform: string;
  orderLater: boolean;
  search: string;
}

interface Platform {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface OrderFiltersProps {
  additionalFilters: AdditionalFilters;
  onAdditionalFilterChange: (
    key: keyof AdditionalFilters,
    value: string | boolean,
  ) => void;
  platforms?: Platform[];
  isLoadingPlatforms?: boolean;
}

export function OrderFilters({
  additionalFilters,
  onAdditionalFilterChange,
  platforms = [],
  isLoadingPlatforms = false,
}: OrderFiltersProps) {
  const { t } = useTranslation();

  const handlePlatformChange = (value: string) => {
    onAdditionalFilterChange('platform', value === 'all' ? '' : value);
  };

  const getPlatformDisplayName = (code: string) => {
    const platform = platforms.find((p) => p.code === code);
    return platform?.name || code;
  };

  const getCurrentPlatformValue = () => {
    if (additionalFilters.platform === '') return 'all';
    return additionalFilters.platform;
  };

  const getCurrentPlatformLabel = () => {
    if (additionalFilters.platform === '') {
      return t('orders.allPlatforms') || 'All Platforms';
    }
    return getPlatformDisplayName(additionalFilters.platform);
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div className="space-y-2">
        <Label>{t('orders.search') || 'Search'}</Label>
        <Input
          type="text"
          placeholder={
            t('orders.searchPlaceholder') ||
            'Search by order, customer, phone...'
          }
          value={additionalFilters.search}
          onChange={(e) => onAdditionalFilterChange('search', e.target.value)}
        />
      </div>

      {/* External Order ID */}
      <div className="space-y-2">
        <Label>{t('orders.externalOrderId') || 'External Order ID'}</Label>
        <Input
          type="text"
          placeholder={t('orders.enterExternalId') || 'Enter external order ID'}
          value={additionalFilters.externalOrderId}
          onChange={(e) =>
            onAdditionalFilterChange('externalOrderId', e.target.value)
          }
        />
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <Label>{t('orders.platform') || 'Platform'}</Label>
        <Select
          value={getCurrentPlatformValue()}
          onValueChange={handlePlatformChange}
        >
          <SelectTrigger>
            <SelectValue>{getCurrentPlatformLabel()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('orders.allPlatforms') || 'All Platforms'}
            </SelectItem>
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

      {/* Order Later Checkbox */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="orderLater"
            checked={additionalFilters.orderLater}
            onCheckedChange={(checked) =>
              onAdditionalFilterChange('orderLater', checked)
            }
          />
          <label
            htmlFor="orderLater"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {t('orders.orderLater') || 'Order Later'}
          </label>
        </div>
      </div>
    </div>
  );
}
