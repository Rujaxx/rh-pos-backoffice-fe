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
import {
  CategoryFormContent,
  useCategoryForm,
} from "@/components/menu-management/categories/category-form";
import {
  useCategoryColumns,
  getSortFieldForQuery,
  getSortOrderForQuery,
} from "@/components/menu-management/categories/category-table-columns";
import { TanStackTable } from "@/components/ui/tanstack-table";
import Layout from "@/components/common/layout";
import { Plus, Tag, Filter } from "lucide-react";
import { Category, CategoryQueryParams } from "@/types/category.type";
import {
  CategoryFormData,
  categorySchema,
} from "@/lib/validations/category.validation";
import {
  useCategories,
  useCategory,
} from "@/services/api/categories/categories.queries";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/services/api/categories/categories.mutations";
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

export default function CategoriesPage() {
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
  const queryParams = useMemo<CategoryQueryParams>(() => {
    const params: CategoryQueryParams = {
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
      params.sortBy = sortField as
        | "name"
        | "createdAt"
        | "updatedAt"
        | "sortOrder";
      params.sortOrder = getSortOrderForQuery(sorting) || "desc";
    }

    // Add status filter
    if (statusFilter !== undefined) {
      params.isActive = statusFilter === "active" ? "true" : "false";
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // API hooks
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useCategories(queryParams);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Extract data from response
  const categories = categoriesResponse?.data || [];
  const totalCount = categoriesResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingCategory,
    openModal,
    closeModal,
  } = useModal<Category>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch individual category data when editing to get latest information
  const categoryId = editingCategory?._id;
  const shouldFetchCategory = isOpen && !!categoryId;

  const {
    data: individualCategoryResponse,
    isLoading: isLoadingIndividualCategory,
    isFetching: isFetchingIndividualCategory,
  } = useCategory(categoryId || "", {
    enabled: shouldFetchCategory, // The hook already checks !!id, we just need to check if modal is open
  });

  // Use the latest category data from API if available, otherwise use the table data
  const latestCategoryData =
    individualCategoryResponse?.data || editingCategory;

  // Form hook with latest category data
  const { form } = useCategoryForm(latestCategoryData);

  // Use refs to update the actual handler logic without changing column references
  const editHandlerRef = useRef<((category: Category) => void) | null>(null);
  const deleteHandlerRef = useRef<((category: Category) => void) | null>(null);

  // Create stable handler functions that use refs
  const editHandler = useCallback((category: Category) => {
    editHandlerRef.current?.(category);
  }, []);

  const deleteHandler = useCallback((category: Category) => {
    deleteHandlerRef.current?.(category);
  }, []);

  // Create columns with stable handlers
  const stableColumns = useCategoryColumns(editHandler, deleteHandler);

  // Update the handler refs on each render (but this won't cause columns to recreate)
  editHandlerRef.current = (category: Category) => {
    openModal(category);
  };

  deleteHandlerRef.current = (category: Category) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteCategoryMutation.mutateAsync(category._id);
        } catch (error) {
          console.error("Failed to delete category:", error);
        }
      },
      {
        title: t("categories.deleteCategory"),
        description: t("categories.deleteConfirmation", {
          categoryName: category.name.en,
        }),
        confirmButtonText: t("categories.deleteCategoryButton"),
        variant: "destructive",
      },
    );
  };

  // Move handlers after column definition to avoid dependency issues
  const handleSubmit = useCallback(
    async (data: CategoryFormData) => {
      try {
        // Handle 'none' restaurant selection - convert to undefined
        const processedData = {
          ...data,
          restaurantId:
            data.restaurantId === "none" ? undefined : data.restaurantId,
        };

        // Parse and apply defaults using the schema to ensure all fields have proper values
        const validatedData = categorySchema.parse(processedData);

        if (latestCategoryData) {
          await updateCategoryMutation.mutateAsync({
            id: latestCategoryData._id,
            data: validatedData,
          });
        } else {
          await createCategoryMutation.mutateAsync(validatedData);
        }
        closeModal();
      } catch (error) {
        console.error("Failed to save category:", error);
      }
    },
    [
      latestCategoryData,
      updateCategoryMutation,
      createCategoryMutation,
      closeModal,
    ],
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
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    isLoadingIndividualCategory ||
    isFetchingIndividualCategory;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Tag className="h-6 w-6" />
              <span>{t("categories.title")}</span>
            </h2>
            <p className="text-muted-foreground">{t("categories.subtitle")}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Status filter button */}
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
                ? t("categories.active")
                : statusFilter === "inactive"
                  ? t("categories.inactive")
                  : t("categories.allStatus")}
            </Button>
            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t("categories.addNewCategory")}
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t("categories.errorLoading")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={categories}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("categories.searchPlaceholder")}
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
                emptyMessage={t("categories.noDataFound")}
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
            editingCategory
              ? t("categories.form.editTitle")
              : t("categories.form.createTitle")
          }
          description={
            editingCategory
              ? t("categories.form.editDescription")
              : t("categories.form.createDescription")
          }
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          size="xl"
          submitButtonText={
            editingCategory
              ? t("categories.form.updateButton")
              : t("categories.form.createButton")
          }
        >
          <CategoryFormContent form={form} />
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
          loading={deleteCategoryMutation.isPending}
        />
      </div>
    </Layout>
  );
}
