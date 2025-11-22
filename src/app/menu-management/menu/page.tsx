"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/common/layout";

import {
  CrudModal,
  ConfirmationModal,
  useModal,
  useConfirmationModal,
} from "@/components/ui/crud-modal";

import {
  MenuFormContent,
  useMenuForm,
} from "@/components/menu-management/menu/menu-form";

import { TanStackTable } from "@/components/ui/tanstack-table";

import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Plus, UtensilsCrossed, Filter } from "lucide-react";
import { Menu, MenuFormData, MenuQueryParams } from "@/types/menu.type";
import { useMenus, useMenu } from "@/services/api/menus/menus.queries";
import {
  useCreateMenu,
  useDeleteMenu,
  useUpdateMenu,
} from "@/services/api/menus/menus.mutation";
import {
  getSortOrderForQuery,
  getSortFieldForQuery,
  useMenuColumns,
} from "@/components/menu-management/menu/menu-table-columns";

export default function MenusPage() {
  const { t } = useTranslation();

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

  const queryParams = useMemo<MenuQueryParams>(() => {
    const params: MenuQueryParams = {
      page: pagination.pageIndex + 1,
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

  const { data: menusResponse, isLoading, error } = useMenus(queryParams);

  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();
  const deleteMenuMutation = useDeleteMenu();

  const menus = menusResponse?.data || [];
  const totalCount = menusResponse?.meta?.total || 0;

  const {
    isOpen,
    editingItem: editingMenu,
    openModal,
    closeModal,
  } = useModal<Menu>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  const menuId = editingMenu?._id;
  const shouldFetchMenu = isOpen && !!menuId;

  const {
    data: individualMenuResponse,
    isLoading: isLoadingIndividualMenu,
    isFetching: isFetchingIndividualMenu,
  } = useMenu(menuId || "", {
    enabled: shouldFetchMenu,
  });

  const latestMenuData = individualMenuResponse?.data || editingMenu;

  // Form hook (hydrated)
  const { form } = useMenuForm(latestMenuData);

  const editHandlerRef = useRef<((menu: Menu) => void) | null>(null);
  const deleteHandlerRef = useRef<((menu: Menu) => void) | null>(null);

  const editHandler = useCallback((menu: Menu) => {
    editHandlerRef.current?.(menu);
  }, []);

  const deleteHandler = useCallback((menu: Menu) => {
    deleteHandlerRef.current?.(menu);
  }, []);

  const stableColumns = useMenuColumns(editHandler, deleteHandler);

  editHandlerRef.current = (menu: Menu) => {
    openModal(menu);
  };

  deleteHandlerRef.current = (menu: Menu) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteMenuMutation.mutateAsync(menu._id!);
        } catch (err) {
          console.error("Failed to delete menu:", err);
        }
      },
      {
        title: t("menus.delete.title"),
        description: t("menus.delete.description", {
          name: menu.name.en,
        }),
        confirmButtonText: t("common.delete"),
        variant: "destructive",
      }
    );
  };

  const handleSubmit = useCallback(
    async (data: MenuFormData) => {
      try {
        if (latestMenuData?._id) {
          await updateMenuMutation.mutateAsync({
            id: latestMenuData._id,
            data,
          });
        } else {
          await createMenuMutation.mutateAsync(data);
        }

        closeModal();
      } catch (err) {
        console.error("Failed to save menu:", err);
      }
    },
    [latestMenuData, updateMenuMutation, createMenuMutation, closeModal]
  );

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    []
  );

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  const isFormLoading =
    createMenuMutation.isPending ||
    updateMenuMutation.isPending ||
    isLoadingIndividualMenu ||
    isFetchingIndividualMenu;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              {t("menus.title")}
            </h2>
            <p className="text-muted-foreground">{t("menus.subtitle")}</p>
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
              className="h-8 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>
                {statusFilter === "active"
                  ? t("brands.active")
                  : statusFilter === "inactive"
                    ? t("brands.inactive")
                    : t("brands.allStatus")}
              </span>
            </Button>
            <Button
              onClick={() => openModal()}
              className="h-8 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t("brands.addNewBrand")}</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t("menus.errorLoading")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={menus}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("menus.searchPlaceholder")}
                onSearchChange={handleSearchChange}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                sorting={sorting}
                onSortingChange={handleSortingChange}
                columnFilters={columnFilters}
                onColumnFiltersChange={handleColumnFiltersChange}
                manualPagination
                manualSorting
                manualFiltering
                showSearch
                showPagination
                showPageSizeSelector
                emptyMessage={t("menus.noDataFound")}
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>

        {/* Form Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            latestMenuData ? t("menus.edit.title") : t("menus.create.title")
          }
          description={
            latestMenuData
              ? t("menus.edit.description")
              : t("menus.create.description")
          }
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          size="xl"
          submitButtonText={
            latestMenuData ? t("menus.edit.submit") : t("menus.create.submit")
          }
        >
          <MenuFormContent form={form} />
        </CrudModal>

        {/* Delete Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteMenuMutation.isPending}
        />
      </div>
    </Layout>
  );
}
