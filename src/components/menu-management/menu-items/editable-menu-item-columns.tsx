"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MenuItem } from "@/types/menu-item.type";
import { useTranslation } from "@/hooks/useTranslation";
import { useI18n } from "@/providers/i18n-provider";
import {
  EditableToggleCell,
  EditableSelectCell,
  EditableTextCell,
  EditableNumberCell,
} from "./editable-cells";
import { MultilingualText } from "@/types";

interface EditableColumnsConfig {
  updateField: (itemId: string, field: keyof MenuItem, value: unknown) => void;
  getFieldValue: (itemId: string, field: keyof MenuItem) => unknown;
  isFieldModified: (itemId: string, field: keyof MenuItem) => boolean;
  categoriesOptions: Array<{ value: string; label: string }>;
  taxGroupsOptions: Array<{ value: string; label: string }>;
  kitchenDeptOptions: Array<{ value: string; label: string }>;
  addonsOptions: Array<{ value: string; label: string }>;
  isLoadingOptions: boolean;
}

export const createEditableMenuItemColumns = (
  config: EditableColumnsConfig,
  t: ReturnType<typeof useTranslation>["t"],
  locale: string
): ColumnDef<MenuItem>[] => {
  const {
    updateField,
    getFieldValue,
    isFieldModified,
    categoriesOptions,
    taxGroupsOptions,
    kitchenDeptOptions,

    isLoadingOptions,
  } = config;

  return [
    // Item Name (Editable Text - Multilingual)
    {
      accessorKey: "itemName",
      id: "itemName",
      header: t("menuItems.table.itemName"),
      size: 250,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "itemName"
        ) as MultilingualText;

        return (
          <div className="space-y-2">
            <EditableTextCell
              value={currentValue?.en || ""}
              onChange={(value) =>
                updateField(menuItem._id!, "itemName", {
                  ...currentValue,
                  en: value,
                })
              }
              isModified={isFieldModified(menuItem._id!, "itemName")}
              placeholder="Item name (English)"
            />
            <EditableTextCell
              value={currentValue?.ar || ""}
              onChange={(value) =>
                updateField(menuItem._id!, "itemName", {
                  ...currentValue,
                  ar: value,
                })
              }
              isModified={isFieldModified(menuItem._id!, "itemName")}
              placeholder="اسم العنصر (عربي)"
            />
          </div>
        );
      },
    },

    // Short Code (Editable Text)
    {
      id: "shortCode",
      header: t("menuItems.table.shortCode"),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "shortCode"
        ) as string;

        return (
          <EditableTextCell
            value={currentValue || ""}
            onChange={(value) => updateField(menuItem._id!, "shortCode", value)}
            isModified={isFieldModified(menuItem._id!, "shortCode")}
            placeholder="Code"
          />
        );
      },
    },

    // Base Price (Editable Number)
    {
      accessorKey: "baseItemPrice",
      id: "baseItemPrice",
      header: t("menuItems.table.basePrice"),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "baseItemPrice"
        ) as number;

        return (
          <EditableNumberCell
            value={currentValue || 0}
            onChange={(value) =>
              updateField(menuItem._id!, "baseItemPrice", value)
            }
            isModified={isFieldModified(menuItem._id!, "baseItemPrice")}
            format="currency"
            min={0}
            step={0.01}
          />
        );
      },
    },

    // Current Stock (Editable Number)
    {
      accessorKey: "currentStock",
      id: "currentStock",
      header: t("menuItems.table.stock"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "currentStock"
        ) as number;

        return (
          <EditableNumberCell
            value={currentValue || 0}
            onChange={(value) =>
              updateField(menuItem._id!, "currentStock", value)
            }
            isModified={isFieldModified(menuItem._id!, "currentStock")}
            format="integer"
            min={0}
          />
        );
      },
    },

    // Category (Editable Select)
    {
      id: "category",
      header: t("menuItems.table.category"),
      size: 200,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "categoryId"
        ) as string;

        return (
          <EditableSelectCell
            value={currentValue || ""}
            options={categoriesOptions}
            onChange={(value) =>
              updateField(menuItem._id!, "categoryId", value)
            }
            isModified={isFieldModified(menuItem._id!, "categoryId")}
            isLoading={isLoadingOptions}
            placeholder="Select category"
          />
        );
      },
    },

    // Tax Product Group (Editable Select)
    {
      id: "taxProductGroup",
      header: t("menuItems.table.taxInfo"),
      size: 200,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "taxProductGroupId"
        ) as string;

        return (
          <EditableSelectCell
            value={currentValue || ""}
            options={taxGroupsOptions}
            onChange={(value) =>
              updateField(menuItem._id!, "taxProductGroupId", value)
            }
            isModified={isFieldModified(menuItem._id!, "taxProductGroupId")}
            isLoading={isLoadingOptions}
            placeholder="Select tax group"
          />
        );
      },
    },

    // Kitchen Department (Editable Select)
    {
      id: "kitchenDepartment",
      header: t("menuItems.table.kitchenDepartment"),
      size: 200,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "kitchenDepartmentId"
        ) as string;

        return (
          <EditableSelectCell
            value={currentValue || ""}
            options={kitchenDeptOptions}
            onChange={(value) =>
              updateField(menuItem._id!, "kitchenDepartmentId", value)
            }
            isModified={isFieldModified(menuItem._id!, "kitchenDepartmentId")}
            isLoading={isLoadingOptions}
            placeholder="Select department"
          />
        );
      },
    },

    // Food Type (Editable Select)
    {
      id: "foodType",
      header: t("menuItems.table.foodType"),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(menuItem._id!, "foodType") as string;

        const foodTypeOptions = [
          { value: "VEG", label: t("menuItems.foodTypes.VEG") },
          { value: "NON_VEG", label: t("menuItems.foodTypes.NON_VEG") },
          { value: "VEGAN", label: t("menuItems.foodTypes.VEGAN") },
        ];

        return (
          <EditableSelectCell
            value={currentValue || ""}
            options={foodTypeOptions}
            onChange={(value) => updateField(menuItem._id!, "foodType", value)}
            isModified={isFieldModified(menuItem._id!, "foodType")}
            placeholder="Select type"
          />
        );
      },
    },

    // Meat Type (Editable Select)
    {
      id: "meatType",
      header: t("menuItems.table.meatType"),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(menuItem._id!, "meatType") as string;

        const meatTypeOptions = [
          { value: "VEG", label: t("menuItems.meatTypes.VEG") },
          { value: "CHICKEN", label: t("menuItems.meatTypes.CHICKEN") },
          { value: "MUTTON", label: t("menuItems.meatTypes.MUTTON") },
          { value: "FISH", label: t("menuItems.meatTypes.FISH") },
        ];

        return (
          <EditableSelectCell
            value={currentValue || ""}
            options={meatTypeOptions}
            onChange={(value) => updateField(menuItem._id!, "meatType", value)}
            isModified={isFieldModified(menuItem._id!, "meatType")}
            placeholder="Select type"
          />
        );
      },
    },

    // Discount Type (Editable Select with dependency)
    {
      id: "discountType",
      header: t("menuItems.table.discountType"),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "discountType"
        ) as string;
        const digitalDiscount = getFieldValue(
          menuItem._id!,
          "digitalDiscount"
        ) as boolean;

        const discountTypeOptions = [
          { value: "Fixed Amount", label: "Fixed Amount" },
          { value: "Percentage", label: "Percentage" },
        ];

        return (
          <EditableSelectCell
            value={currentValue || ""}
            options={discountTypeOptions}
            onChange={(value) =>
              updateField(menuItem._id!, "discountType", value)
            }
            isModified={isFieldModified(menuItem._id!, "discountType")}
            disabled={!digitalDiscount}
            placeholder="Select type"
          />
        );
      },
    },

    // Platform Status (Toggle)
    {
      id: "platformStatus",
      header: t("menuItems.table.platformStatus"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "platformStatus"
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, "platformStatus", value)
            }
            isModified={isFieldModified(menuItem._id!, "platformStatus")}
          />
        );
      },
    },

    // Digital Discount (Toggle)
    {
      id: "digitalDiscount",
      header: t("menuItems.table.digitalDiscount"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "digitalDiscount"
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, "digitalDiscount", value)
            }
            isModified={isFieldModified(menuItem._id!, "digitalDiscount")}
          />
        );
      },
    },

    // Is Recommended (Toggle)
    {
      id: "isRecommended",
      header: t("menuItems.table.recommended"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "isRecommended"
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, "isRecommended", value)
            }
            isModified={isFieldModified(menuItem._id!, "isRecommended")}
          />
        );
      },
    },

    // Open Item (Toggle)
    {
      id: "openItem",
      header: t("menuItems.table.openItem"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "openItem"
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) => updateField(menuItem._id!, "openItem", value)}
            isModified={isFieldModified(menuItem._id!, "openItem")}
          />
        );
      },
    },

    // Open Price (Toggle)
    {
      id: "openPrice",
      header: t("menuItems.table.openPrice"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "openPrice"
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) => updateField(menuItem._id!, "openPrice", value)}
            isModified={isFieldModified(menuItem._id!, "openPrice")}
          />
        );
      },
    },

    // Sync to Aggregator (Toggle)
    {
      id: "syncToAggregator",
      header: t("menuItems.table.syncToAggregator"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          "syncToAggregator"
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, "syncToAggregator", value)
            }
            isModified={isFieldModified(menuItem._id!, "syncToAggregator")}
          />
        );
      },
    },

    // Is Combo (Toggle)
    {
      id: "isCombo",
      header: t("menuItems.table.isCombo"),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(menuItem._id!, "isCombo") as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) => updateField(menuItem._id!, "isCombo", value)}
            isModified={isFieldModified(menuItem._id!, "isCombo")}
          />
        );
      },
    },
  ];
};

// Hook for using editable columns
export const useEditableMenuItemColumns = (config: EditableColumnsConfig) => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return createEditableMenuItemColumns(config, t, locale);
};
