"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Restaurant } from "@/types/restaurant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { getS3UrlFromKey, getFallbackAvatarUrl } from "@/lib/upload-utils";

// Column definitions for the restaurants table
export const createRestaurantColumns = (
  onEdit: (restaurant: Restaurant) => void,
  onDelete: (restaurant: Restaurant) => void,
  t: ReturnType<typeof useTranslation>["t"],
): ColumnDef<Restaurant>[] => [
  {
    id: "logo",
    header: t("restaurants.logo"),
    size: 80,
    enableSorting: false,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <Image
              src={
                getS3UrlFromKey(restaurant.logo) ||
                getFallbackAvatarUrl(restaurant.name?.en ?? "")
              }
              alt={restaurant.name?.en ?? "Restaurant"}
              width={40}
              height={40}
              className="rounded-md object-cover border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackAvatarUrl(restaurant.name?.en ?? "");
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    id: "name",
    header: t("restaurants.name"),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aValue = (rowA.original.name?.en ?? "").toLowerCase();
      const bValue = (rowB.original.name?.en ?? "").toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">
            {restaurant.name?.en ?? "—"}
          </div>
          {restaurant.name?.ar && (
            <div className="text-xs text-muted-foreground" dir="rtl">
              {restaurant.name.ar}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "brandName",
    id: "brand",
    header: t("restaurants.brand"),
    enableSorting: true,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <Badge variant="outline">{restaurant.brandName?.en ?? "N/A"}</Badge>
      );
    },
  },
  {
    accessorKey: "restoCode",
    id: "restoCode",
    header: t("restaurants.restoCode"),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="font-mono text-sm">{restaurant.restoCode || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "isActive",
    id: "status",
    header: t("restaurants.status"),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <Badge variant={restaurant.isActive ? "default" : "secondary"}>
          {restaurant.isActive
            ? t("restaurants.active")
            : t("restaurants.inactive")}
        </Badge>
      );
    },
  },
  {
    id: "location",
    header: t("restaurants.location"),
    enableSorting: false,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]">
              {restaurant.address?.city}, {restaurant.address?.country}
            </span>
          </div>
          {restaurant.timezone && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{restaurant.timezone}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "contact",
    header: t("restaurants.contact"),
    enableSorting: false,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="text-sm space-y-1">
          {restaurant.notificationPhone.length > 0 && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{restaurant.notificationPhone[0]}</span>
            </div>
          )}
          {restaurant.notificationEmails.length > 0 && (
            <div className="text-muted-foreground text-xs truncate max-w-[150px]">
              {restaurant.notificationEmails[0]}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "resetBill",
    header: t("restaurants.nextResetBill"),
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="text-sm">
          <Badge variant="outline">
            {t(`restaurants.resetBill.${restaurant.nextResetBillFreq}`)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: t("restaurants.created"),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(restaurant.createdAt)?.toLocaleDateString() || "N/A"}
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
      const restaurant = row.original;

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
                onEdit(restaurant);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("restaurants.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(restaurant);
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
              disabled={restaurant.isActive ?? false} // Don't allow deleting active restaurants
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("restaurants.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Hook for using restaurant columns with current translation
export const useRestaurantColumns = (
  onEdit: (restaurant: Restaurant) => void,
  onDelete: (restaurant: Restaurant) => void,
) => {
  const { t } = useTranslation();
  return createRestaurantColumns(onEdit, onDelete, t);
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  // Map TanStack column IDs to backend field names
  const fieldMap: Record<string, string> = {
    name: "name.en", // Sort by English name
    brand: "brandName.en",
    status: "isActive",
    restoCode: "restoCode",
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
