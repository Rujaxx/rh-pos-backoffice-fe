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

interface TaxGroupFormContentProps {
  form: ReturnType<typeof useForm<TaxProductGroupFormData>>;
}

export function TaxGroupFormContent({ form }: TaxGroupFormContentProps) {
  const { t } = useTranslation();
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

            {/* Product Group Name Input */}
            <RHFInput
              form={form}
              name="productGroupName"
              label={t("taxGroups.form.productGroupName")}
              placeholder={t("taxGroups.form.productGroupNamePlaceholder")}
            />

            {/* Tax Type and Tax Value */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* UPDATED: Using RHFSelect instead of RHFRadioGroup */}
              <RHFSelect
                form={form}
                name="taxType"
                label={t("taxGroups.form.taxType")}
                placeholder={t("taxGroups.form.taxTypePlaceholder")}
                options={taxTypeOptions}
              />
              <RHFInput
                form={form}
                name="taxValue"
                label={t("taxGroups.form.taxValue")}
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
export function useTaxGroupForm(
  editingTaxGroup?: TaxProductGroupFormData | null,
) {
  const form = useForm<TaxProductGroupFormData>({
    resolver: zodResolver(taxProductGroupSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      productGroupName: "",
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
        productGroupName: editingTaxGroup.productGroupName,
        taxType: editingTaxGroup.taxType || ("Percentage" as const),
        taxValue: editingTaxGroup.taxValue || 0,
        isActive: editingTaxGroup.isActive ?? true,
        brandId: editingTaxGroup.brandId,
        restaurantId: editingTaxGroup.restaurantId || "",
      });
    } else {
      form.reset({
        name: { en: "", ar: "" },
        productGroupName: "",
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
