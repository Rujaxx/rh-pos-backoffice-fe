'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent } from '@/components/ui/card';
import { useReports, useUpdateBill } from '@/services/api/reports';
import {
  ReportQueryParams,
  BillStatus,
  PaymentStatus,
  Bill,
} from '@/types/report.type';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  XCircle,
  FileText,
} from 'lucide-react';
import { ReportFilters } from '@/components/reports/report-filters';
import { BillsTable } from '@/components/reports/bills-table';

export default function SalesReportsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ReportQueryParams>({});
  const [loadingBills, setLoadingBills] = useState<Set<string>>(new Set());

  // Fetch reports
  const { data: reportsData, isLoading } = useReports(filters);
  const reportData = reportsData?.data;
  const bills = reportData?.bills || [];

  const updateBillMutation = useUpdateBill();

  // Filter handlers
  const handleFilterChange = (newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Handle bill status change - IMMEDIATE UPDATE
  const handleBillStatusChange = async (
    billId: string,
    newStatus: BillStatus,
  ) => {
    setLoadingBills((prev) => new Set(prev).add(billId));

    try {
      await updateBillMutation.mutateAsync({
        billId,
        data: { status: newStatus },
      });
    } catch (error) {
      console.error('Failed to update bill status:', error);
    } finally {
      setLoadingBills((prev) => {
        const next = new Set(prev);
        next.delete(billId);
        return next;
      });
    }
  };

  // Handle payment status change - IMMEDIATE UPDATE
  const handlePaymentStatusChange = async (
    billId: string,
    newStatus: PaymentStatus,
  ) => {
    setLoadingBills((prev) => new Set(prev).add(billId));

    try {
      await updateBillMutation.mutateAsync({
        billId,
        data: { paymentStatus: newStatus },
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    } finally {
      setLoadingBills((prev) => {
        const next = new Set(prev);
        next.delete(billId);
        return next;
      });
    }
  };

  // Handle view details
  const handleViewDetails = (bill: Bill) => {
    // TODO: Implement bill details modal
    console.log('View bill details:', bill);
  };

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>{t('reports.salesReports.title')}</span>
            </h2>
            <p className="text-muted-foreground">
              {t('reports.salesReports.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Summary Cards */}
        {reportData?.summary && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalRevenue')}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(reportData.summary.totalRevenue)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalTax')}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(reportData.summary.totalTax)}
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalBills')}
                    </p>
                    <p className="text-2xl font-bold">
                      {reportData.summary.totalBills}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalDiscount')}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(reportData.summary.totalDiscount)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.cancelledBills')}
                    </p>
                    <p className="text-2xl font-bold">
                      {reportData.summary.cancelledBills}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bills Table */}
        <BillsTable
          bills={bills}
          isLoading={isLoading}
          onBillStatusChange={handleBillStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onViewDetails={handleViewDetails}
          loadingBills={loadingBills}
        />
      </div>
    </Layout>
  );
}
