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
import {
  RestaurantFormContent,
  useRestaurantForm,
} from "@/components/restaurants/restaurant-form";
import {
  useRestaurantColumns,
  getSortFieldForQuery,
  getSortOrderForQuery,
} from "@/components/restaurants/restaurant-table-columns";
import Layout from "@/components/common/layout";
import { Plus, Building2, Filter } from "lucide-react";
import { Restaurant, RestaurantQueryParams } from "@/types/restaurant";
import {
  RestaurantFormData,
  restaurantSchema,
} from "@/lib/validations/restaurant.validation";
import {
  useRestaurants,
  useRestaurant,
} from "@/services/api/restaurants/restaurants.queries";
import {
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "@/services/api/restaurants/restaurants.mutations";

export default function RestaurantsPage() {
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
  const queryParams = useMemo<RestaurantQueryParams>(() => {
    const params: RestaurantQueryParams = {
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
    data: restaurantsResponse,
    isLoading,
    error,
  } = useRestaurants(queryParams);
  const createRestaurantMutation = useCreateRestaurant();
  const updateRestaurantMutation = useUpdateRestaurant();
  const deleteRestaurantMutation = useDeleteRestaurant();

  // Extract data from response
  const restaurants = restaurantsResponse?.data || [];
  const totalCount = restaurantsResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingRestaurant,
    openModal,
    closeModal,
  } = useModal<Restaurant>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch individual restaurant data when editing to get latest information
  const restaurantId = editingRestaurant?._id;
  const shouldFetchRestaurant = isOpen && !!restaurantId;

  const {
    data: individualRestaurantResponse,
    isLoading: isLoadingIndividualRestaurant,
    isFetching: isFetchingIndividualRestaurant,
  } = useRestaurant(restaurantId || "", {
    enabled: shouldFetchRestaurant, // The hook already checks !!id, we just need to check if modal is open
  });

  // Use the latest restaurant data from API if available, otherwise use the table data
  const latestRestaurantData =
    individualRestaurantResponse?.data || editingRestaurant;

  // Form hook with latest restaurant data
  const { form } = useRestaurantForm(latestRestaurantData);

  // Use refs to update the actual handler logic without changing column references
  const editHandlerRef = useRef<((restaurant: Restaurant) => void) | null>(
    null,
  );
  const deleteHandlerRef = useRef<((restaurant: Restaurant) => void) | null>(
    null,
  );

  // Create stable handler functions that use refs
  const editHandler = useCallback((restaurant: Restaurant) => {
    editHandlerRef.current?.(restaurant);
  }, []);

  const deleteHandler = useCallback((restaurant: Restaurant) => {
    deleteHandlerRef.current?.(restaurant);
  }, []);

  // Create columns with stable handlers
  const stableColumns = useRestaurantColumns(editHandler, deleteHandler);

  // Update the handler refs on each render (but this won't cause columns to recreate)
  editHandlerRef.current = (restaurant: Restaurant) => {
    openModal(restaurant);
  };

  deleteHandlerRef.current = (restaurant: Restaurant) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteRestaurantMutation.mutateAsync(restaurant._id);
        } catch (error) {
          console.error("Failed to delete restaurant:", error);
        }
      },
      {
        title: t("restaurants.deleteRestaurant"),
        description: t("restaurants.deleteConfirmation", {
          restaurantName: restaurant.name.en,
        }),
        confirmButtonText: t("restaurants.deleteRestaurantButton"),
        variant: "destructive",
      },
    );
  };

  // Move handlers after column definition to avoid dependency issues
  const handleSubmit = useCallback(
    async (data: RestaurantFormData) => {
      try {
        // Parse and apply defaults using the schema to ensure all boolean fields have proper values
        const validatedData = restaurantSchema.parse(data);
        if (latestRestaurantData) {
          // Use the same data structure for update as create (no field removal)
          await updateRestaurantMutation.mutateAsync({
            id: latestRestaurantData._id,
            data: validatedData,
          });
        } else {
          await createRestaurantMutation.mutateAsync(validatedData);
        }
        closeModal();
      } catch (error) {
        console.error("Failed to save restaurant:", error);
      }
    },
    [
      latestRestaurantData,
      updateRestaurantMutation,
      createRestaurantMutation,
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
    createRestaurantMutation.isPending ||
    updateRestaurantMutation.isPending ||
    isLoadingIndividualRestaurant ||
    isFetchingIndividualRestaurant;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>{t("restaurants.title")}</span>
            </h2>
            <p className="text-muted-foreground">{t("restaurants.subtitle")}</p>
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
                      : "active",
                );
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === "active"
                ? t("restaurants.active")
                : statusFilter === "inactive"
                  ? t("restaurants.inactive")
                  : t("restaurants.allStatus")}
            </Button>
            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t("restaurants.addNewRestaurant")}
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t("restaurants.errorLoading")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={restaurants}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("restaurants.searchPlaceholder")}
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

        {/* Create/Edit Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            latestRestaurantData
              ? t("restaurants.editRestaurant") || "Edit Restaurant"
              : t("restaurants.addRestaurant") || "Add Restaurant"
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            latestRestaurantData
              ? t("restaurants.updateRestaurant") || "Update Restaurant"
              : t("restaurants.createRestaurant") || "Create Restaurant"
          }
        >
          <RestaurantFormContent
            form={form}
            editingRestaurant={latestRestaurantData}
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
          loading={deleteRestaurantMutation.isPending}
        />
      </div>
    </Layout>
  );
}
