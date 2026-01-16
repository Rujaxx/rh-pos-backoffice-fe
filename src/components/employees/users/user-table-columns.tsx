'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Phone, Mail, Calendar, UserCheck, UserX, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getFallbackAvatarUrl } from '@/lib/upload-utils';
import { useIntl } from 'react-intl';
import { User } from '@/types/user.type';
import { TableActions } from '@/components/ui/table-actions';

// Column definitions for the users table
export const createUserColumns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
  onPermissions: (user: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: t('users.table.user'),
    sortingFn: (rowA, rowB) => {
      // Sorting still uses 'en' for consistency
      const aValue = (rowA.original.name ?? '').toLowerCase();
      const bValue = (rowB.original.name ?? '').toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const user = row.original;
      const userName = user.name ?? user.username;
      return (
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image
              src={getFallbackAvatarUrl(user.name ?? user.username)}
              alt={userName}
              width={40}
              height={40}
              className="rounded-full object-cover border"
            />
          </div>
          <div className="space-y-1">
            <div className="font-medium text-sm">{userName}</div>
            <div className="text-xs text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: 'contact',
    header: t('users.table.contact'),
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          {user.phoneNumber && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="text-xs">{user.phoneNumber}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    id: 'role',
    header: t('users.table.role'),
    sortingFn: (rowA, rowB) => {
      // Sort by role's English name
      const aValue = (rowA.original.role?.name?.en ?? '').toLowerCase();
      const bValue = (rowB.original.role?.name?.en ?? '').toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant="outline" className="flex items-center w-fit">
          <UserCheck className="mr-1 h-3 w-3" />
          {user.role?.name?.[locale] ?? 'N/A'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'accountStatus',
    id: 'status',
    header: t('users.table.status'),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const user = row.original;

      const variant: 'default' | 'secondary' | 'destructive' =
        user.accountStatus === 'ACTIVE'
          ? 'default'
          : user.accountStatus === 'SUSPENDED'
            ? 'destructive'
            : 'secondary'; // INACTIVE

      const Icon = user.accountStatus === 'ACTIVE' ? UserCheck : UserX;

      return (
        <Badge variant={variant} className="flex items-center w-fit">
          <Icon className="mr-1 h-3 w-3" />
          {t(`users.accountStatus.${user.accountStatus}`)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('users.table.lastLogin'),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(user.createdAt)?.toLocaleDateString() || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: t('users.table.actions'),
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <TableActions
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
          editLabel={t('users.edit.title')}
          deleteLabel={t('common.delete')}
          additionalActions={[
            {
              label: t('users.permissions.title') || 'Permissions',
              onClick: () => onPermissions(user),
              icon: <Shield className="h-4 w-4" />,
            },
          ]}
        />
      );
    },
  },
];

// Hook for using user columns with current translation
export const useUserColumns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  onPermissions: (user: User) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useIntl();
  return createUserColumns(
    onEdit,
    onDelete,
    t,
    locale as 'en' | 'ar',
    onPermissions,
  );
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  const fieldMap: Record<string, string> = {
    name: 'name',
    role: 'role.name',
    status: 'accountStatus',
    createdAt: 'createdAt',
  };

  return fieldMap[sort.id] || sort.id;
};

// Helper function to get sort order from TanStack sorting state
export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? 'desc' : 'asc';
};
