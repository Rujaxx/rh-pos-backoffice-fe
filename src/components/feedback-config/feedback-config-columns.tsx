'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FeedbackConfig } from '@/types/feedback-config.type';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TableActions } from '@/components/ui/table-actions';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';

export const createFeedbackConfigColumns = (
  onEdit: (config: FeedbackConfig) => void,
  onDelete: (config: FeedbackConfig) => void,
  t: ReturnType<typeof useTranslation>['t'],
  restaurantsMap: Record<string, string> = {},
): ColumnDef<FeedbackConfig>[] => [
  {
    accessorKey: 'campaignName',
    id: 'campaignName',
    header: t('feedbackConfig.campaignName') || 'Campaign Name',
    enableSorting: true,
    cell: ({ row }) => {
      const config = row.original;
      return (
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{config.campaignName}</span>
          {config.isDefault && (
            <Badge
              variant="outline"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              {t('feedbackConfig.default') || 'Default'}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'restaurantId',
    id: 'restaurant',
    header: t('feedbackConfig.restaurant') || 'Restaurant',
    enableSorting: false, // Not sortable unless backend supports it directly or we join
    cell: ({ row }) => {
      const restaurantId = row.original.restaurantId;
      const restaurantName = restaurantsMap[restaurantId] || restaurantId; // Fallback to ID
      return <div className="text-sm">{restaurantName}</div>;
    },
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: t('feedbackConfig.status') || 'Status',
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const config = row.original;
      return (
        <Badge variant={config.isActive ? 'default' : 'secondary'}>
          {config.isActive
            ? t('common.active') || 'Active'
            : t('common.inactive') || 'Inactive'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'sendFromLink',
    id: 'sendFromLink',
    header: t('feedbackConfig.sendVia') || 'Send Via',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.sendFromLink}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('common.createdAt') || 'Created',
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const config = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(config.createdAt)?.toLocaleDateString() || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions') || 'Actions',
    enableSorting: false,
    size: 100,
    cell: ({ row }) => {
      const config = row.original;

      return (
        <TableActions
          onEdit={() => onEdit(config)}
          onDelete={() => onDelete(config)}
          editLabel={t('common.edit') || 'Edit'}
          deleteLabel={t('common.delete') || 'Delete'}
          additionalActions={[
            {
              label: t('feedbackConfig.questions') || 'Manage Questions',
              onClick: () =>
                (window.location.href = `/feedback-config/${config._id}/questions`),
              icon: <MessageSquare className="h-4 w-4" />,
            },
          ]}
        />
      );
    },
  },
];

// Hook for using feedback config columns
export const useFeedbackConfigColumns = (
  onEdit: (config: FeedbackConfig) => void,
  onDelete: (config: FeedbackConfig) => void,
) => {
  const { t } = useTranslation();

  // Fetch active restaurants to build a map for display
  // In a real optimized app, this might be partial or cached, but effective here.
  const { data: restaurantsResponse } = useActiveRestaurants();
  const restaurants = restaurantsResponse?.data || [];

  const restaurantsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    restaurants.forEach((r) => {
      map[r._id] = r.name.en; // Defaulting to EN for map keys currently
    });
    return map;
  }, [restaurants]);

  return createFeedbackConfigColumns(onEdit, onDelete, t, restaurantsMap);
};
