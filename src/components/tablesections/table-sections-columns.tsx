"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useI18n } from "@/providers/i18n-provider";
import { TableSection } from "@/types/table-section.type";
import { MultilingualText } from "@/types";

export const createTableSectionColumns = (
  onEdit: (tableSection: TableSection) => void,
  onDelete: (tableSection: TableSection) => void,
  t: ReturnType<typeof useTranslation>["t"],
  locale: string
): ColumnDef<TableSection>[] => {
  return [
    // Section Name
    {
      accessorKey: "name",
      id: "name",
      header: t("tableSections.name"),
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const aValue = (rowA.original.name.en || "").toLowerCase();
        const bValue = (rowB.original.name.en || "").toLowerCase();
        return aValue.localeCompare(bValue);
      },
      cell: ({ row }) => {
        const section = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{section.name.en}</div>
            {section.name.ar && (
              <div className="text-xs text-muted-foreground" dir="rtl">
                {section.name.ar}
              </div>
            )}
          </div>
        );
      },
    },

    // Restaurant
    {
      id: "restaurantName",
      header: t("table.restaurant"),
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div className="font-medium text-foreground truncate">
            {table.restaurantName?.[locale as keyof MultilingualText] ||
              table.restaurantName?.en ||
              "N/A"}
          </div>
        );
      },
    },

    // Status
    {
      id: "status",
      header: t("common.status"),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? t("common.active") : t("common.inactive")}
          </Badge>
        );
      },
    },

    // Actions
    {
      id: "actions",
      header: t("table.actions"),
      enableSorting: false,
      size: 80,
      cell: ({ row }) => {
        const section = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(section);
                }}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(section);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

// Hook wrapper (matches table columns pattern)
export const useTableSectionColumns = (
  onEdit: (tableSection: TableSection) => void,
  onDelete: (tableSection: TableSection) => void
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return createTableSectionColumns(onEdit, onDelete, t, locale);
};

// Map TanStack → backend sorting fields
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];

  const fieldMap: Record<string, string> = {
    name: "name.en",
    restaurantName: "restaurantName",
    status: "isActive",
  };

  return fieldMap[sort.id] || sort.id;
};

// Sort order translator
export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>
): "asc" | "desc" | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? "desc" : "asc";
};
