'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    RHFSelect,
    RHFMultilingualInput,
    RHFSwitch,
    RHFInput,
} from '@/components/ui/form-components';
import {
    kitchenDepartmentSchema,
    KitchenDepartmentFormData,
} from '@/lib/validations/kitchendepartment.validation';
import { kitchenDepartment } from '@/types/kitchendepartment.type';

interface KitchenDepartmentFormContentProps {
    form: UseFormReturn<KitchenDepartmentFormData>;
}

export function KitchenDepartmentFormContent({
    form,
}: KitchenDepartmentFormContentProps) {
    const { t } = useTranslation();

    const restaurantOptions = [
        { value: '64b23abc123456', label: t('kitchen.form.restaurant1') },
        { value: '64b23abc123457', label: t('kitchen.form.restaurant2') },
    ];

    const brandOptions = [
        { value: '1', label: t('kitchen.form.brands.pizzaPalace') },
        { value: '2', label: t('kitchen.form.brands.burgerHouse') },
    ];

    return (
        <>
            <div className='grid grid-cols-1 gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>
                            {t('kitchen.form.basicInfo')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RHFMultilingualInput
                            form={form}
                            name="name"
                            label={t('kitchen.form.kitchenDeptLabel')}
                            placeholder={{
                                en: t('kitchen.form.kitchenDeptPlaceholderEn'),
                                ar: t('kitchen.form.kitchenDeptPlaceholderAr'),
                            }}
                        />

                        <RHFInput
                            form={form}
                            name="shortCode"
                            label={t('kitchen.form.shortCodeLabel')}
                            placeholder={t('kitchen.form.shortCodePlaceholder')}
                        />

                        <RHFSelect
                            form={form}
                            name="restaurantId"
                            label={t('kitchen.form.restaurantLabel')}
                            placeholder={t('kitchen.form.restaurantPlaceholder')}
                            options={restaurantOptions}
                        />

                        <RHFSelect
                            form={form}
                            name="brandId"
                            label={t('kitchen.form.brandLabel')}
                            placeholder={t('kitchen.form.brandPlaceholder')}
                            options={brandOptions}
                        />

                        <RHFSwitch
                            form={form}
                            name="isActive"
                            label={t('kitchen.form.activeStatusLabel')}
                            description={t('kitchen.form.activeStatusDescription')}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

// Hook for kitchen department form logic
export function useKitchenDepartmentForm(editingKitchenDepartment?: kitchenDepartment | null) {
    const form = useForm<KitchenDepartmentFormData>({
        resolver: zodResolver(kitchenDepartmentSchema),
        defaultValues: {
            restaurantId: '',
            brandId: '',
            shortCode: '',
            name: { en: '', ar: '' },
            isActive: true,
        },
    });

    // Reset form when editing kitchen department changes
    React.useEffect(() => {
        if (editingKitchenDepartment) {
            form.reset({
                _id: editingKitchenDepartment._id,
                brandId: editingKitchenDepartment.brandId,
                restaurantId: editingKitchenDepartment.restaurantId,
                shortCode: editingKitchenDepartment.shortCode,
                name: editingKitchenDepartment.name,
                isActive: editingKitchenDepartment.isActive ?? false,
            });
        } else {
            form.reset({
                restaurantId: '',
                brandId: '',
                shortCode: '',
                name: { en: '', ar: '' },
                isActive: true,
            });
        }
    }, [editingKitchenDepartment, form]);

    return {
        form,
        isEditing: !!editingKitchenDepartment,
    };
}

export default KitchenDepartmentFormContent;
