"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RHFInput,
  RHFSelect, // UPDATED: Replaced RHFRadioGroup with RHFSelect
} from "@/components/ui/form-components";
import { useTranslation } from "@/hooks/useTranslation";
import {
  TaxProductGroupFormData,
  taxProductGroupSchema,
} from "@/lib/validations/tax-product-group.validation";
import { useActiveBrands } from "@/services/api/brands/brands.queries";
import { useI18n } from "@/providers/i18n-provider";
import { useActiveRestaurants } from "@/services/api/restaurants/restaurants.queries";

interface TaxGroupFormContentProps {
  form: ReturnType<typeof useForm<TaxProductGroupFormData>>;
}

export function TaxGroupFormContent({ form }: TaxGroupFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const taxTypeOptions = [
    {
      label: t("taxGroups.form.taxTypePercentage"),
      value: "Percentage",
    },
    {
      label: t("taxGroups.form.taxTypeFixedAmount"),
      value: "Fixed Amount",
    },
  ];

  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  const brandOptions = (brandsResponse?.data || []).map((brand) => ({
    value: brand._id,
    label: brand.name[locale] || brand.name.en,
  }));

  const restaurantOptions = (restaurantsResponse?.data || []).map(
    (restaurant) => ({
      value: restaurant._id,
      label: restaurant.name[locale] || restaurant.name.en,
    }),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("taxGroups.form.title")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* Multilingual Name Input */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFInput
                form={form}
                name="name.en"
                label={t("taxGroups.form.nameEn")}
                placeholder={t("taxGroups.form.nameEnPlaceholder")}
              />
              <RHFInput
                form={form}
                name="name.ar"
                label={t("taxGroups.form.nameAr")}
                placeholder={t("taxGroups.form.nameArPlaceholder")}
              />
            </div>

            <RHFSelect
              form={form}
              name="brandId"
              label={t("restaurants.form.brandLabel")}
              placeholder={
                isLoadingBrands
                  ? t("common.loading")
                  : brandOptions.length === 0
                    ? t("common.noBrandsAvailable")
                    : t("common.brandPlaceholder")
              }
              options={brandOptions}
              disabled={isLoadingBrands}
            />

            <RHFSelect
              form={form}
              name="restaurantId"
              label={t("kitchen.form.restaurantLabel")}
              placeholder={
                isLoadingRestaurants
                  ? t("common.loading")
                  : restaurantOptions.length === 0
                    ? t("restaurants.form.noRestaurantsAvailable")
                    : t("kitchen.form.restaurantPlaceholder")
              }
              options={restaurantOptions}
              disabled={isLoadingRestaurants}
            />

            {/* Tax Type and Tax Value */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelect
                form={form}
                name="taxType"
                label={t("taxGroups.table.taxType")}
                placeholder={t("taxGroups.form.taxTypePlaceholder")}
                options={taxTypeOptions}
              />
              <RHFInput
                form={form}
                name="taxValue"
                label={t("taxGroups.table.taxValue")}
                placeholder={t("taxGroups.form.taxValuePlaceholder")}
                type="number"
                step="0.01"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for tax group form logic
export function useTaxProductGroupForm(
  editingTaxGroup?: TaxProductGroupFormData | null,
) {
  const form = useForm<TaxProductGroupFormData>({
    resolver: zodResolver(taxProductGroupSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      taxType: "Percentage" as const,
      taxValue: 0,
      isActive: true,
      brandId: "",
      restaurantId: "",
    },
  });

  React.useEffect(() => {
    if (editingTaxGroup) {
      form.reset({
        _id: editingTaxGroup._id,
        name: editingTaxGroup.name,
        taxType: editingTaxGroup.taxType || ("Percentage" as const),
        taxValue: editingTaxGroup.taxValue || 0,
        isActive: editingTaxGroup.isActive ?? true,
        brandId: editingTaxGroup.brandId,
        restaurantId: editingTaxGroup.restaurantId || "",
      });
    } else {
      form.reset({
        name: { en: "", ar: "" },
        taxType: "Percentage" as const,
        taxValue: 0,
        isActive: true,
        brandId: "",
        restaurantId: "",
      });
    }
  }, [editingTaxGroup, form]);

  return {
    form,
    isEditing: !!editingTaxGroup,
  };
}

export default TaxGroupFormContent;
