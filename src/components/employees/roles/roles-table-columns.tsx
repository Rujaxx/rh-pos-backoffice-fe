'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Role } from '@/types/role.type';
import { Permission } from '@/types/permission.type';
import { TableActions } from '@/components/ui/table-actions';

// Table columns definition
export const createRoleColumns = (
  onEdit: (role: Role) => void,
  onDelete: (role: Role) => void,
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<Role>[] => [
  {
    id: 'icon',
    header: '',
    size: 60,
    enableSorting: false,
    cell: () => (
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Shield className="w-4 h-4 text-primary" />
      </div>
    ),
  },
  {
    accessorKey: 'name.en',
    id: 'name',
    header: t('roles.table.name'),
    enableSorting: true,
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div>
          <div className="font-medium text-sm">{role.name.en ?? '—'}</div>
          {role.name.ar && (
            <div className="text-xs text-muted-foreground" dir="rtl">
              {role.name.ar}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'permissions',
    header: t('roles.table.permissions'),
    enableSorting: false,
    cell: ({ row }) => {
      const { permissions } = row.original;
      const shown = permissions.slice(0, 3);
      return (
        <div className="text-sm space-y-1">
          <div className="font-medium">
            {t('roles.permissions.count', { count: permissions.length })}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {shown.map((perm: Permission) => (
              <Badge key={perm._id} variant="outline" className="text-xs">
                {t(`users.permissions.${perm.name}`)}
              </Badge>
            ))}
            {permissions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{permissions.length - 3}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions'),
    enableSorting: false,
    size: 100,
    cell: ({ row }) => {
      const role = row.original;

      return (
        <TableActions
          onEdit={() => onEdit(role)}
          onDelete={() => onDelete(role)}
          editLabel={t('common.edit')}
          deleteLabel={t('common.delete')}
        />
      );
    },
  },
];

// Hook for current translation
export const useRoleColumns = (
  onEdit: (role: Role) => void,
  onDelete: (role: Role) => void,
) => {
  const { t } = useTranslation();
  return createRoleColumns(onEdit, onDelete, t);
};

// Sorting helpers
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;
  const sort = sorting[0];
  const fieldMap: Record<string, string> = {
    name: 'name.en',
    createdAt: 'createdAt',
  };
  return fieldMap[sort.id] || sort.id;
};

export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? 'desc' : 'asc';
};
