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
import {
  FeedbackConfigFormContent,
  useFeedbackConfigForm,
} from '@/components/feedback-config/feedback-config-form';
import { useFeedbackConfigColumns } from '@/components/feedback-config/feedback-config-columns';
import Layout from '@/components/common/layout';
import { Plus, MessageSquare, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  FeedbackConfig,
  FeedbackConfigQueryParams,
} from '@/types/feedback-config.type';
import {
  FeedbackConfigFormSchema,
  FeedbackConfigFormOutput,
} from '@/lib/validations/feedback-config.validation';
import { useFeedbackConfigs } from '@/services/api/feedback-config/feedback-config.query';
import {
  useCreateFeedbackConfig,
  useUpdateFeedbackConfig,
  useDeleteFeedbackConfig,
} from '@/services/api/feedback-config/feedback-config.mutation';

export default function FeedbackConfigPage() {
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
  const queryParams = useMemo<FeedbackConfigQueryParams>(() => {
    const params: FeedbackConfigQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    // Add search term
    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    // Add sorting field
    if (sorting.length > 0) {
      // Map sort ID to backend field if needed
      const sortId = sorting[0].id;
      // Safety check or mapping if needed
      if (['campaignName', 'createdAt', 'updatedAt'].includes(sortId)) {
        params.sortBy = sortId as FeedbackConfigQueryParams['sortBy'];
      }
    }

    // Add status filter
    if (statusFilter !== undefined) {
      params.isActive = statusFilter === 'active' ? 'true' : 'false';
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  console.log(queryParams);

  // API hooks
  const {
    data: configsResponse,
    isLoading,
    error,
  } = useFeedbackConfigs(queryParams);
  const createConfigMutation = useCreateFeedbackConfig();
  const updateConfigMutation = useUpdateFeedbackConfig();
  const deleteConfigMutation = useDeleteFeedbackConfig();

  // Extract data from response
  const feedbackConfigs = configsResponse?.data || [];
  const totalCount = configsResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingConfig,
    openModal,
    closeModal,
  } = useModal<FeedbackConfig>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useFeedbackConfigForm(editingConfig);

  // Handlers
  const editHandlerRef = useRef<((config: FeedbackConfig) => void) | null>(
    null,
  );
  const deleteHandlerRef = useRef<((config: FeedbackConfig) => void) | null>(
    null,
  );

  const editHandler = useCallback((config: FeedbackConfig) => {
    editHandlerRef.current?.(config);
  }, []);

  const deleteHandler = useCallback((config: FeedbackConfig) => {
    deleteHandlerRef.current?.(config);
  }, []);

  // Create columns with stable handlers
  const stableColumns = useFeedbackConfigColumns(editHandler, deleteHandler);

  // Update handler refs
  editHandlerRef.current = (config: FeedbackConfig) => {
    openModal(config);
  };

  deleteHandlerRef.current = (config: FeedbackConfig) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteConfigMutation.mutateAsync(config._id);
          toast.success(
            t('feedbackConfig.deletedSuccess') ||
              'Feedback config deleted successfully',
          );
        } catch (error) {
          console.error('Failed to delete config:', error);
          const msg =
            error instanceof Error
              ? error.message
              : t('feedbackConfig.deleteError') ||
                'Failed to delete feedback config';
          toast.error(msg);
        }
      },
      {
        title: t('feedbackConfig.deleteTitle') || 'Delete Feedback Config',
        description:
          t('feedbackConfig.deleteConfirmation') ||
          `Are you sure you want to delete "${config.campaignName}"?`,
        confirmButtonText: t('feedbackConfig.deleteButton') || 'Delete Config',
        variant: 'destructive',
      },
    );
  };

  const handleSubmit = useCallback(
    async (data: FeedbackConfigFormSchema) => {
      const output = data as FeedbackConfigFormOutput;
      try {
        if (editingConfig) {
          await updateConfigMutation.mutateAsync({
            id: editingConfig._id,
            data: output,
          });
        } else {
          await createConfigMutation.mutateAsync(output);
        }
        closeModal();
      } catch (error) {
        console.error('Failed to save config:', error);
      }
    },
    [editingConfig, updateConfigMutation, createConfigMutation, closeModal],
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
    createConfigMutation.isPending || updateConfigMutation.isPending;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span>
                {t('feedbackConfig.title') || 'Feedback Configurations'}
              </span>
            </h2>
            <p className="text-muted-foreground">
              {t('feedbackConfig.subtitle') ||
                'Manage customer feedback campaigns and settings'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Status Filter */}
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
                  ? t('common.active') || 'Active'
                  : statusFilter === 'inactive'
                    ? t('common.inactive') || 'Inactive'
                    : t('common.all') || 'All Status'}
              </span>
            </Button>
            <Button
              onClick={() => openModal()}
              className="h-8 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('feedbackConfig.addNew') || 'Add New Config'}</span>
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t('feedbackConfig.errorLoading') || 'Error loading data'}:{' '}
                  {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={feedbackConfigs}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('feedbackConfig.searchPlaceholder') || 'Search campaigns...'
                }
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
                emptyMessage={t('feedbackConfig.noData') || 'No records found'}
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
            editingConfig
              ? t('feedbackConfig.editTitle') || 'Edit Feedback Config'
              : t('feedbackConfig.createTitle') || 'Create Feedback Config'
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            editingConfig
              ? t('common.update') || 'Update'
              : t('common.create') || 'Create'
          }
        >
          <FeedbackConfigFormContent
            form={form}
            editingConfig={editingConfig}
          />
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
          loading={deleteConfigMutation.isPending}
        />
      </div>
    </Layout>
  );
}
