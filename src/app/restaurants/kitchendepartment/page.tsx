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
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from "@/components/ui/crud-modal";
import Layout from "@/components/common/layout";
import { Plus, Building2, Filter } from "lucide-react";

import {
  KitchenDepartment,
  KitchenDepartmentQueryParams,
} from "@/types/kitchen-department.type";
import {
  KitchenDepartmentFormData,
  kitchenDepartmentSchema,
} from "@/lib/validations/kitchen-department.validation";
import {
  useKitchenDepartments,
  useKitchenDepartment,
} from "@/services/api/kitchen-departments/kitchen-departments.queries";

import {
  KitchenDepartmentFormContent,
  useKitchenDepartmentForm,
} from "@/components/kitchen-department/kitchen-department-form";
import {
  getSortFieldForQuery,
  getSortOrderForQuery,
  useKitchenDepartmentColumns,
} from "@/components/kitchen-department/kitchen-department-table-columns";
import {
  useCreateKitchenDepartment,
  useDeleteKitchenDepartment,
  useUpdateKitchenDepartment,
} from "@/services/api/kitchen-departments/kitchen-departments.mutation";

export default function KitchenDepartmentPage() {
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
    undefined,
  );

  // Build query parameters from table state
  const queryParams = useMemo<KitchenDepartmentQueryParams>(() => {
    const params: KitchenDepartmentQueryParams = {
      page: pagination.pageIndex + 1, // 1-based for backend
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || "desc",
    };

    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    const sortField = getSortFieldForQuery(sorting);
    if (sortField) {
      params.sortOrder = getSortOrderForQuery(sorting) || "desc";
    }

    if (statusFilter !== undefined) {
      params.isActive = statusFilter === "active" ? "true" : "false";
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // API hooks
  const {
    data: kitchenDepartmentsResponse,
    isLoading,
    error,
  } = useKitchenDepartments(queryParams);

  const createKitchenDepartmentMutation = useCreateKitchenDepartment();
  const updateKitchenDepartmentMutation = useUpdateKitchenDepartment();
  const deleteKitchenDepartmentMutation = useDeleteKitchenDepartment();

  // Extract data from response
  const kitchenDepartments = kitchenDepartmentsResponse?.data || [];
  const totalCount = kitchenDepartmentsResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingKitchenDepartment,
    openModal,
    closeModal,
  } = useModal<KitchenDepartment>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch latest data for editing row
  const kitchenDepartmentId = editingKitchenDepartment?._id;
  const shouldFetchKitchenDepartment = isOpen && !!kitchenDepartmentId;

  const {
    data: individualKitchenDepartmentResponse,
    isLoading: isLoadingIndividualKitchenDepartment,
    isFetching: isFetchingIndividualKitchenDepartment,
  } = useKitchenDepartment(kitchenDepartmentId || "", {
    enabled: shouldFetchKitchenDepartment,
  });

  // Prefer fresh API data when editing
  const latestKitchenDepartmentData =
    individualKitchenDepartmentResponse?.data || editingKitchenDepartment;

  // Form hook with latest data
  const { form } = useKitchenDepartmentForm(latestKitchenDepartmentData);

  // Stable handler refs for column callbacks
  const editHandlerRef = useRef<((dept: KitchenDepartment) => void) | null>(
    null,
  );
  const deleteHandlerRef = useRef<((dept: KitchenDepartment) => void) | null>(
    null,
  );

  const editHandler = useCallback((dept: KitchenDepartment) => {
    editHandlerRef.current?.(dept);
  }, []);

  const deleteHandler = useCallback((dept: KitchenDepartment) => {
    deleteHandlerRef.current?.(dept);
  }, []);

  // Columns with stable handlers
  const stableColumns = useKitchenDepartmentColumns(editHandler, deleteHandler);

  // Wire handler refs without recreating columns
  editHandlerRef.current = (dept: KitchenDepartment) => {
    openModal(dept);
  };

  deleteHandlerRef.current = (dept: KitchenDepartment) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteKitchenDepartmentMutation.mutateAsync(dept._id);
        } catch (error) {
          console.error("Failed to delete kitchen department:", error);
        }
      },
      {
        title: t("kitchen.deleteConfirmationTitle"),
        description: t("kitchen.deleteConfirmationDescription", {
          name:
            typeof dept.name === "object"
              ? dept.name.en
              : (dept.name as unknown as string),
        }),
        confirmButtonText: t("common.delete"),
        variant: "destructive",
      },
    );
  };

  // Submit handler (create / update)
  const handleSubmit = useCallback(
    async (data: KitchenDepartmentFormData) => {
      try {
        // ensure booleans/defaults via schema
        const validatedData = kitchenDepartmentSchema.parse(data);

        if (latestKitchenDepartmentData) {
          await updateKitchenDepartmentMutation.mutateAsync({
            id: latestKitchenDepartmentData._id,
            data: validatedData,
          });
        } else {
          await createKitchenDepartmentMutation.mutateAsync(validatedData);
        }

        closeModal();
      } catch (error) {
        console.error("Failed to save kitchen department:", error);
      }
    },
    [
      latestKitchenDepartmentData,
      updateKitchenDepartmentMutation,
      createKitchenDepartmentMutation,
      closeModal,
    ],
  );

  // Search
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Pagination
  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
  );

  // Sorting
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Column filters
  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  const isFormLoading =
    createKitchenDepartmentMutation.isPending ||
    updateKitchenDepartmentMutation.isPending ||
    isLoadingIndividualKitchenDepartment ||
    isFetchingIndividualKitchenDepartment;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>{t("kitchen.title")}</span>
            </h2>
            <p className="text-muted-foreground">{t("kitchen.subtitle")}</p>
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
                      : "active",
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
              {t("kitchen.addNew")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t("kitchen.errorLoading")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={kitchenDepartments}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("kitchen.searchPlaceholder")}
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
            latestKitchenDepartmentData
              ? t("kitchen.editTitle") || "Edit Kitchen Department"
              : t("kitchen.addTitle") || "Add Kitchen Department"
          }
          size="lg"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            latestKitchenDepartmentData
              ? t("common.update")
              : t("common.create")
          }
        >
          <KitchenDepartmentFormContent form={form} />
        </CrudModal>

        {/* Delete confirmation */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteKitchenDepartmentMutation.isPending}
        />
      </div>
    </Layout>
  );
}
