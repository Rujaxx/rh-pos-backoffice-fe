"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TanStackTable } from "@/components/ui/tanstack-table";

import Layout from "@/components/common/layout";
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from "@/components/ui/crud-modal";

import { Tag, Plus, Filter } from "lucide-react";

import {
  TaxProductGroup,
  TaxProductGroupQueryParams,
} from "@/types/tax-product-group.type";
import {
  TaxProductGroupFormData,
  taxProductGroupSchema,
} from "@/lib/validations/tax-product-group.validation";

import {
  useTaxProductGroupColumns,
  getSortFieldForTaxProductGroupQuery,
  getSortOrderForTaxProductGroupQuery,
} from "@/components/taxgroup/tax-product-group-table-columns";
import {
  useTaxProductGroup,
  useTaxProductGroups,
} from "@/services/api/tax-product-groups.ts/tax-product-groups.queries";
import {
  useCreateTaxProductGroup,
  useDeleteTaxProductGroup,
  useUpdateTaxProductGroup,
} from "@/services/api/tax-product-groups.ts/tax-product-groups.mutations";
import TaxGroupFormContent, {
  useTaxProductGroupForm,
} from "@/components/taxgroup/tax-product-group-form";

export default function TaxProductGroupsPage() {
  const { t } = useTranslation();

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  // Build query params for API
  const queryParams = useMemo<TaxProductGroupQueryParams>(() => {
    const params: TaxProductGroupQueryParams = {
      page: pagination.pageIndex + 1, // backend is 1-based
      limit: pagination.pageSize,
      sortOrder: getSortOrderForTaxProductGroupQuery(sorting) || "desc",
    };

    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    const sortField = getSortFieldForTaxProductGroupQuery(sorting);
    if (sortField) {
      // Keeping same pattern as other pages (only sortOrder sent)
      params.sortOrder = getSortOrderForTaxProductGroupQuery(sorting) || "desc";
      // If you add sortBy on backend, this is where you'd set it.
      // params.sortBy = sortField as TaxProductGroupQueryParams["sortBy"];
    }

    if (statusFilter !== undefined) {
      params.isActive = statusFilter === "active" ? "true" : "false";
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // Queries
  const {
    data: taxGroupsResponse,
    isLoading,
    error,
  } = useTaxProductGroups(queryParams);

  const createTaxProductGroupMutation = useCreateTaxProductGroup();
  const updateTaxProductGroupMutation = useUpdateTaxProductGroup();
  const deleteTaxProductGroupMutation = useDeleteTaxProductGroup();

  const taxGroups = taxGroupsResponse?.data || [];
  const totalCount = taxGroupsResponse?.meta?.total || 0;

  // Modals
  const {
    isOpen,
    editingItem: editingTaxGroup,
    openModal,
    closeModal,
  } = useModal<TaxProductGroup>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch fresh item when editing
  const taxGroupId = editingTaxGroup?._id;
  const shouldFetchTaxGroup = isOpen && !!taxGroupId;

  const {
    data: individualTaxGroupResponse,
    isLoading: isLoadingIndividualTaxGroup,
    isFetching: isFetchingIndividualTaxGroup,
  } = useTaxProductGroup(taxGroupId || "", {
    enabled: shouldFetchTaxGroup,
  });

  const latestTaxGroupData =
    individualTaxGroupResponse?.data || editingTaxGroup;

  // Form
  const { form } = useTaxProductGroupForm(latestTaxGroupData);

  // Stable handlers for columns
  const editHandlerRef = useRef<((item: TaxProductGroup) => void) | null>(null);
  const deleteHandlerRef = useRef<((item: TaxProductGroup) => void) | null>(
    null
  );

  const editHandler = useCallback((item: TaxProductGroup) => {
    editHandlerRef.current?.(item);
  }, []);

  const deleteHandler = useCallback((item: TaxProductGroup) => {
    deleteHandlerRef.current?.(item);
  }, []);

  const stableColumns = useTaxProductGroupColumns(editHandler, deleteHandler);

  // Wire refs
  editHandlerRef.current = (item: TaxProductGroup) => {
    openModal(item);
  };

  deleteHandlerRef.current = (item: TaxProductGroup) => {
    openConfirmationModal(
      async () => {
        try {
          if (!item._id) return;
          await deleteTaxProductGroupMutation.mutateAsync(item._id);
        } catch (err) {
          console.error("Failed to delete tax product group:", err);
        }
      },
      {
        title: t("taxGroups.delete.title"),
        description: t("taxGroups.delete.description", {
          name:
            typeof item.name === "object"
              ? item.name.en
              : (item.name as unknown as string),
        }),
        confirmButtonText: t("common.delete"),
        variant: "destructive",
      }
    );
  };

  // Submit handler
  const handleSubmit = useCallback(
    async (data: TaxProductGroupFormData) => {
      try {
        const validatedData = taxProductGroupSchema.parse(data);

        if (latestTaxGroupData && latestTaxGroupData._id) {
          await updateTaxProductGroupMutation.mutateAsync({
            id: latestTaxGroupData._id,
            data: validatedData,
          });
        } else {
          await createTaxProductGroupMutation.mutateAsync(validatedData);
        }

        closeModal();
      } catch (err) {
        console.error("Failed to save tax product group:", err);
      }
    },
    [
      latestTaxGroupData,
      updateTaxProductGroupMutation,
      createTaxProductGroupMutation,
      closeModal,
    ]
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
    []
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
    []
  );

  const isFormLoading =
    createTaxProductGroupMutation.isPending ||
    updateTaxProductGroupMutation.isPending ||
    isLoadingIndividualTaxGroup ||
    isFetchingIndividualTaxGroup;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Tag className="h-6 w-6" />
              <span>{t("taxGroups.title")}</span>
            </h2>
            <p className="text-muted-foreground">{t("taxGroups.subtitle")}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status filter */}
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
              {statusFilter === "active"
                ? t("common.active")
                : statusFilter === "inactive"
                  ? t("common.inactive")
                  : t("restaurants.allStatus")}
            </Button>

            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t("taxGroups.addTaxGroup")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t("taxGroups.errorLoading")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={taxGroups}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("taxGroups.searchPlaceholder")}
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
                emptyMessage={t("common.na")}
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
            latestTaxGroupData
              ? t("taxGroups.edit.title") || "Edit Tax Product Group"
              : t("taxGroups.create.title") || "Add Tax Product Group"
          }
          size="lg"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            latestTaxGroupData ? t("common.update") : t("common.create")
          }
        >
          <TaxGroupFormContent form={form} />
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
          loading={deleteTaxProductGroupMutation.isPending}
        />
      </div>
    </Layout>
  );
}
