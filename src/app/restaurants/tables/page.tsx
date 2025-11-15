"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CrudModal,
  ConfirmationModal,
  useModal,
  useConfirmationModal,
} from "@/components/ui/crud-modal";
import { TableFormContent, useTableForm } from "@/components/tables/table-form";
import {
  useTableColumns,
  getSortFieldForQuery,
  getSortOrderForQuery,
} from "@/components/tables/table-table-columns";
import { TanStackTable } from "@/components/ui/tanstack-table";
import Layout from "@/components/common/layout";
import { Plus, UtensilsCrossed } from "lucide-react";
import { Table, TableQueryParams } from "@/types/table";
import { TableFormData, tableSchema } from "@/lib/validations/table.validation";
import { useTables, useTable } from "@/services/api/tables/tables.queries";
import {
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from "@/services/api/tables/tables.mutations";
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { toast } from "sonner";

export default function TablesPage() {
  const { t } = useTranslation();

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Build query parameters from table state
  const queryParams = useMemo<TableQueryParams>(() => {
    const params: TableQueryParams = {
      page: pagination.pageIndex + 1, // Backend expects 1-based page numbers
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || "desc", // Default sort order
    };

    // Add search term
    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    // Add sorting field
    const sortField = getSortFieldForQuery(sorting);
    if (sortField) {
      params.sortBy = sortField as string;
      params.sortOrder = getSortOrderForQuery(sorting) || "desc";
    }

    return params;
  }, [pagination, sorting, searchTerm]);

  // API hooks
  const { data: tablesResponse, isLoading, error } = useTables(queryParams);
  const createTableMutation = useCreateTable();
  const updateTableMutation = useUpdateTable();
  const deleteTableMutation = useDeleteTable();

  // Extract data from response
  const tables = tablesResponse?.data || [];
  const totalCount = tablesResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingTable,
    openModal,
    closeModal,
  } = useModal<Table>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch individual table data when editing to get latest information
  const tableId = editingTable?._id;
  const shouldFetchTable = isOpen && !!tableId;

  const {
    data: individualTableResponse,
    isLoading: isLoadingIndividualTable,
    isFetching: isFetchingIndividualTable,
  } = useTable(tableId || "", {
    enabled: shouldFetchTable, // The hook already checks !!id, we just need to check if modal is open
  });

  // Use the latest table data from API if available, otherwise use the table data
  const latestTableData = individualTableResponse?.data || editingTable;

  // Form hook with latest table data
  const { form } = useTableForm(latestTableData);

  // Use refs to update the actual handler logic without changing column references
  const editHandlerRef = useRef<((table: Table) => void) | null>(null);
  const deleteHandlerRef = useRef<((table: Table) => void) | null>(null);

  // Create stable handler functions that use refs
  const editHandler = useCallback((table: Table) => {
    editHandlerRef.current?.(table);
  }, []);

  const deleteHandler = useCallback((table: Table) => {
    deleteHandlerRef.current?.(table);
  }, []);

  // Create columns with stable handlers
  const stableColumns = useTableColumns(editHandler, deleteHandler);

  // Update the handler refs on each render (but this won't cause columns to recreate)
  editHandlerRef.current = (table: Table) => {
    openModal(table);
  };

  deleteHandlerRef.current = (table: Table) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteTableMutation.mutateAsync(table._id);
        } catch (error) {
          console.error("Failed to delete table:", error);
        }
      },
      {
        title: t("table.deleteTable"),
        description: t("table.deleteConfirmation", {
          tableName: table.label,
        }),
        confirmButtonText: t("table.deleteTableButton"),
        variant: "destructive",
      },
    );
  };

  // Move handlers after column definition to avoid dependency issues
  const handleSubmit = useCallback(
    async (data: TableFormData) => {
      try {
        // Handle bulk creation
        if (data.isBulk && data.bulkCount) {
          const count = parseInt(data.bulkCount);
          const prefix = data.bulkLabelPrefix || "T";

          // Create multiple tables
          for (let i = 1; i <= count; i++) {
            const tableData = {
              ...data,
              label: `${prefix}${i}`,
              isBulk: undefined,
              bulkCount: undefined,
              bulkLabelPrefix: undefined,
            };

            await createTableMutation.mutateAsync(tableData);
          }

          toast.success(t("table.bulkCreateSuccess", { count }));
        } else {
          // Parse and apply defaults using the schema to ensure all fields have proper values
          const validatedData = {
            ...data,
            isBulk: undefined,
            bulkCount: undefined,
            bulkLabelPrefix: undefined,
          };

          if (latestTableData) {
            await updateTableMutation.mutateAsync({
              id: latestTableData._id,
              data: validatedData,
            });
          } else {
            await createTableMutation.mutateAsync(validatedData);
          }
        }
        closeModal();
      } catch (error) {
        console.error("Failed to save table:", error);
      }
    },
    [latestTableData, updateTableMutation, createTableMutation, closeModal],
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
    createTableMutation.isPending ||
    updateTableMutation.isPending ||
    isLoadingIndividualTable ||
    isFetchingIndividualTable;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span>{t("table.title")}</span>
            </h2>
            <p className="text-muted-foreground">{t("table.subtitle")}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t("table.addNewTable")}
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t("table.errorLoading")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={tables}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("table.searchPlaceholder")}
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
                emptyMessage={t("table.noDataFound")}
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
            latestTableData
              ? t("table.form.editTitle")
              : t("table.form.createTitle")
          }
          description={
            latestTableData
              ? t("table.form.editDescription")
              : t("table.form.createDescription")
          }
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          size="xl"
          submitButtonText={
            latestTableData
              ? t("table.form.updateButton")
              : t("table.form.createButton")
          }
        >
          <TableFormContent form={form} />
        </CrudModal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteTableMutation.isPending}
        />
      </div>
    </Layout>
  );
}
