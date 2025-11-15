"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from "@/components/ui/form-components";
import { TableFormData, tableSchema } from "@/lib/validations/table.validation";
import { Table } from "@/types/table";

interface TableFormContentProps {
  form: UseFormReturn<TableFormData>;
}

export function TableFormContent({ form }: TableFormContentProps) {
  const { t } = useTranslation();

  // Mock restaurant options
  const restaurantOptions = [
    { value: "64b23abc123456", label: t("table.form.restaurant1") },
    { value: "64b23abc123457", label: t("table.form.restaurant2") },
  ];

  // Mock table section options
  const tableSectionOptions = [
    { value: "section1", label: t("table.form.section1") },
    { value: "section2", label: t("table.form.section2") },
  ];

  const isBulk = form.watch("isBulk");

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("table.form.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RHFSwitch
            form={form}
            name="isBulk"
            label={t("table.form.bulkAdd")}
            description={t("table.form.bulkAddDescription")}
          />
          {/* Common required selections */}
          <RHFSelect
            form={form}
            name="restaurantId"
            label={t("table.form.restaurantLabel")}
            placeholder={t("table.form.restaurantPlaceholder")}
            options={restaurantOptions}
          />

          <RHFSelect
            form={form}
            name="tableSectionId"
            label={t("table.form.sectionLabel")}
            placeholder={t("table.form.sectionPlaceholder")}
            options={tableSectionOptions}
          />

          {/* Conditional fields based on bulk toggle */}
          {isBulk ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="bulkLabelPrefix"
                label={t("table.form.bulkLabelPrefix")}
                placeholder={t("table.form.bulkLabelPrefix")}
              />
              <RHFInput
                form={form}
                name="capacity"
                label={t("table.form.capacity")}
                placeholder={t("table.form.capacityPlaceholder")}
                type="number"
              />
              <RHFInput
                form={form}
                name="bulkCount"
                label={t("table.form.bulkCount")}
                placeholder={t("table.form.bulkCount")}
                type="number"
              />
              <div className="md:col-span-2">
                <RHFSwitch
                  form={form}
                  name="isAvailable"
                  label={t("table.form.availabilityLabel")}
                  description={t("table.form.availabilityDescription")}
                />
              </div>
            </div>
          ) : (
            <>
              <RHFInput
                form={form}
                name="label"
                label={t("table.form.label")}
                placeholder={t("table.form.labelPlaceholder")}
              />
              <RHFInput
                form={form}
                name="capacity"
                label={t("table.form.capacity")}
                placeholder={t("table.form.capacityPlaceholder")}
                type="number"
              />
              <RHFSwitch
                form={form}
                name="isAvailable"
                label={t("table.form.availabilityLabel")}
                description={t("table.form.availabilityDescription")}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for table form logic
export function useTableForm(editingTable?: Table | null) {
  const form = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      restaurantId: "",
      tableSectionId: "",
      label: "",
      capacity: 0,
      isAvailable: true,
      isBulk: false,
      bulkCount: "",
      bulkLabelPrefix: "T",
    },
  });

  React.useEffect(() => {
    if (editingTable) {
      form.reset({
        _id: editingTable._id,
        restaurantId: editingTable.restaurantId,
        tableSectionId: editingTable.tableSectionId,
        label: editingTable.label,
        capacity: editingTable.capacity,
        isAvailable: editingTable.isAvailable,
        isBulk: false,
        bulkCount: "",
        bulkLabelPrefix: "T",
      });
    } else {
      form.reset({
        restaurantId: "",
        tableSectionId: "",
        label: "",
        capacity: 0,
        isAvailable: true,
        isBulk: false,
        bulkCount: "",
        bulkLabelPrefix: "T",
      });
    }
  }, [editingTable, form]);

  return { form, isEditing: !!editingTable };
}

export default TableFormContent;
