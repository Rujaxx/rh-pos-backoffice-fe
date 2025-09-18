"use client"

import React, { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { CrudModal, ConfirmationModal, useModal, useConfirmationModal } from "@/components/ui/crud-modal"
import { TableFormContent, useTableForm } from "@/components/restaurants/table-form"
import Layout from "@/components/common/layout"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, UtensilsCrossed } from "lucide-react"
import { Table, TableAction } from "@/types/table"
import { TableFormData } from "@/lib/validations/table.validation"
import { toast } from "sonner"
import { useI18n } from "@/providers/i18n-provider"

// Mock data - replace with actual API calls
const mockTables: Table[] = [
    {
        id: "1",
        restaurantId: "64b23abc123456",
        restaurantName: { en: "Pizza Palace", ar: "قصر البيتزا" },
        tableSectionId: "77b23abc123456",
        label: "T1",
        capacity: "4",
        isAvailable: true,
        createdBy: "",
        createdAt: new Date(),
        updatedBy: "",
    },
    {
        id: "2",
        restaurantId: "64b23abc123457",
        restaurantName: { en: "Burger House", ar: "بيت البرجر" },
        tableSectionId: "77b23abc123457",
        label: "T2",
        capacity: "2",
        isAvailable: false,
        createdBy: "",
        createdAt: new Date(),
        updatedBy: "",
    },
]

export default function TablePage() {
    const { t } = useTranslation()
    const { locale } = useI18n()
    const [tables, setTables] = useState<Table[]>(mockTables)
    const [loading, setLoading] = useState(false)

    const { isOpen, editingItem: editingTable, openModal, closeModal } = useModal<Table>()
    const {
        isConfirmationOpen,
        confirmationConfig,
        openConfirmationModal,
        closeConfirmationModal,
        executeConfirmation,
    } = useConfirmationModal()

    const { form } = useTableForm(editingTable)

    const columns = [
        {
            id: "restaurantName",
            label: t("table.restaurant"),
            accessor: (table: Table) => (
                <div className="font-medium text-foreground truncate">
                    {table.restaurantName[locale] || table.restaurantName.en}
                </div>
            ),
            sortable: true,
        },
        {
            id: "label",
            label: t("table.label"),
            accessor: (table: Table) => table.label,
            sortable: true,
        },
        {
            id: "capacity",
            label: t("table.capacity"),
            accessor: (table: Table) => table.capacity,
            sortable: true,
        },
        {
            id: "status",
            label: t("table.status"),
            accessor: (table: Table) => (
                <Badge variant={table.isAvailable ? "default" : "secondary"}>
                    {table.isAvailable ? t("table.available") : t("table.unavailable")}
                </Badge>
            ),
            sortable: true,
        },
    ]

    const actions: TableAction<Table>[] = [
        {
            label: t("common.edit"),
            icon: Edit,
            onClick: (table) => openModal(table),
        },
        {
            label: t("common.delete"),
            icon: Trash2,
            variant: "destructive",
            onClick: (table) =>
                openConfirmationModal(() => handleDeleteTable(table), {
                    title: t("table.deleteConfirmationTitle"),
                    description: t("table.deleteConfirmationDescription", { name: table.label }),
                    confirmButtonText: t("common.delete"),
                    variant: "destructive",
                }),
            disabled: (table) => table.isAvailable, // block deleting available tables
        },
    ]

    const handleCreateTable = async (data: TableFormData) => {
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const newTable: Table = {
                id: Date.now().toString(),
                ...data,
                createdBy: "",
                updatedBy: "",
                restaurantName:
                    mockTables.find((r) => r.restaurantId === data.restaurantId)?.restaurantName || {
                        en: "Unknown",
                        ar: "غير معروف",
                    },
            }

            setTables((prev) => [newTable, ...prev])
            toast.success(t("table.addSuccess"))
        } catch (error) {
            toast.error(t("common.error"))
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateTable = async (data: TableFormData) => {
        if (!editingTable) return
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const updatedTable: Table = {
                ...editingTable,
                ...data,
                createdBy: "",
                updatedBy: "",
                restaurantName:
                    mockTables.find((r) => r.restaurantId === data.restaurantId)?.restaurantName || {
                        en: "Unknown",
                        ar: "غير معروف",
                    },
            }

            setTables((prev) =>
                prev.map((table) => (table.id === editingTable.id ? updatedTable : table)),
            )
            toast.success(t("table.editSuccess"))
        } catch (error) {
            toast.error(t("common.error"))
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTable = async (tableToDelete: Table) => {
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setTables((prev) => prev.filter((t) => t.id !== tableToDelete.id))
            toast.success(t("table.deleteSuccess"))
        } catch {
            toast.error(t("common.error"))
        } finally {
            setLoading(false)
        }
    }

    const handleFormSubmit = async (data: TableFormData) => {
        if (editingTable) {
            await handleUpdateTable(data)
        } else {
            await handleCreateTable(data)
        }
    }

    const getModalTitle = () =>
        editingTable ? t("table.editTitle") : t("table.form.addTitle")

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <UtensilsCrossed className="h-8 w-8" />
                            {t("table.title")}
                        </h1>
                        <p className="text-muted-foreground">{t("table.subtitle")}</p>
                    </div>
                    <Button
                        onClick={() => openModal()}
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <Plus className="h-4 w-4" />
                        {t("table.addNew")}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("table.allTables")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={tables}
                            columns={columns}
                            actions={actions}
                            searchable
                            searchPlaceholder={t("table.searchPlaceholder")}
                            pagination
                            loading={loading}
                        />
                    </CardContent>
                </Card>

                {/* Table CRUD Modal */}
                <CrudModal<TableFormData>
                    isOpen={isOpen}
                    onClose={closeModal}
                    title={getModalTitle()}
                    form={form}
                    onSubmit={handleFormSubmit}
                    loading={loading}
                >
                    <TableFormContent form={form} />
                </CrudModal>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={executeConfirmation || (() => Promise.resolve())}
                    title={confirmationConfig.title}
                    description={confirmationConfig.description}
                    loading={loading}
                    confirmButtonText={confirmationConfig.confirmButtonText}
                    variant={confirmationConfig.variant}
                />
            </div>
        </Layout>
    )
}
