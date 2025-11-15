/**
 * Table Sections Table Columns
 * Column definitions for table sections data table with TanStack Table
 */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useI18n } from "@/providers/i18n-provider";
import { TableSection } from "@/types/tablesection.type";

interface TableSectionColumnsProps {
  onEdit?: (tableSection: TableSection) => void;
  onDelete?: (tableSection: TableSection) => void;
  onView?: (tableSection: TableSection) => void;
}

export const useTableSectionColumns = ({
  onEdit,
  onDelete,
  onView,
}: TableSectionColumnsProps = {}): ColumnDef<TableSection>[] => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  const columns: ColumnDef<TableSection>[] = [
    // Name column
    {
      accessorKey: "name",
      header: t("tableSections.name"),
      enableSorting: true,
      cell: ({ row }) => {
        const tableSection = row.original;
        const name = tableSection.name;
        const displayName = name[locale] || name.en;
        return <div className="font-medium">{displayName || "-"}</div>;
      },
    },

    // Restaurant column
    {
      accessorKey: "restaurantName",
      header: t("tableSections.restaurant"),
      enableSorting: true,
      cell: ({ row }) => {
        const restaurantName = row.original.restaurantName;
        const displayName =
          typeof restaurantName === "object" && restaurantName !== null
            ? restaurantName[locale] ||
              restaurantName.en ||
              Object.values(restaurantName)[0]
            : restaurantName;

        return <div className="font-medium">{displayName || "-"}</div>;
      },
    },

    // Status column
    {
      accessorKey: "isActive",
      header: t("common.status"),
      enableSorting: true,
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>("isActive");
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? t("common.active") : t("common.inactive")}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    // Actions column
    {
      id: "actions",
      header: t("table.actions"),
      enableSorting: false,
      size: 80,
      cell: ({ row }) => {
        const tableSection = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(tableSection);
                  }}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t("common.view")}
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(tableSection);
                  }}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tableSection);
                  }}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
