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
import { TableSectionFormContent, useTableSectionForm } from '@/components/forms/tablesections/tablesections-form';
import { useTableSectionColumns } from '@/components/tables/tablesections/tablesections-columns';
import Layout from '@/components/common/layout';
import { Plus, Layers, Filter } from 'lucide-react';
import { TableSection, TableSectionQueryParams } from '@/types/tablesection.type';
import { TableSectionFormData, tableSectionSchema } from '@/lib/validations/tablesection.validation';
import { 
  useGetTableSections, 
  useGetTableSection 
} from '@/services/api/tablesections/tablesections.queries';
import {
  useCreateTableSection,
  useUpdateTableSection,
  useDeleteTableSection
} from '@/services/api/tablesections/tablesections.mutations';


export default function TableSectionPage() {
  const { t } = useTranslation();

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Build query parameters from table state
  const queryParams = useMemo<TableSectionQueryParams>(() => {
    const params: TableSectionQueryParams = {
      page: pagination.pageIndex + 1, // Backend expects 1-based page numbers
      limit: pagination.pageSize,
      sortOrder: 'desc', // Default sort order
    };

    // Add search term
    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    // Add sorting
    if (sorting.length > 0) {
      const sortField = sorting[0]?.id as 'name' | 'createdAt' | 'updatedAt';
      if (sortField) {
        params.sortBy = sortField;
        params.sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
      }
    }

    // Add status filter
    if (statusFilter !== undefined) {
      params.isActive = statusFilter === "active" ? "true" : "false";
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // API hooks
  const { data: tableSectionsResponse, isLoading, error } = useGetTableSections(queryParams);
  const createTableSectionMutation = useCreateTableSection();
  const updateTableSectionMutation = useUpdateTableSection();
  const deleteTableSectionMutation = useDeleteTableSection();

  // Extract data from response
  const tableSections = tableSectionsResponse?.data || [];
  const totalCount = tableSectionsResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingTableSection,
    openModal,
    closeModal,
  } = useModal<TableSection>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch individual table section data when editing to get latest information
  const tableSectionId = editingTableSection?._id;
  const shouldFetchTableSection = isOpen && !!tableSectionId;
  
  const { 
    data: individualTableSectionResponse, 
    isLoading: isLoadingIndividualTableSection,
    isFetching: isFetchingIndividualTableSection 
  } = useGetTableSection(
    tableSectionId || '', 
    {
      enabled: shouldFetchTableSection
    }
  );

  // Use the latest table section data from API if available, otherwise use the table data
  const latestTableSectionData = individualTableSectionResponse?.data || editingTableSection;

  // Form hook with latest table section data
  const { form } = useTableSectionForm(latestTableSectionData);

  // Use refs to update the actual handler logic without changing column references
  const editHandlerRef = useRef<((tableSection: TableSection) => void) | null>(null);
  const deleteHandlerRef = useRef<((tableSection: TableSection) => void) | null>(null);

  // Create stable handler functions that use refs
  const editHandler = useCallback((tableSection: TableSection) => {
    editHandlerRef.current?.(tableSection);
  }, []);
  
  const deleteHandler = useCallback((tableSection: TableSection) => {
    deleteHandlerRef.current?.(tableSection);
  }, []);

  // Create columns with stable handlers
  const stableColumns = useTableSectionColumns({
    onEdit: editHandler,
    onDelete: deleteHandler,
  });

  // Update the handler refs on each render (but this won't cause columns to recreate)
  editHandlerRef.current = (tableSection: TableSection) => {
    openModal(tableSection);
  };
  
  deleteHandlerRef.current = (tableSection: TableSection) => {
    openConfirmationModal(async () => {
      try {
        await deleteTableSectionMutation.mutateAsync(tableSection._id);
      } catch (error) {
        console.error('Failed to delete table section:', error);
      }
    }, {
      title: t('tableSection.deleteConfirmationTitle'),
      description: t('tableSection.deleteConfirmationDescription', {
        name: typeof tableSection.name === 'object' ? tableSection.name.en : tableSection.name,
      }),
      confirmButtonText: t('common.delete'),
      variant: 'destructive',
    });
  };

  // Move handlers after column definition to avoid dependency issues
  const handleSubmit = useCallback(async (data: TableSectionFormData) => {
    try {
      // Parse and apply defaults using the schema to ensure all boolean fields have proper values
      const validatedData = tableSectionSchema.parse(data);
      
      if (latestTableSectionData) {
        // Use the same data structure for update as create (no field removal)
        await updateTableSectionMutation.mutateAsync({
          id: latestTableSectionData._id,
          data: validatedData,
        });
      } else {
        await createTableSectionMutation.mutateAsync(validatedData);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save table section:', error);
    }
  }, [latestTableSectionData, updateTableSectionMutation, createTableSectionMutation, closeModal]);

  // Search handler with proper typing
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Pagination handler
  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination);
  }, []);

  // Sorting handler
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    // Reset to first page when sorting changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Column filters handler
  const handleColumnFiltersChange = useCallback((filters: ColumnFiltersState) => {
    setColumnFilters(filters);
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const isFormLoading = createTableSectionMutation.isPending || updateTableSectionMutation.isPending || isLoadingIndividualTableSection || isFetchingIndividualTableSection;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Layers className="h-6 w-6" />
              <span>{t('tableSection.title')}</span>
            </h2>
            <p className="text-muted-foreground">
              {t('tableSection.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Add status filter button */}
            <Button
              variant={statusFilter !== undefined ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(
                  statusFilter === "active"
                    ? "inactive"
                    : statusFilter === "inactive"
                      ? undefined
                      : "active"
                ); 
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === "active" ? t('common.active') :
                statusFilter === "inactive" ? t('common.inactive') :
                  t('restaurants.allStatus')}
            </Button>
            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t('tableSection.addNewTableSection')}
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>{t('restaurants.errorLoading')}: {error.message}</p>
              </div>
            ) : (
              <TanStackTable
                data={tableSections}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t('tableSection.searchPlaceholder')}
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
          title={latestTableSectionData ? (t('tableSection.editTitle') || 'Edit Table Section') : (t('tableSection.addTitle') || 'Add Table Section')}
          size="lg"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            latestTableSectionData ? t('common.update') : t('common.create')
          }
        >
          <TableSectionFormContent form={form} />
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
          loading={deleteTableSectionMutation.isPending}
        />
      </div>
    </Layout>
  );
}
