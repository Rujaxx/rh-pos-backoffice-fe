"use client"

import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    RHFSelect,
    RHFSwitch,
    RHFInput,
} from "@/components/ui/form-components"
import { tableSchema, TableFormData } from "@/lib/validations/table.validation"
import { Table } from "@/types/table"

interface TableFormContentProps {
    form: UseFormReturn<TableFormData>
}

export function TableFormContent({ form }: TableFormContentProps) {
    const { t } = useTranslation()

    // Mock options - replace with API calls
    const restaurantOptions = [
        { value: "64b23abc123456", label: t("table.form.restaurant1") },
        { value: "64b23abc123457", label: t("table.form.restaurant2") },
    ]

    const tableSectionOptions = [
        { value: "77b23abc123456", label: t("table.form.section1") },
        { value: "77b23abc123457", label: t("table.form.section2") },
    ]

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        {t("table.form.basicInfo")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                    <RHFInput
                        form={form}
                        name="label"
                        label={t("table.form.label")}
                        placeholder={t("table.form.labelPlaceholder")}
                    />

                    <RHFInput
                        form={form}
                        name="capacity"
                        type="number"
                        label={t("table.form.capacity")}
                        placeholder={t("table.form.capacityPlaceholder")}
                    />

                    <RHFSwitch
                        form={form}
                        name="isAvailable"
                        label={t("table.form.availabilityLabel")}
                        description={t("table.form.availabilityDescription")}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

// Hook for table form logic
export function useTableForm(editingTable?: Table | null) {
    const form = useForm<TableFormData>({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            tableSectionId: "",
            restaurantId: "",
            label: "",
            capacity: "1",
            isAvailable: true,
        },
    })

    React.useEffect(() => {
        if (editingTable) {
            form.reset({
                tableSectionId: editingTable.tableSectionId,
                restaurantId: editingTable.restaurantId,
                label: editingTable.label,
                capacity: editingTable.capacity,
                isAvailable: editingTable.isAvailable,
            })
        } else {
            form.reset({
                tableSectionId: "",
                restaurantId: "",
                label: "",
                capacity: "1",
                isAvailable: true,
            })
        }
    }, [editingTable, form])

    return {
        form,
        isEditing: !!editingTable,
    }
}

export default TableFormContent
