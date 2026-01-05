'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { MealTimeReportFilters } from '@/components/reports/report-filters/meal-time-filter';
import { Button } from '@/components/ui/button';
import {
  FileText,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ReportQueryParams, ReportGenerationStatus } from '@/types/report.type';
import { MealTimeReportDetailsModal } from '@/components/reports/meal-time-reports/meal-time-modal';
import { MealTimeConfigModal } from '@/components/reports/meal-time-reports/meal-time-report-config';
import {
  MealTimeReport,
  MealTimeReportType,
  MealTimeReportQueryParams,
} from '@/types/meal-time-report.type';
import { toast } from 'sonner';
import { GeneratedReportsTable } from '@/components/reports/meal-time-reports/generate-meal-report-table';
import { MealTimeDataTable } from '@/components/reports/meal-time-reports/meal-time-data-table';
import { useMealTimeReport } from '@/services/api/reports/meal-time-frame/meal-time-report.query';

export default function MealTimeReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();

    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  // State for the filters that are actually applied (submitted)
  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MealTimeReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const queryParams = useMemo<MealTimeReportQueryParams>(() => {
    // Use submittedFilters for the query
    const activeFilters = submittedFilters || {};
    return {
      from: activeFilters.from,
      to: activeFilters.to,
      brandId: Array.isArray(activeFilters.brandIds)
        ? activeFilters.brandIds[0]
        : undefined,
      restaurantId: Array.isArray(activeFilters.restaurantIds)
        ? activeFilters.restaurantIds[0]
        : undefined,
      categoryId: Array.isArray(activeFilters.categoryIds)
        ? activeFilters.categoryIds[0]
        : undefined,
      menuId: Array.isArray(activeFilters.menuIds)
        ? activeFilters.menuIds[0]
        : undefined,
    };
  }, [submittedFilters]);

  // Fetch only when submittedFilters is set (and has required dates)
  const { data: reportData, isLoading } = useMealTimeReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null); // Clear submitted filters too
  }, []);

  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
  }, [filters]);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedReport(null);
  }, []);

  const handleConfigureMealTimes = useCallback(() => {
    setIsConfigModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    toast.info(t('reports.mealTime.refreshingReport'));
  }, []);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.mealTimeReports')}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.mealTime.description')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <MealTimeReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Meal Time Data Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.mealTime.mealTimeReport')}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigureMealTimes}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {t('reports.mealTime.configureMealTimes')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading...
              </div>
            ) : !reportData?.data?.report ||
              reportData.data.report.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.mealTime.noData')}
              </div>
            ) : (
              <MealTimeDataTable data={reportData.data.report} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meal Time Configuration Modal */}
      <MealTimeConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        brandId={filters.brandIds?.[0]}
      />

      {/* Report Details Modal */}
      <MealTimeReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </Layout>
  );
}
