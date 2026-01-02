'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportQueryParams } from '@/types/report.type';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';

export interface TodaysReportFiltersProps {
  filters: ReportQueryParams & {
    showSalesSummary: boolean;
    showZReportSummary: boolean;
    showOrderTypeSummary: boolean;
    showPaymentTypeSummary: boolean;
    showDiscountSummary: boolean;
    showExpenseSummary: boolean;
    showBillSummary: boolean;
    showDeliveryBoySummary: boolean;
    showWaiterSummary: boolean;
    showProductGroupSummary: boolean;
    showKitchenDepartmentSummary: boolean;
    showCategorySummary: boolean;
    showSoldItemsSummary: boolean;
    showCancelItemsSummary: boolean;
    showWalletSummary: boolean;
    showDuePaymentReceivedSummary: boolean;
    showDuePaymentReceivableSummary: boolean;
    showPaymentVarianceSummary: boolean;
    showCurrencyDenominationsSummary: boolean;
    showOrderSourceSummary: boolean;
  };
  expandedSections: boolean;
  onFilterChange: (filters: ReportQueryParams) => void;
  onToggleExpandedSections: () => void;
  onToggleSection: (sectionKey: string) => void;
  onToggleAllSections: (enabled: boolean) => void;
}

export function TodaysReportFilters({
  filters,
  onFilterChange,
  expandedSections,
  onToggleExpandedSections,
  onToggleSection,
  onToggleAllSections,
}: TodaysReportFiltersProps) {
  const sectionToggles = [
    { key: 'showSalesSummary', label: 'Sales Summary / Z Report Summary' },
    { key: 'showZReportSummary', label: 'Z Report Summary' },
    { key: 'showOrderTypeSummary', label: 'Order Type Summary' },
    { key: 'showPaymentTypeSummary', label: 'Payment Type Summary' },
    { key: 'showDiscountSummary', label: 'Discount Summary' },
    { key: 'showExpenseSummary', label: 'Expense Summary' },
    { key: 'showBillSummary', label: 'Bill Summary' },
    { key: 'showDeliveryBoySummary', label: 'Delivery Boy Summary' },
    { key: 'showWaiterSummary', label: 'Waiter Summary' },
    { key: 'showProductGroupSummary', label: 'Product Group Summary' },
    {
      key: 'showKitchenDepartmentSummary',
      label: 'Kitchen Department Summary',
    },
    { key: 'showCategorySummary', label: 'Category Summary' },
    { key: 'showSoldItemsSummary', label: 'Sold Items Summary' },
    { key: 'showCancelItemsSummary', label: 'Cancel Items Summary' },
    { key: 'showWalletSummary', label: 'Wallet Summary' },
    {
      key: 'showDuePaymentReceivedSummary',
      label: 'Due Payment Received Summary',
    },
    {
      key: 'showDuePaymentReceivableSummary',
      label: 'Due Payment Receivable Summary',
    },
    { key: 'showPaymentVarianceSummary', label: 'Payment Variance Summary' },
    {
      key: 'showCurrencyDenominationsSummary',
      label: 'Currency Denominations Summary',
    },
    { key: 'showOrderSourceSummary', label: 'Order Source Summary' },
  ];
  const { t } = useTranslation();
  const { locale } = useI18n();
  const { data: orderTypesData } = useOrderTypes();
  const orderTypes = orderTypesData?.data || [];
  const orderTypeOptions = orderTypes.map((orderType) => ({
    label: orderType.name[locale] || orderType.name.en,
    value: orderType._id!,
  }));

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const enabledSectionsCount = sectionToggles.filter(
    (section) => filters[section.key as keyof typeof filters] as boolean,
  ).length;

  return (
    <>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Order Types */}
        <div className="space-y-2">
          <Label>{t('orderTypes.title') || 'Order Types'}</Label>
          <MultiSelectDropdown
            options={orderTypeOptions}
            value={filters.orderTypeIds || []}
            onChange={(value) => handleMultiSelectChange('orderTypeIds', value)}
            placeholder={t('common.selectOrderTypes') || 'Select Order Types'}
          />
        </div>
      </div>
      {/* Section Toggles Card */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium">Report Sections</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleAllSections(true)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleAllSections(false)}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpandedSections}
                className="h-7 w-7 p-0"
              >
                {expandedSections ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {expandedSections ? 'Collapse sections' : 'Expand sections'}
                </span>
              </Button>
            </div>
          </div>

          {/* Show sections when expanded */}
          {expandedSections && (
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
              )}
            >
              {sectionToggles.map((section) => {
                const isEnabled = filters[
                  section.key as keyof typeof filters
                ] as boolean;

                return (
                  <div
                    key={section.key}
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-lg border transition-colors',
                      'bg-white dark:bg-gray-800',
                      isEnabled
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:bg-muted/30',
                    )}
                  >
                    <Checkbox
                      id={section.key}
                      checked={isEnabled}
                      onCheckedChange={() => onToggleSection(section.key)}
                      className={cn(
                        isEnabled && 'border-primary bg-primary text-white',
                      )}
                    />
                    <Label
                      htmlFor={section.key}
                      className={cn(
                        'text-sm cursor-pointer flex-1 truncate',
                        isEnabled
                          ? 'text-primary font-medium'
                          : 'text-foreground',
                      )}
                    >
                      {section.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show message when collapsed and sections are enabled */}
          {!expandedSections && enabledSectionsCount > 0 && (
            <div className="text-xs text-muted-foreground pt-2">
              <span className="font-medium">
                {enabledSectionsCount} sections
              </span>{' '}
              are enabled. Click the expand button to view/edit.
            </div>
          )}

          {/* Show message when collapsed and no sections are enabled */}
          {!expandedSections && enabledSectionsCount === 0 && (
            <div className="text-xs text-muted-foreground pt-2">
              No sections enabled. Click the expand button to select sections.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
