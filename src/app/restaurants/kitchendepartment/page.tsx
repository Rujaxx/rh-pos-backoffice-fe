'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    CrudModal,
    ConfirmationModal,
    useModal,
    useConfirmationModal,
} from '@/components/ui/crud-modal';
import {
    KitchenDepartmentFormContent,
    useKitchenDepartmentForm,
} from '@/components/restaurants/kitchenDepartment-form';
import Layout from '@/components/common/layout';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';

import { toast } from 'sonner';
import { useI18n } from '@/providers/i18n-provider';
import { kitchenDepartment, TableAction } from '@/types/kitchendepartment.type';
import { KitchenDepartmentFormData } from '@/lib/validations/kitchendepartment.validation';

// ✅ Mock data - replace with actual API calls
const mockKitchenDepartments: kitchenDepartment[] = [
    {
        _id: 'kd1',
        name: { en: 'Main Kitchen', ar: 'المطبخ الرئيسي' },
        shortCode: 'MK',
        isActive: true,
        brandId: '1',
        brandName: { en: 'Pizza Palace', ar: 'قصر البيتزا' },
        restaurantId: '64b23abc123456',
        restaurantName: { en: 'Pizza Palace - Downtown', ar: 'قصر البيتزا - وسط المدينة' },
        createdBy: '',
        updatedBy: '',
        deletedBy: '',
        deletedAt: new Date('2024-01-12'),
    },
    {
        _id: 'kd2',
        name: { en: 'Bakery Section', ar: 'قسم المخبوزات' },
        shortCode: 'BK',
        isActive: false,
        brandId: '2',
        brandName: { en: 'Burger House', ar: 'بيت البرجر' },
        restaurantId: '64b23abc123457',
        restaurantName: { en: 'Burger House - Central', ar: 'بيت البرغر - المركزي' },
        createdBy: '',
        updatedBy: '',
        deletedBy: '',
        deletedAt: new Date('2024-01-11'),
    },
];

