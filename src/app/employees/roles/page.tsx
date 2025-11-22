"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  SortingState,
  PaginationState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TanStackTable } from "@/components/ui/tanstack-table";
import Layout from "@/components/common/layout";
import { Plus, Shield, Filter } from "lucide-react";
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from "@/components/ui/crud-modal";
import {
  useRoleForm,
  RoleFormContent,
} from "@/components/employees/roles/role-form";

import { useRoles, useRole } from "@/services/api/roles/roles.queries";

import { Role, RoleQueryParams } from "@/types/role.type";
import { RoleFormData, roleSchema } from "@/lib/validations/role.validation";
import {
  useRoleColumns,
  getSortOrderForQuery,
  getSortFieldForQuery,
} from "@/components/employees/roles/roles-table-columns";
import {
  useCreateRole,
  useDeleteRole,
  useUpdateRole,
} from "@/services/api/roles/roles.mutation";

export default function RolesPage() {
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

  // Build query parameters
  const queryParams = useMemo<RoleQueryParams>(() => {
    const params: RoleQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || "desc",
    };

    if (searchTerm.trim()) params.term = searchTerm.trim();

    const sortField = getSortFieldForQuery(sorting);
    if (sortField) {
      params.sortOrder = getSortOrderForQuery(sorting) || "desc";
    }

    if (statusFilter !== undefined)
      params.isActive = statusFilter === "active" ? "true" : "false";

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  // API hooks
  const { data: rolesResponse, isLoading, error } = useRoles(queryParams);
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const roles = rolesResponse?.data || [];
  const totalCount = rolesResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingRole,
    openModal,
    closeModal,
  } = useModal<Role>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Individual fetch when editing
  const roleId = editingRole?._id;
  const shouldFetchRole = isOpen && !!roleId;
  const { data: individualRoleResponse, isLoading: isLoadingRole } = useRole(
    roleId || "",
    { enabled: shouldFetchRole },
  );
  const latestRoleData = individualRoleResponse?.data || editingRole;

  // Form
  const { form } = useRoleForm(latestRoleData);

  // Handlers using refs to avoid column recreation
  const editHandlerRef = useRef<(role: Role) => void>(null);
  const deleteHandlerRef = useRef<(role: Role) => void>(null);

  const editHandler = useCallback(
    (role: Role) => editHandlerRef.current?.(role),
    [],
  );
  const deleteHandler = useCallback(
    (role: Role) => deleteHandlerRef.current?.(role),
    [],
  );

  const stableColumns = useRoleColumns(editHandler, deleteHandler);

  editHandlerRef.current = (role: Role) => openModal(role);
  deleteHandlerRef.current = (role: Role) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteRole.mutateAsync(role._id);
        } catch (err) {
          console.error("Failed to delete role:", err);
        }
      },
      {
        title: t("roles.deleteRole"),
        description: t("roles.deleteConfirmation", { name: role.name.en }),
        confirmButtonText: t("roles.deleteRoleButton"),
        variant: "destructive",
      },
    );
  };

  const handleSubmit = useCallback(
    async (data: RoleFormData) => {
      try {
        const validatedData = roleSchema.parse(data);
        if (latestRoleData) {
          await updateRole.mutateAsync({
            id: latestRoleData._id,
            data: validatedData,
          });
        } else {
          await createRole.mutateAsync(validatedData);
        }
        closeModal();
      } catch (err) {
        console.error("Failed to save role:", err);
      }
    },
    [latestRoleData, updateRole, createRole, closeModal],
  );

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePaginationChange = useCallback(
    (p: PaginationState) => setPagination(p),
    [],
  );
  const handleSortingChange = useCallback((s: SortingState) => {
    setSorting(s);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);
  const handleColumnFiltersChange = useCallback((f: ColumnFiltersState) => {
    setColumnFilters(f);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const isFormLoading =
    createRole.isPending || updateRole.isPending || isLoadingRole;

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              {/* No "roles.title" exists → using create title */}
              <span>{t("roles.create.title")}</span>
            </h2>

            {/* No "roles.subtitle" exists → using create description */}
            <p className="text-muted-foreground">
              {t("roles.create.description")}
            </p>
          </div>

          <div className="flex items-center space-x-2">
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
              {/* No keys exist for active/inactive/allStatus → using generic placeholders */}
              {statusFilter === "active"
                ? t("common.active")
                : statusFilter === "inactive"
                  ? t("common.inactive")
                  : t("common.filter.all")}
            </Button>

            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {/* No "roles.addNewRole" exists → using create title */}
              {t("roles.create.title")}
            </Button>
          </div>
        </div>

        {/* Roles Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {/* No "roles.errorLoading" exists → using roles.create.error */}
                  {t("roles.create.error")}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={roles}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t("roles.table.name")}
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
          // Fix: these keys do not exist, using the ones you provided
          title={latestRoleData ? t("common.edit") : t("common.create")}
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isFormLoading}
          submitButtonText={
            latestRoleData ? t("common.update") : t("common.create")
          }
        >
          <RoleFormContent form={form} />
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
          loading={deleteRole.isPending}
        />
      </div>
    </Layout>
  );
}
