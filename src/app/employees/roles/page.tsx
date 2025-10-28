'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { PaginationState, SortingState, ColumnDef } from '@tanstack/react-table';
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';
import {
  useRoleForm,
  RoleFormContent,
} from '@/components/employees/roles/role-form';
import Layout from '@/components/common/layout';
import { Edit, Plus, UserX, Trash2, Shield, UserCheck } from 'lucide-react';
import { UserRole, UserTableAction } from '@/types/user.type';
import { RoleFormData } from '@/lib/validations/role.validation';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';
import { mockRoles } from '@/mock/roles';

function RolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<UserRole[]>(mockRoles);
  const [loading, setLoading] = useState(false);
  // Table state
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const locale = useIntl().locale as 'en' | 'ar';

  // Modal hooks
  const {
    isOpen,
    editingItem: editingRole,
    openModal,
    closeModal,
  } = useModal<UserRole>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form, isEditing } = useRoleForm(editingRole);

  // Columns will be defined after handlers so action renderers can reference functions

  // Table actions configuration
  const actions: UserTableAction<UserRole>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      onClick: (role) => openModal(role),
      variant: 'default',
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      onClick: (role) => {
        openConfirmationModal(
          async () => {
            await handleDeleteRole(role._id!);
          },
          {
            title: t('roles.delete.title'),
            description: t('roles.delete.description', {
              name: role.name[locale],
            }),
            confirmButtonText: t('common.delete'),
            variant: 'destructive',
          }
        );
      },
      variant: 'destructive',
    },
  ];

  // CRUD Handlers
  const handleCreateRole = async (data: RoleFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRole: UserRole = {
        _id: Date.now().toString(),
        name: data.name,
        permissions: data.permissions,
        isActive: data.isActive,
      };

      setRoles((prev) => [newRole, ...prev]);
      toast.success(t('roles.create.success'));
    } catch (error) {
      console.error('Create role error:', error);
      toast.error(t('roles.create.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (data: RoleFormData) => {
    if (!editingRole?._id) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedRole: UserRole = {
        ...editingRole,
        name: data.name,
        permissions: data.permissions,
        isActive: data.isActive,
        updatedAt: new Date(),
      };

      setRoles((prev) =>
        prev.map((role) => (role._id === editingRole._id ? updatedRole : role))
      );
      toast.success(t('roles.update.success'));
    } catch (error) {
      console.error('Update role error:', error);
      toast.error(t('roles.update.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRoles((prev) => prev.filter((role) => role._id !== roleId));
      toast.success(t('roles.delete.success'));
    } catch (error) {
      console.error('Delete role error:', error);
      toast.error(t('roles.delete.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: RoleFormData) => {
    if (isEditing) {
      await handleUpdateRole(data);
    } else {
      await handleCreateRole(data);
    }
  };

  // ColumnDefs and actions column for TanStackTable
  const columns = React.useMemo<ColumnDef<UserRole>[]>(() => [
    {
      id: 'name',
      header: t('roles.table.name'),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">{row.original.name[locale]}</div>
            <div className="text-xs text-muted-foreground">ID: {row.original._id}</div>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'permissions',
      header: t('roles.table.permissions'),
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">
            {t('roles.permissions.count', { count: row.original.permissions.length })}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {row.original.permissions.slice(0, 3).map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                {t(`users.permissions.${permission}`)}
              </Badge>
            ))}
            {row.original.permissions.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{row.original.permissions.length - 3} more</Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: t('roles.table.status'),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? (
            <>
              <UserCheck className="w-3 h-3 mr-1" />
              {t('common.active')}
            </>
          ) : (
            <>
              <UserX className="w-3 h-3 mr-1" />
              {t('common.inactive')}
            </>
          )}
        </Badge>
      ),
      enableSorting: true,
    },
  ], [t, locale]);

  const actionsColumn = React.useMemo<ColumnDef<UserRole>[]>(() => [
    {
      id: 'actions',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => openModal(role)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                openConfirmationModal(
                  async () => {
                    await handleDeleteRole(role._id!);
                  },
                  {
                    title: t('roles.delete.title'),
                    description: t('roles.delete.description', { name: role.name[locale] }),
                    confirmButtonText: t('common.delete'),
                    variant: 'destructive',
                  }
                );
              }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [openModal, openConfirmationModal, handleDeleteRole, t, locale]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8" />
              {t('employees.roles.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('employees.roles.subtitle')}
            </p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('employees.roles.addRole')}
          </Button>
        </div>

        {/* Roles Table */}
        <Card>
          <CardContent>
            <TanStackTable
              data={roles}
              columns={[...columns, ...actionsColumn]}
              searchPlaceholder={t('employees.roles.searchPlaceholder')}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={setSorting}
              isLoading={loading}
            />
          </CardContent>
        </Card>

        {/* Role Form Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={isEditing ? t('roles.edit.title') : t('roles.create.title')}
          description={
            isEditing
              ? t('roles.edit.description')
              : t('roles.create.description')
          }
          form={form}
          onSubmit={handleSubmit}
          loading={loading}
          size="xl">
          <RoleFormContent form={form} />
        </CrudModal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig.title}
          description={confirmationConfig.description}
          loading={loading}
          confirmButtonText={confirmationConfig.confirmButtonText}
          cancelButtonText={t('common.cancel')}
          variant={confirmationConfig.variant}
        />
      </div>
    </Layout>
  );
}

export default RolesPage;
