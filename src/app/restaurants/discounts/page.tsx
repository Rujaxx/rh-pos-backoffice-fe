'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TanStackTable } from '@/components/ui/tanstack-table';

import Layout from '@/components/common/layout';
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';

import { Percent, Plus, Filter } from 'lucide-react';

import { Discount, DiscountQueryParams } from '@/types/discount.type';
import {
  DiscountFormData,
  discountSchema,
} from '@/lib/validations/discount.validation';

import {
  useDiscountColumns,
  getSortFieldForDiscountQuery,
  getSortOrderForDiscountQuery,
} from '@/components/discounts/discount-table-columns';
import {
  useDiscount,
  useDiscounts,
} from '@/services/api/discounts/discounts.queries';
import {
  useCreateDiscount,
  useDeleteDiscount,
  useUpdateDiscount,
} from '@/services/api/discounts/discounts.mutations';
import DiscountFormContent, {
  useDiscountForm,
} from '@/components/discounts/discount-form';

export default function DiscountsPage() {
  const { t } = useTranslation();

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );

  // Build query params for API
  const queryParams = useMemo<DiscountQueryParams>(() => {
    const params: DiscountQueryParams = {
      page: pagination.pageIndex + 1, // backend is 1-based
      limit: pagination.pageSize,
      sortOrder: getSortOrderForDiscountQuery(sorting) || 'desc',
    };

    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    const sortField = getSortFieldForDiscountQuery(sorting);
    if (sortField) {
      params.sortOrder = getSortOrderForDiscountQuery(sorting) || 'desc';
    }

    if (statusFilter !== undefined) {
      params.isActive = statusFilter === 'active' ? 'true' : 'false';
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // Queries
  const {
    data: discountsResponse,
    isLoading,
    error,
  } = useDiscounts(queryParams);

  const createDiscountMutation = useCreateDiscount();
  const updateDiscountMutation = useUpdateDiscount();
  const deleteDiscountMutation = useDeleteDiscount();

  const discounts = discountsResponse?.data || [];
  const totalCount = discountsResponse?.meta?.total || 0;

  // Modals
  const {
    isOpen,
    editingItem: editingDiscount,
    openModal,
    closeModal,
  } = useModal<Discount>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch fresh item when editing
  const discountId = editingDiscount?._id;
  const shouldFetchDiscount = isOpen && !!discountId;

  const {
    data: individualDiscountResponse,
    isLoading: isLoadingIndividualDiscount,
    isFetching: isFetchingIndividualDiscount,
  } = useDiscount(discountId || '', {
    enabled: shouldFetchDiscount,
  });

  const latestDiscountData =
    individualDiscountResponse?.data || editingDiscount;

  // Form
  const { form } = useDiscountForm(latestDiscountData);

  // Stable handlers for columns
  const editHandlerRef = useRef<((item: Discount) => void) | null>(null);
  const deleteHandlerRef = useRef<((item: Discount) => void) | null>(null);

  const editHandler = useCallback((item: Discount) => {
    editHandlerRef.current?.(item);
  }, []);

  const deleteHandler = useCallback((item: Discount) => {
    deleteHandlerRef.current?.(item);
  }, []);

  const stableColumns = useDiscountColumns(editHandler, deleteHandler);

  // Wire refs
  editHandlerRef.current = (item: Discount) => {
    openModal(item);
  };

  deleteHandlerRef.current = (item: Discount) => {
    openConfirmationModal(
      async () => {
        try {
          if (!item._id) return;
          await deleteDiscountMutation.mutateAsync(item._id);
        } catch (err) {
          console.error('Failed to delete discount:', err);
        }
      },
      {
        title: t('discounts.delete.title'),
        description: t('discounts.delete.description', {
          name:
            typeof item.name === 'object'
              ? item.name.en
              : (item.name as unknown as string),
        }),
        confirmButtonText: t('common.delete'),
        variant: 'destructive',
      },
    );
  };

  // Submit handler
  const handleSubmit = useCallback(
    async (data: DiscountFormData) => {
      try {
        const validatedData = discountSchema.parse(data);

        if (latestDiscountData && latestDiscountData._id) {
          await updateDiscountMutation.mutateAsync({
            id: latestDiscountData._id,
            data: validatedData,
          });
        } else {
          await createDiscountMutation.mutateAsync(validatedData);
        }

        closeModal();
      } catch (err) {
        console.error('Failed to save discount:', err);
      }
    },
    [
      latestDiscountData,
      updateDiscountMutation,
      createDiscountMutation,
      closeModal,
    ],
  );

  // Search handler
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Pagination handler
  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
  );

  // Sorting handler
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Column filters handler
  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  const isFormLoading =
    createDiscountMutation.isPending ||
    updateDiscountMutation.isPending ||
    isLoadingIndividualDiscount ||
    isFetchingIndividualDiscount;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Percent className="h-6 w-6" />
              <span>{t('discounts.title')}</span>
            </h2>
            <p className="text-muted-foreground">{t('discounts.subtitle')}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status filter */}
            <Button
              variant={statusFilter !== undefined ? 'default' : 'outline'}
              onClick={() => {
                setStatusFilter(
                  statusFilter === 'active'
                    ? 'inactive'
                    : statusFilter === 'inactive'
                      ? undefined
                      : 'active',
                );
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === 'active'
                ? t('common.active')
                : statusFilter === 'inactive'
                  ? t('common.inactive')
                  : t('restaurants.allStatus')}
            </Button>

            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t('discounts.addDiscount')}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t('discounts.errorLoading')}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={discounts}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t('discounts.searchPlaceholder')}
                onSearchChange={handleSearchChange}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                sorting={sorting}
                onSortingChange={handleSortingChange}
                columnFilters={columnFilters}
                onColumnFiltersChange={handleColumnFiltersChange}
                manualPagination={true}
                manualSorting={true}
                manualFiltering={true}
                showSearch={true}
                showPagination={true}
                showPageSizeSelector={true}
                emptyMessage={t('common.na')}
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>

        {/* Create / Edit Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            latestDiscountData
              ? t('discounts.edit.title') || 'Edit Discount'
              : t('discounts.create.title') || 'Add Discount'
          }
          size="lg"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            latestDiscountData ? t('common.update') : t('common.create')
          }
        >
          <DiscountFormContent form={form} />
        </CrudModal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteDiscountMutation.isPending}
        />
      </div>
    </Layout>
  );
}