export default function KitchenDepartmentPage() {
    const { t } = useTranslation();
    const { locale } = useI18n();
    const [kitchenDepartments, setKitchenDepartments] =
        useState<kitchenDepartment[]>(mockKitchenDepartments);
    const [loading, setLoading] = useState(false);

    // ✅ Modal hooks
    const {
        isOpen,
        editingItem: editingKitchenDepartment,
        openModal,
        closeModal,
    } = useModal<kitchenDepartment>();
    const {
        isConfirmationOpen,
        confirmationConfig,
        openConfirmationModal,
        closeConfirmationModal,
        executeConfirmation,
    } = useConfirmationModal();

    // ✅ Form hook
    const { form } = useKitchenDepartmentForm(editingKitchenDepartment);

    // ✅ Table columns
    const columns = [
        {
            id: 'restaurantName',
            label: t('kitchen.restaurant'),
            accessor: (dept: kitchenDepartment) => (
                <div className="font-medium text-foreground truncate">
                    {dept.restaurantName[locale] || dept.restaurantName.en}
                </div>
            ),
            sortable: true,
        },
        {
            id: 'brandName',
            label: t('kitchen.brand'),
            accessor: (dept: kitchenDepartment) => (
                <Badge variant="outline">
                    {dept.brandName[locale] || dept.brandName.en}
                </Badge>
            ),
            sortable: true,
        },
        {
            id: 'name',
            label: t('kitchen.name'),
            accessor: (dept: kitchenDepartment) => (
                <div className="font-medium text-foreground truncate">
                    {dept.name[locale] || dept.name.en}
                </div>
            ),
            sortable: true,
        },
        {
            id: 'status',
            label: t('kitchen.status'),
            accessor: (dept: kitchenDepartment) => (
                <Badge variant={dept.isActive ? 'default' : 'secondary'}>
                    {dept.isActive ? t('kitchen.active') : t('kitchen.inactive')}
                </Badge >
            ),
            sortable: true,
        },
    ];

    // ✅ Table actions
    const actions: TableAction<kitchenDepartment>[] = [
        {
            label: t('common.edit'),
            icon: Edit,
            onClick: (dept) => openModal(dept),
        },
        {
            label: t('common.delete'),
            icon: Trash2,
            variant: 'destructive',
            onClick: (dept) => {
                openConfirmationModal(() => handleDeleteKitchenDepartment(dept), {
                    title: t('kitchen.deleteConfirmationTitle'),
                    description: t('kitchen.deleteConfirmationDescription', {
                        name: dept.name[locale],
                    }),
                    confirmButtonText: t('common.delete'),
                    variant: 'destructive',
                });
            },
            disabled: (dept) => dept.isActive ?? false, // Prevent deleting active dept
        },
    ];

    // ✅ Create
    const handleCreateKitchenDepartment = async (data: KitchenDepartmentFormData) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newDept: kitchenDepartment = {
                _id: Date.now().toString(),
                ...data,
                deletedAt: new Date(),
                createdBy: '',
                updatedBy: '',
                deletedBy: '',
                brandName:
                    mockKitchenDepartments.find((r) => r.brandId === data.brandId)?.brandName ||
                    { en: 'Unknown Brand', ar: 'علامة تجارية غير معروفة' },
                restaurantName:
                    mockKitchenDepartments.find((r) => r.restaurantId === data.restaurantId)
                        ?.restaurantName || { en: 'Unknown Restaurant', ar: 'مطعم غير معروف' },
            };

            setKitchenDepartments((prev) => [newDept, ...prev]);
            toast.success(t('kitchen.addSuccess'));
        } catch {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Update
    const handleUpdateKitchenDepartment = async (data: KitchenDepartmentFormData) => {
        if (!editingKitchenDepartment) return;

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const updatedDept: kitchenDepartment = {
                ...editingKitchenDepartment,
                ...data,
                brandName:
                    mockKitchenDepartments.find((r) => r.brandId === data.brandId)?.brandName ||
                    { en: 'Unknown Brand', ar: 'علامة تجارية غير معروفة' },
                restaurantName:
                    mockKitchenDepartments.find((r) => r.restaurantId === data.restaurantId)
                        ?.restaurantName || { en: 'Unknown Restaurant', ar: 'مطعم غير معروف' },
            };

            setKitchenDepartments((prev) =>
                prev.map((dept) =>
                    dept._id === editingKitchenDepartment._id ? updatedDept : dept,
                ),
            );
            toast.success(t('kitchen.editSuccess'));
        } catch {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Delete
    const handleDeleteKitchenDepartment = async (deptToDelete: kitchenDepartment) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setKitchenDepartments((prev) =>
                prev.filter((dept) => dept._id !== deptToDelete._id),
            );
            toast.success(t('kitchen.deleteSuccess'));
        } catch {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Form submit
    const handleFormSubmit = async (data: KitchenDepartmentFormData) => {
        if (editingKitchenDepartment) {
            await handleUpdateKitchenDepartment(data);
        } else {
            await handleCreateKitchenDepartment(data);
        }
    };

    // ✅ Modal helpers
    const getModalTitle = () =>
        editingKitchenDepartment ? t('kitchen.editTitle') : t('kitchen.addTitle');

    const getModalDescription = () =>
        editingKitchenDepartment ? '' : t('kitchen.form.createDescription');

    return (
        <Layout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Building2 className="h-8 w-8" />
                            {t('kitchen.title')}
                        </h1>
                        <p className="text-muted-foreground">{t('kitchen.subtitle')}</p>
                    </div>
                    <Button
                        onClick={() => openModal()}
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <Plus className="h-4 w-4" />
                        {t('kitchen.addNew')}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('kitchen.allDepartments')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={kitchenDepartments}
                            columns={columns}
                            actions={actions}
                            searchable
                            searchPlaceholder={t('kitchen.searchPlaceholder')}
                            pagination
                            loading={loading}
                        />
                    </CardContent>
                </Card>

                {/* Kitchen Department CRUD Modal */}
                <CrudModal<KitchenDepartmentFormData>
                    isOpen={isOpen}
                    onClose={closeModal}
                    title={getModalTitle()}
                    description={getModalDescription()}
                    form={form}
                    onSubmit={handleFormSubmit}
                    loading={loading}
                >
                    <KitchenDepartmentFormContent form={form} />
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
    );
}
