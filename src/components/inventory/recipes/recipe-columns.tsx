'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Recipe } from '@/types/recipes.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// Column definitions for the recipe table
export const createRecipeColumns = (
  onEdit: (recipe: Recipe) => void,
  onDelete: (recipe: Recipe) => void,
  onViewDetails: (recipe: Recipe) => void,
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<Recipe>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: t('recipes.table.name') || 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      const recipe = row.original;
      return (
        <div className="font-medium text-sm">{recipe.name?.en || '-'}</div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'modified',
    header: t('recipes.table.modified') || 'Modified',
    enableSorting: true,
    cell: ({ row }) => {
      const recipe = row.original;
      return (
        <div className="flex flex-col space-y-1">
          <div className="text-xs text-muted-foreground">
            Created: {new Date(recipe.createdAt)?.toLocaleDateString() || 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">
            Modified:{' '}
            {new Date(recipe.updatedAt)?.toLocaleDateString() || 'N/A'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdBy',
    id: 'createdBy',
    header: t('recipes.table.createdBy') || 'Created/Modified By',
    enableSorting: false,
    cell: ({ row }) => {
      const recipe = row.original;
      return (
        <div className="flex flex-col">
          <div className="text-sm">{recipe.createdBy || '-'}</div>
          {recipe.updatedBy && recipe.updatedBy !== recipe.createdBy && (
            <div className="text-xs text-muted-foreground">
              Modified by: {recipe.updatedBy}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: t('recipes.table.status') || 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const recipe = row.original;
      return (
        <Badge variant={recipe.isActive ? 'default' : 'secondary'}>
          {recipe.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions') || 'Actions',
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const recipe = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(recipe);
            }}
            title={t('recipes.actions.viewDetails') || 'View Details'}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(recipe);
            }}
            title={t('recipes.actions.edit') || 'Edit'}
            className="h-7 w-7 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe);
            }}
            title={t('recipes.actions.delete') || 'Delete'}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// Hook for using recipe columns with current translation
export const useRecipeColumns = (
  onEdit: (recipe: Recipe) => void,
  onDelete: (recipe: Recipe) => void,
  onViewDetails: (recipe: Recipe) => void,
) => {
  const { t } = useTranslation();
  return createRecipeColumns(onEdit, onDelete, onViewDetails, t);
};
