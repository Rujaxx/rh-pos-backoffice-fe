"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Menu } from "@/types/menu.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Hash,
  Calendar,
  UtensilsCrossed,
  Smartphone,
  Monitor,
  Radio,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Column definitions for the menus table
export const createMenuColumns = (
  onEdit: (menu: Menu) => void,
  onDelete: (menu: Menu) => void,
  t: ReturnType<typeof useTranslation>["t"],
): ColumnDef<Menu>[] => [
  {
    accessorKey: "name",
    id: "name",
    header: t("menus.table.name"),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aValue = (rowA.original.name?.en || "").toLowerCase();
      const bValue = (rowB.original.name?.en || "").toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm flex items-center space-x-2">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <span>{menu.name.en}</span>
          </div>
          {menu.name.ar && (
            <div className="text-xs text-muted-foreground" dir="rtl">
              {menu.name.ar}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "shortCode",
    id: "shortCode",
    header: t("menus.table.shortCode"),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <div className="flex items-center space-x-1">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">{menu.shortCode}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "isActive",
    id: "isActive",
    header: t("menus.table.status"),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <Badge variant={menu.isActive ? "default" : "secondary"}>
          {menu.isActive ? t("common.active") : t("common.inactive")}
        </Badge>
      );
    },
  },

  {
    accessorKey: "isPosDefault",
    id: "isPosDefault",
    header: t("menus.table.posDefault"),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const menu = row.original;
      return menu.isPosDefault ? (
        <Badge variant="default">{t("menus.table.pos")}</Badge>
      ) : (
        <Badge variant="secondary">{t("common.no")}</Badge>
      );
    },
  },

  {
    accessorKey: "isDigitalDefault",
    id: "isDigitalDefault",
    header: t("menus.table.digitalDefault"),
    enableSorting: true,
    size: 140,
    cell: ({ row }) => {
      const menu = row.original;
      return menu.isDigitalDefault ? (
        <Badge variant="default">{t("menus.table.digital")}</Badge>
      ) : (
        <Badge variant="secondary">{t("common.no")}</Badge>
      );
    },
  },
  {
    accessorKey: "menuItemCount",
    id: "menuItemCount",
    header: t("menus.table.itemCount"),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {menu.menuItemCount ?? 0}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: t("menus.table.created"),
    enableSorting: true,
    size: 140,
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {menu.createdAt
              ? new Date(menu.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: t("table.actions"),
    enableSorting: false,
    size: 80,
    cell: ({ row }) => {
      const menu = row.original;

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
                onEdit(menu);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("menus.table.edit")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(menu);
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
              disabled={menu.isActive} // prevent deleting active menu
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("menus.table.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const useMenuColumns = (
  onEdit: (menu: Menu) => void,
  onDelete: (menu: Menu) => void,
) => {
  const { t } = useTranslation();
  return createMenuColumns(onEdit, onDelete, t);
};

export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const fieldMap: Record<string, string> = {
    name: "name.en",
    shortCode: "shortCode",
    isActive: "isActive",
    isPosDefault: "isPosDefault",
    isDigitalDefault: "isDigitalDefault",
    menuItemCount: "menuItemCount",
    createdAt: "createdAt",
  };

  return fieldMap[sorting[0].id] || sorting[0].id;
};

export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): "asc" | "desc" | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? "desc" : "asc";
};
