"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RHFMultilingualInput,
  RHFSelect,
  RHFSwitch,
} from "@/components/ui/form-components";
import {
  tableSectionSchema,
  TableSectionFormData,
} from "@/lib/validations/table-section.validation";
import { TableSection } from "@/types/table-section.type";
import { useActiveRestaurants } from "@/services/api/restaurants/restaurants.queries";
import { useI18n } from "@/providers/i18n-provider";

interface TableSectionFormContentProps {
  form: UseFormReturn<TableSectionFormData>;
}

export function TableSectionFormContent({
  form,
}: TableSectionFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active restaurants from API
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  // Transform restaurants into dropdown options
  const restaurantOptions = (restaurantsResponse?.data || []).map(
    (restaurant) => ({
      value: restaurant._id,
      label: restaurant.name[locale] || restaurant.name.en,
    })
  );

  return (
    <>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("tableSection.form.basicInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RHFMultilingualInput
            form={form}
            name="name"
            label={t("tableSection.form.nameLabel")}
            placeholder={{
              en: t("tableSection.form.namePlaceholderEn"),
              ar: t("tableSection.form.namePlaceholderAr"),
            }}
          />

          <RHFSelect
            form={form}
            name="restaurantId"
            label={t("tableSection.form.restaurantLabel")}
            placeholder={
              isLoadingRestaurants
                ? t("common.loading")
                : restaurantOptions.length === 0
                  ? t("restaurants.form.noRestaurantsAvailable")
                  : t("tableSection.form.restaurantPlaceholder")
            }
            options={restaurantOptions}
            disabled={isLoadingRestaurants}
          />

          <RHFSwitch
            form={form}
            name="isActive"
            label={t("tableSection.form.activeStatusLabel")}
            description={t("tableSection.form.activeStatusDescription")}
          />
        </CardContent>
      </Card>
    </>
  );
}

// Hook for table section form logic
export function useTableSectionForm(
  editingTableSection?: TableSection | null
): {
  form: UseFormReturn<TableSectionFormData, unknown>;
  isEditing: boolean;
} {
  const form = useForm<TableSectionFormData>({
    resolver: zodResolver(tableSectionSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      restaurantId: "",
      isActive: true, // Backend default: true
    },
  });

  // Reset form when editing table section changes
  React.useEffect(() => {
    if (editingTableSection) {
      form.reset({
        _id: editingTableSection._id,
        name: editingTableSection.name,
        restaurantId: editingTableSection.restaurantId,
        isActive: editingTableSection.isActive ?? true,
      });
    } else {
      form.reset({
        name: { en: "", ar: "" },
        restaurantId: "",
        isActive: true,
      });
    }
  }, [editingTableSection, form]);

  return {
    form,
    isEditing: !!editingTableSection,
  };
}

export default TableSectionFormContent;
