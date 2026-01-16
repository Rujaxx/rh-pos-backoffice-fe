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
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';
import { BrandFormContent, useBrandForm } from '@/components/brands/brand-form';
import {
  useBrandColumns,
  getSortFieldForQuery,
  getSortOrderForQuery,
} from '@/components/brands/brand-table-columns';
import Layout from '@/components/common/layout';
import { Plus, Building2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Brand, BrandQueryParams } from '@/types/brand.type';
import { BrandFormData } from '@/lib/validations/brand.validation';
import { useBrands } from '@/services/api/brands/brands.queries';
import {
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/services/api/brands/brands.mutations';

export default function BrandsPage() {
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

  // Build query parameters from table state
  const queryParams = useMemo<BrandQueryParams>(() => {
    const params: BrandQueryParams = {
      page: pagination.pageIndex + 1, // Backend expects 1-based page numbers
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || 'desc', // Default sort order
    };

    // Add search term
    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    // Add sorting field
    const sortField = getSortFieldForQuery(sorting);
    if (sortField) {
      // You might need to add a sortBy field to your BrandQueryParams type
      // For now, we'll use the existing sortOrder field
      params.sortOrder = getSortOrderForQuery(sorting) || 'desc';
    }

    // Add status filter
    if (statusFilter !== undefined) {
      // Send string values to backend as expected by BrandQueryParams
      params.isActive = statusFilter === 'active' ? 'true' : 'false';
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // API hooks
  const { data: brandsResponse, isLoading, error } = useBrands(queryParams);
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  // Extract data from response
  const brands = brandsResponse?.data || [];
  const totalCount = brandsResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingBrand,
    openModal,
    closeModal,
  } = useModal<Brand>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useBrandForm(editingBrand);

  // Handlers - moved before columns definition
  // Remove these individual handlers as we're inlining them

  // Use refs to update the actual handler logic without changing column references
  const editHandlerRef = useRef<((brand: Brand) => void) | null>(null);
  const deleteHandlerRef = useRef<((brand: Brand) => void) | null>(null);

  // Create stable handler functions that use refs
  const editHandler = useCallback((brand: Brand) => {
    editHandlerRef.current?.(brand);
  }, []);

  const deleteHandler = useCallback((brand: Brand) => {
    deleteHandlerRef.current?.(brand);
  }, []);

  // Create columns with stable handlers
  const stableColumns = useBrandColumns(editHandler, deleteHandler);

  // Update the handler refs on each render (but this won't cause columns to recreate)
  editHandlerRef.current = (brand: Brand) => {
    openModal(brand);
  };

  deleteHandlerRef.current = (brand: Brand) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteBrandMutation.mutateAsync(brand._id);
          toast.success(t('brands.deletedSuccess') || 'Brand deleted');
        } catch (error) {
          // Log for debugging and surface a friendly message

          console.error('Failed to delete brand:', error);
          const msg =
            error instanceof Error
              ? error.message
              : t('brands.deleteError') || 'Failed to delete brand';
          toast.error(msg);
        }
      },
      {
        title: t('brands.deleteBrand'),
        description: t('brands.deleteConfirmation', {
          brandName: brand.name.en,
        }),
        confirmButtonText: t('brands.deleteBrandButton'),
        variant: 'destructive',
      },
    );
  };

  // Move handlers after column definition to avoid dependency issues
  const handleSubmit = useCallback(
    async (data: BrandFormData) => {
      try {
        if (editingBrand) {
          // Remove _id from data before sending to backend (ID should only be in URL path)

          await updateBrandMutation.mutateAsync({
            id: editingBrand._id,
            data: data,
          });
        } else {
          await createBrandMutation.mutateAsync(data);
        }
        closeModal();
      } catch (error) {
        console.error('Failed to save brand:', error);
      }
    },
    [editingBrand, updateBrandMutation, createBrandMutation, closeModal],
  );

  // Search handler with proper typing
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    // Reset to first page when searching
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
    // Reset to first page when sorting changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Column filters handler
  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      // Reset to first page when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  const isFormLoading =
    createBrandMutation.isPending || updateBrandMutation.isPending;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>{t('brands.title')}</span>
            </h2>
            <p className="text-muted-foreground">{t('brands.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Add status filter button */}
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
              className="h-8 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>
                {statusFilter === 'active'
                  ? t('brands.active')
                  : statusFilter === 'inactive'
                    ? t('brands.inactive')
                    : t('brands.allStatus')}
              </span>
            </Button>
            <Button
              onClick={() => openModal()}
              className="h-8 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('brands.addNewBrand')}</span>
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t('brands.errorLoading')}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={brands}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t('brands.searchPlaceholder')}
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

        {/* Create/Edit Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            editingBrand
              ? t('brands.editBrand') || 'Edit Brand'
              : t('brands.addBrand') || 'Add Brand'
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            editingBrand
              ? t('brands.updateBrand') || 'Update Brand'
              : t('brands.createBrand') || 'Create Brand'
          }
        >
          <BrandFormContent form={form} editingBrand={editingBrand} />
        </CrudModal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteBrandMutation.isPending}
        />
      </div>
    </Layout>
  );
}
