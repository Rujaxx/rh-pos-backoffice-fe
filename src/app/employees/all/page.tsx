'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  SortingState,
  PaginationState,
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
  useUserForm,
  UserFormContent,
} from '@/components/employees/users/user-form';

import Layout from '@/components/common/layout';
import { Plus, Users, Filter } from 'lucide-react';
import { UserFormData, userSchema } from '@/lib/validations/user.validation';
import {
  useUserColumns,
  getSortFieldForQuery,
  getSortOrderForQuery,
} from '@/components/employees/users/user-table-columns';
import { useUser, useUsers } from '@/services/api/users/users.queries';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '@/services/api/users/users.mutations';
import { User, UserQueryParams } from '@/types/user.type';

export default function UsersPage() {
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

  const queryParams = useMemo<UserQueryParams>(() => {
    const params: UserQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || 'desc',
    };

    if (searchTerm.trim()) {
      params.term = searchTerm.trim();
    }

    const sortField = getSortFieldForQuery(sorting);
    if (sortField) {
      params.sortOrder = getSortOrderForQuery(sorting) || 'desc';
    }

    if (statusFilter !== undefined) {
      params.accountStatus = statusFilter as UserQueryParams['accountStatus'];
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter]);

  const { data: usersResponse, isLoading, error } = useUsers(queryParams);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Extract data from response
  const users = usersResponse?.data || [];
  const totalCount = usersResponse?.meta?.total || 0;

  // Modal hooks
  const {
    isOpen,
    editingItem: editingUser,
    openModal,
    closeModal,
  } = useModal<User>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Fetch individual user data when editing
  const userId = editingUser?._id;
  const shouldFetchUser = isOpen && !!userId;

  const {
    data: individualUserResponse,
    isLoading: isLoadingIndividualUser,
    isFetching: isFetchingIndividualUser,
  } = useUser(userId || '', { enabled: shouldFetchUser });

  const latestUserData: User | null =
    individualUserResponse?.data || editingUser;

  // Form hook
  const { form } = useUserForm(latestUserData);

  const editHandlerRef = useRef<((user: User) => void) | null>(null);
  const deleteHandlerRef = useRef<((user: User) => void) | null>(null);

  const editHandler = useCallback((user: User) => {
    editHandlerRef.current?.(user);
  }, []);

  const deleteHandler = useCallback((user: User) => {
    deleteHandlerRef.current?.(user);
  }, []);

  const stableColumns = useUserColumns(editHandler, deleteHandler);

  // Update refs on each render
  editHandlerRef.current = (user: User) => {
    openModal(user);
  };

  deleteHandlerRef.current = (user: User) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteUserMutation.mutateAsync(user._id);
        } catch (error) {
          console.error('Failed to delete user:', error);
        }
      },
      {
        title: t('users.delete.title'),
        description: t('users.delete.description', {
          name: user.name ?? user.username,
        }),
        confirmButtonText: t('common.delete'),
        variant: 'destructive',
      },
    );
  };

  // Form submit handler
  const handleSubmit = useCallback(
    async (data: UserFormData) => {
      try {
        const validatedData = userSchema.parse(data);

        if (latestUserData) {
          await updateUserMutation.mutateAsync({
            id: latestUserData._id,
            data: validatedData,
          });
        } else {
          await createUserMutation.mutateAsync(validatedData);
        }
        closeModal();
      } catch (error) {
        console.error('Failed to save user:', error);
      }
    },
    [latestUserData, updateUserMutation, createUserMutation, closeModal],
  );

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
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
    [],
  );

  const isFormLoading =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    isLoadingIndividualUser ||
    isFetchingIndividualUser;
  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>{t('users.title')}</span>
            </h2>
            <p className="text-muted-foreground">{t('users.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Status Filter Button */}
            <Button
              variant={statusFilter !== undefined ? 'default' : 'outline'}
              onClick={() => {
                // Cycle: All -> Active -> Inactive -> Suspended -> All
                const nextStatus =
                  statusFilter === undefined
                    ? 'ACTIVE'
                    : statusFilter === 'ACTIVE'
                      ? 'INACTIVE'
                      : statusFilter === 'INACTIVE'
                        ? 'SUSPENDED'
                        : undefined;
                setStatusFilter(nextStatus);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === 'ACTIVE'
                ? t('users.accountStatus.ACTIVE')
                : statusFilter === 'INACTIVE'
                  ? t('users.accountStatus.INACTIVE')
                  : statusFilter === 'SUSPENDED'
                    ? t('users.accountStatus.SUSPENDED')
                    : t('users.allStatus')}
            </Button>

            {/* Add User Button */}
            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t('users.addUser')}
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            {error ? (
              <div className="flex items-center justify-center h-64 text-destructive">
                <p>
                  {t('users.errorLoading')}: {error.message}
                </p>
              </div>
            ) : (
              <TanStackTable
                data={users}
                columns={stableColumns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={t('users.searchPlaceholder')}
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
            latestUserData
              ? t('users.edit.title') || 'Edit User'
              : t('users.addUser') || 'Add User'
          }
          size="xl" // Good size for a user form
          form={form} // Pass the form object
          onSubmit={handleSubmit} // Pass the submit handler
          loading={isFormLoading}
          submitButtonText={
            latestUserData
              ? t('common.update') || 'Update User'
              : t('common.create') || 'Create User'
          }
        >
          <UserFormContent form={form} />
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
          loading={deleteUserMutation.isPending}
        />
      </div>
    </Layout>
  );
}
