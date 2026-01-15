'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  deleteDisabled?: boolean;
  deleteDisabledReason?: string;
  additionalActions?: ActionItem[];
}

/**
 * Reusable table actions component
 * Shows Edit and Delete as inline buttons, additional actions in dropdown
 */
export function TableActions({
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  deleteDisabled = false,
  additionalActions = [],
}: TableActionsProps) {
  const hasAdditionalActions = additionalActions.length > 0;

  return (
    <div className="flex items-center gap-1">
      {/* Edit Button */}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title={editLabel}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">{editLabel}</span>
        </Button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8',
            !deleteDisabled &&
              'text-destructive hover:text-destructive hover:bg-destructive/10',
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={deleteDisabled}
          title={deleteLabel}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{deleteLabel}</span>
        </Button>
      )}

      {/* Additional Actions Dropdown */}
      {hasAdditionalActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">More actions</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {additionalActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={cn(
                  'cursor-pointer',
                  action.variant === 'destructive' &&
                    'text-destructive focus:text-destructive',
                )}
                disabled={action.disabled}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
