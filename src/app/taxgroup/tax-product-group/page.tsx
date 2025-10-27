'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';
import Layout from '@/components/common/layout';
import { Edit, Plus, Trash2, Tag, Percent } from 'lucide-react';
import {
  TaxProductGroup,
  TaxProductGroupFormData,
} from '@/types/tax-product-group.type';
import { useIntl } from 'react-intl';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockTaxProductGroups } from '@/mock/tax-product-group';
import TaxGroupFormContent, {
  useTaxGroupForm,
} from '@/components/taxgroup/tax-product-group-form';
import { TableAction } from '@/types/common/common.type';

function TaxProductGroupsPage() {
  const { t } = useTranslation();
  const [taxGroups, setTaxGroups] =
    useState<TaxProductGroup[]>(mockTaxProductGroups);
  const [loading, setLoading] = useState(false);
  const locale = useIntl().locale as 'en' | 'ar';

  // Modal hooks
  const {
    isOpen,
    editingItem: editingTaxGroup,
    openModal,
    closeModal,
  } = useModal<TaxProductGroup>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form, isEditing } = useTaxGroupForm(editingTaxGroup);

  // Table columns configuration
  const columns = [
    {
      id: 'name',
      label: t('taxGroups.table.name'),
      sortable: true,
      accessor: (group: TaxProductGroup) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          {group.name[locale]}
        </div>
      ),
    },
    {
      id: 'productGroupName',
      label: t('taxGroups.table.productGroupName'),
      sortable: true,
      accessor: (group: TaxProductGroup) => (
        <span className="font-medium text-sm">{group.productGroupName}</span>
      ),
    },
    {
      id: 'taxType',
      label: t('taxGroups.table.taxType'),
      accessor: (group: TaxProductGroup) => (
        <Badge variant="outline">
          {group.taxType === 'Percentage' ? (
            <Percent className="w-3 h-3 mr-1" />
          ) : (
            <Tag className="w-3 h-3 mr-1" />
          )}
          {t(
            `taxGroups.type.${group.taxType.replace(/\s/g, '').toLowerCase()}`
          )}
        </Badge>
      ),
    },
    {
      id: 'taxValue',
      label: t('taxGroups.table.taxValue'),
      sortable: true,
      accessor: (group: TaxProductGroup) => {
        const formattedValue = new Intl.NumberFormat(locale, {
          style: 'decimal',
          maximumFractionDigits: 2,
        }).format(group.taxValue);

        return group.taxType === 'Percentage'
          ? `${formattedValue}%`
          : formattedValue;
      },
    },
    {
      id: 'isActive',
      label: t('taxGroups.table.status'),
      sortable: true,
      accessor: (group: TaxProductGroup) => (
        <Badge variant={group.isActive ? 'default' : 'secondary'}>
          {group.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  // Table actions configuration
  const actions: TableAction<TaxProductGroup>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      onClick: (group: TaxProductGroup) => openModal(group),
      variant: 'default',
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      onClick: (group: TaxProductGroup) => {
        openConfirmationModal(
          async () => {
            await handleDeleteTaxGroup(group._id!);
          },
          {
            title: t('taxGroups.delete.title'),
            description: t('taxGroups.delete.description', {
              name: group.name[locale],
            }),
            confirmButtonText: t('common.delete'),
            variant: 'destructive',
          }
        );
      },
      variant: 'destructive',
    },
  ];

  // CRUD Handlers
  const handleCreateTaxGroup = async (data: TaxProductGroupFormData) => {
    setLoading(true);
    try {
      // Simulate API call and receive a new object
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newTaxGroup: TaxProductGroup = {
        _id: Date.now().toString(),
        name: data.name,
        productGroupName: data.productGroupName,
        taxType: data.taxType,
        taxValue: data.taxValue,
        isActive: data.isActive,
        brandId: data.brandId || 'default-brand-id',
        restaurantId: data.restaurantId || 'default-restaurant-id',
        createdBy: 'current-user-id',
        updatedBy: 'current-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTaxGroups((prev) => [newTaxGroup, ...prev]);
      toast.success(t('taxGroups.create.success'));
      closeModal();
    } catch (error) {
      console.error('Create tax group error:', error);
      toast.error(t('taxGroups.create.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaxGroup = async (data: TaxProductGroupFormData) => {
    if (!editingTaxGroup?._id) return;
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedTaxGroup: TaxProductGroup = {
        ...editingTaxGroup,
        name: data.name,
        productGroupName: data.productGroupName,
        taxType: data.taxType,
        taxValue: data.taxValue,
        isActive: data.isActive,
        brandId: data.brandId || editingTaxGroup.brandId,
        restaurantId: data.restaurantId || editingTaxGroup.restaurantId,
        updatedAt: new Date(),
        updatedBy: 'current-user-id',
      };
      setTaxGroups((prev) =>
        prev.map((group) =>
          group._id === editingTaxGroup._id ? updatedTaxGroup : group
        )
      );
      toast.success(t('taxGroups.update.success'));
      closeModal();
    } catch (error) {
      console.error('Update tax group error:', error);
      toast.error(t('taxGroups.update.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTaxGroup = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTaxGroups((prev) => prev.filter((group) => group._id !== id));
      toast.success(t('taxGroups.delete.success'));
      closeConfirmationModal();
    } catch (error) {
      console.error('Delete tax group error:', error);
      toast.error(t('taxGroups.delete.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TaxProductGroupFormData) => {
    
    try {
      if (isEditing) {
        await handleUpdateTaxGroup(data);
      } else {
        await handleCreateTaxGroup(data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Tag className="h-8 w-8" />
              {t('taxGroups.title')}
            </h1>
            <p className="text-muted-foreground">{t('taxGroups.subtitle')}</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('taxGroups.addTaxGroup')}
          </Button>
        </div>

        {/* Tax Groups Table */}
        <Card>
          <CardContent>
            <DataTable
              data={taxGroups}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('taxGroups.searchPlaceholder')}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Tax Group Form Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            isEditing ? t('taxGroups.edit.title') : t('taxGroups.create.title')
          }
          description={
            isEditing
              ? t('taxGroups.edit.description')
              : t('taxGroups.create.description')
          }
          form={form}
          onSubmit={handleSubmit}
          loading={loading}
          size="xl">
          <TaxGroupFormContent form={form} />
        </CrudModal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig.title}
          description={confirmationConfig.description}
          loading={loading}
          confirmButtonText={confirmationConfig.confirmButtonText}
          cancelButtonText={t('common.cancel')}
          variant={confirmationConfig.variant}
        />
      </div>
    </Layout>
  );
}

export default TaxProductGroupsPage;
