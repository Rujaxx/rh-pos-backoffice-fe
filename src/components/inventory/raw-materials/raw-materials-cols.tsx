'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RawItem } from '@/types/raw-materials.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Pencil, Trash2, Eye, Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';

// Column definitions for the raw items table
export const createRawItemColumns = (
  onEdit: (item: RawItem) => void,
  onDelete: (item: RawItem) => void,
  onCopy: (item: RawItem) => void,
  onViewDetails: (item: RawItem) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
): ColumnDef<RawItem>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: t('rawMaterials.columns.name') || 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;
      return <div className="font-medium text-sm">{item.name}</div>;
    },
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: t('rawMaterials.columns.type') || 'Type',
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;
      // Format display text
      const typeDisplay =
        {
          RAW: t('rawMaterials.types.RAW') || 'Raw Material',
          SEMI: t('rawMaterials.types.SEMI') || 'Semi-Finished',
          FINISHED: t('rawMaterials.types.FINISHED') || 'Finished Product',
        }[item.type] || item.type;

      return (
        <Badge
          variant={
            item.type === 'RAW'
              ? 'secondary'
              : item.type === 'SEMI'
                ? 'outline'
                : 'default'
          }
        >
          {typeDisplay}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'baseUnit',
    id: 'unit',
    header: t('rawMaterials.columns.unit') || 'Unit',
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-sm uppercase text-muted-foreground">
          {item.baseUnit}
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: t('rawMaterials.columns.status') || 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={item.isActive ? 'default' : 'secondary'}>
          {item.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'modified',
    header: t('rawMaterials.columns.modified') || 'Last Modified',
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(item.updatedAt)?.toLocaleDateString() || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions') || 'Actions',
    enableSorting: false,
    size: 140,
    cell: ({ row }) => {
      const item = row.original;

      const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetails(item);
      };

      const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(item);
      };

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            title={t('rawMaterials.viewDetails') || 'View Details'}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title={t('rawMaterials.copy') || 'Copy'}
            className="h-7 w-7 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            title={t('rawMaterials.edit') || 'Edit'}
            className="h-7 w-7 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            title={t('rawMaterials.delete') || 'Delete'}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// Hook for using raw item columns with current translation
export const useRawItemColumns = (
  onEdit: (item: RawItem) => void,
  onDelete: (item: RawItem) => void,
  onCopy: (item: RawItem) => void,
  onViewDetails: (item: RawItem) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createRawItemColumns(
    onEdit,
    onDelete,
    onCopy,
    onViewDetails,
    t,
    locale,
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
    type: 'type',
    unit: 'baseUnit',
    status: 'isActive',
    modified: 'updatedAt',
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
