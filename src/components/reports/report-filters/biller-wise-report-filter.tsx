'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useActiveUsers } from '@/services/api/users/users.queries';
import { ReportQueryParams } from '@/types/report.type';

interface BillerWiseReportFiltersProps {
  filters: ReportQueryParams;
  onFilterChange: (filters: ReportQueryParams) => void;
  onClearFilters?: () => void;
}

export function BillerWiseReportFilters({
  filters,
  onFilterChange,
}: BillerWiseReportFiltersProps) {
  const { t } = useTranslation();

  // Fetch active users (billers)
  const { data: usersData } = useActiveUsers();
  const users = usersData?.data || [];

  const handleUserChange = (value: string) => {
    if (value === 'all') {
      // Remove userId from filters if 'All Billers' is selected
      const { userId, ...rest } = filters;
      onFilterChange(rest);
    } else {
      onFilterChange({ ...filters, userId: value });
    }
  };

  // Ensure value is always a string
  const selectValue = filters.userId ? String(filters.userId) : 'all';

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* User (Biller) Filter */}
      <div className="space-y-2">
        <Label className="text-foreground">
          {t('reports.billerWise.selectBiller') || 'Select Biller'}
        </Label>
        <Select value={selectValue} onValueChange={handleUserChange}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                t('reports.billerWise.selectBillerPlaceholder') || 'All Billers'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('reports.billerWise.allBillers') || 'All Billers'}
            </SelectItem>
            {users.map((user) => (
              <SelectItem key={user._id} value={String(user._id)}>
                {user.name || user.email || t('common.unknown') || 'Unknown'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
