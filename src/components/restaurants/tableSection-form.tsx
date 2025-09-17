"use client"

import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    RHFSelect,
    RHFMultilingualInput,
    RHFSwitch,
} from "@/components/ui/form-components"
import { TableSectionSchema, TableSectionFormData } from "@/lib/validations/tablesection.validation"
import { TableSection } from "@/types/tableSection"

interface TableSectionFormContentProps {
    form: UseFormReturn<TableSectionFormData>
}

export function TableSectionFormContent({ form }: TableSectionFormContentProps) {
    const { t } = useTranslation()

    // Mock restaurant options - in real app, this would come from API or context
    const restaurantOptions = [
        { value: "64b23abc123456", label: "Pizza Palace - Downtown" },
        { value: "64b23abc123457", label: "Burger House - Central" },
        { value: "64b23abc123458", label: "Sushi Express - West End" },
        { value: "64b23abc123459", label: "Cafe Delight - Riverside" },
        { value: "64b23abc123460", label: "Steak House - uptown" },
    ]

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        {t('tableSection.form.basicInfo')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RHFSelect
                        form={form}
                        name="restaurantId"
                        label={t('tableSection.form.restaurantLabel')}
                        placeholder={t('tableSection.form.restaurantPlaceholder')}
                        options={restaurantOptions}
                    />

                    <RHFMultilingualInput
                        form={form}
                        name="name"
                        label={t('tableSection.form.nameLabel')}
                        placeholder={{
                            en: t('tableSection.form.namePlaceholderEn'),
                            ar: t('tableSection.form.namePlaceholderAr')
                        }}
                    />
                    <RHFSwitch
                        form={form}
                        name="isActive"
                        label={t('tableSection.form.activeStatusLabel')}
                        description={t('tableSection.form.activeStatusDescription')}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

// Hook for table section form logic
export function useTableSectionForm(editingTableSection?: TableSection | null) {
    const form = useForm<TableSectionFormData>({
        resolver: zodResolver(TableSectionSchema),
        defaultValues: {
            restaurantId: "",
            name: { en: "", ar: "" },
            isActive: true,
        },
    })

    // Reset form when editing table section changes
    React.useEffect(() => {
        if (editingTableSection) {
            form.reset({
                restaurantId: editingTableSection.restaurantId,
                name: editingTableSection.name,
                isActive: editingTableSection.isActive ?? false,
            })
        } else {
            form.reset({
                restaurantId: "",
                name: { en: "", ar: "" },
                isActive: true,
            })
        }
    }, [editingTableSection, form])

    return {
        form,
        isEditing: !!editingTableSection,
    }
}

export default TableSectionFormContent