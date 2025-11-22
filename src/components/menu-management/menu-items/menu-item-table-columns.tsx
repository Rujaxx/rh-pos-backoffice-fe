"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MenuItem } from "@/types/menu-item.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tag,
  Star,
  Edit,
  Hash,
  Trash2,
  XCircle,
  Percent,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useI18n } from "@/providers/i18n-provider";
import { MultilingualText } from "@/types";

export const foodTypeColors = {
  VEG: "bg-green-100 text-green-800 border-green-300",
  NON_VEG: "bg-red-100 text-red-800 border-red-300",
  VEGAN: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export const meatTypeColors = {
  VEG: "bg-green-50 text-green-700",
  CHICKEN: "bg-orange-50 text-orange-700",
  MUTTON: "bg-red-50 text-red-700",
  FISH: "bg-blue-50 text-blue-700",
};

// Column definitions for the menu items table
export const createMenuItemColumns = (
  onEdit: (menuItem: MenuItem) => void,
  onDelete: (menuItem: MenuItem) => void,
  t: ReturnType<typeof useTranslation>["t"],
  locale: string,
): ColumnDef<MenuItem>[] => [
  {
    accessorKey: "itemName",
    id: "itemName",
    header: t("menuItems.table.itemName"),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aValue = (rowA.original.itemName.en || "").toLowerCase();
      const bValue = (rowB.original.itemName.en || "").toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="space-y-1 min-w-[200px]">
          <div className="font-medium text-sm flex items-center space-x-2">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <span>
              {menuItem.itemName?.[locale as keyof MultilingualText] ||
                menuItem.itemName.en}
            </span>
            {menuItem.isRecommended && (
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            )}
            {menuItem.isCombo && <Tag className="h-3 w-3 text-blue-500" />}
          </div>
        </div>
      );
    },
  },

  {
    id: "shortCode",
    header: t("menuItems.table.shortCode"),
    size: 120,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="flex items-center space-x-1">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">{menuItem.shortCode}</span>
        </div>
      );
    },
  },

  {
    id: "menu",
    header: t("menuItems.table.menu"),
    size: 150,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="space-y-1">
          {menuItem.menuName?.en && (
            <span className="text-sm">
              {menuItem.menuName?.[locale as keyof MultilingualText] ||
                menuItem.menuName.en}
            </span>
          )}
        </div>
      );
    },
  },

  {
    id: "category",
    header: t("menuItems.table.category"),
    size: 150,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="space-y-1">
          {menuItem.categoryName?.en && (
            <span className="text-sm">
              {menuItem.categoryName?.[locale as keyof MultilingualText] ||
                menuItem.categoryName.en}
            </span>
          )}
        </div>
      );
    },
  },

  {
    id: "subCategory",
    header: t("menuItems.table.subCategory"),
    size: 150,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="space-y-1">
          {menuItem.subCategoryName?.en && (
            <div className="text-xs text-muted-foreground">
              →{" "}
              {menuItem.subCategoryName?.[locale as keyof MultilingualText] ||
                menuItem.subCategoryName.en}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "baseItemPrice",
    id: "baseItemPrice",
    header: t("menuItems.table.basePrice"),
    enableSorting: true,
    size: 140,
    cell: ({ row }) => {
      const menuItem = row.original;
      const hasDiscount = menuItem.digitalDiscount && menuItem.discountedPrice;

      return (
        <div className="space-y-1">
          <div className="font-medium text-sm flex items-center space-x-1">
            <span>SAR {menuItem.baseItemPrice.toFixed(2)}</span>
          </div>
          {hasDiscount && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <Percent className="h-3 w-3" />
              <span className="line-through text-muted-foreground">
                SAR {menuItem.baseItemPrice.toFixed(2)}
              </span>
              <span className="font-medium">
                SAR {menuItem.discountedPrice!.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      );
    },
  },

  {
    id: "foodType",
    header: t("menuItems.table.foodType"),
    size: 140,
    cell: ({ row }) => {
      const menuItem = row.original;

      return (
        <div className="flex flex-col gap-1">
          {menuItem.foodType && (
            <Badge
              variant="outline"
              className={`text-xs ${foodTypeColors[menuItem.foodType]}`}
            >
              {t(`menuItems.foodTypes.${menuItem.foodType}`)}
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "meatType",
    header: t("menuItems.table.meatType"),
    size: 140,
    cell: ({ row }) => {
      const menuItem = row.original;

      return (
        <div className="flex flex-col gap-1">
          {menuItem.meatType && (
            <Badge
              variant="outline"
              className={`text-xs ${meatTypeColors[menuItem.meatType]}`}
            >
              {t(`menuItems.meatTypes.${menuItem.meatType}`)}
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "currentStock",
    id: "currentStock",
    header: t("menuItems.table.stock"),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const menuItem = row.original;
      const isLowStock = menuItem.currentStock < 10;
      const isOutOfStock = menuItem.currentStock === 0;

      return (
        <div className="flex items-center space-x-1">
          {isOutOfStock ? (
            <XCircle className="h-4 w-4 text-red-600" />
          ) : isLowStock ? (
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          <span
            className={`text-sm font-medium ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                  ? "text-orange-600"
                  : "text-green-600"
            }`}
          >
            {menuItem.currentStock}
          </span>
        </div>
      );
    },
  },

  {
    id: "kitchenDepartment",
    header: t("menuItems.table.kitchenDepartment"),
    size: 150,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="space-y-1">
          {menuItem.kitchenDepartmentName?.en && (
            <span className="text-sm">{menuItem.kitchenDepartmentName.en}</span>
          )}
          {menuItem.kitchenDepartmentName?.ar && (
            <div className="text-xs text-muted-foreground" dir="rtl">
              {menuItem.kitchenDepartmentName.ar}
            </div>
          )}
          {menuItem.preparationTime && (
            <div className="text-xs text-muted-foreground">
              {menuItem.preparationTime} {t("menuItems.table.minutes")}
            </div>
          )}
        </div>
      );
    },
  },

  {
    id: "status",
    header: t("menuItems.table.status"),
    size: 200,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant={menuItem.isActive ? "default" : "secondary"}>
            {menuItem.isActive
              ? t("menuItems.status.active")
              : t("menuItems.status.inactive")}
          </Badge>
          {menuItem.posStatus && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-300"
            >
              {t("menuItems.status.pos")}
            </Badge>
          )}
          {menuItem.platformStatus && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-300"
            >
              {t("menuItems.status.platform")}
            </Badge>
          )}
          {menuItem.isRecommended && (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-300"
            >
              {t("menuItems.status.recommended")}
            </Badge>
          )}
          {menuItem.isCombo && (
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-700 border-indigo-300"
            >
              {t("menuItems.status.combo")}
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "taxInfo",
    header: t("menuItems.table.taxInfo"),
    size: 150,
    cell: ({ row }) => {
      const menuItem = row.original;
      const taxInfo = menuItem.taxProductGroupInfo;

      return (
        <div className="space-y-1">
          {taxInfo?.name?.en && (
            <span className="text-sm">{taxInfo.name.en}</span>
          )}
          {taxInfo && (
            <div className="text-xs text-muted-foreground">
              {taxInfo.taxType === "Percentage"
                ? `${taxInfo.taxValue}%`
                : `SAR ${taxInfo.taxValue}`}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: t("menuItems.table.created"),
    enableSorting: true,
    size: 140,
    cell: ({ row }) => {
      const menuItem = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {menuItem.createdAt
              ? new Date(menuItem.createdAt).toLocaleDateString()
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
      const menuItem = row.original;

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
                onEdit(menuItem);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("menuItems.table.edit")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(menuItem);
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("menuItems.table.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Hook for using menu item columns with current translation
export const useMenuItemColumns = (
  onEdit: (menuItem: MenuItem) => void,
  onDelete: (menuItem: MenuItem) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createMenuItemColumns(onEdit, onDelete, t, locale);
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  // Map TanStack column IDs to backend field names
  const fieldMap: Record<string, string> = {
    itemName: "itemName.en",
    shortCode: "shortCode",
    baseItemPrice: "baseItemPrice",
    currentStock: "currentStock",
    createdAt: "createdAt",
  };

  return fieldMap[sort.id] || sort.id;
};

// Helper function to get sort order from TanStack sorting state
export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): "asc" | "desc" | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? "desc" : "asc";
};
