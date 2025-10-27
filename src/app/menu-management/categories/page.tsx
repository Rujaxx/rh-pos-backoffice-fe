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
import { Edit, Plus, Trash2, Folder, FolderTree } from 'lucide-react';
import {
  Category,
  CategoryFormData,
  CategoryTableAction,
} from '@/types/category.type';
import { useIntl } from 'react-intl';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockCategories } from '@/mock/categories';
import CategoryFormContent, {
  useCategoryForm,
} from '@/components/menu-management/categories/category-form';

function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const locale = useIntl().locale as 'en' | 'ar';

  // Modal hooks
  const {
    isOpen,
    editingItem: editingCategory,
    openModal,
    closeModal,
  } = useModal<Category>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form, isEditing } = useCategoryForm(editingCategory);

  // Table columns configuration
  const columns = [
    {
      id: 'name',
      label: t('categories.table.name'),
      sortable: true,
      accessor: (category: Category) => (
        <div className="flex items-center gap-2">
          {category.parentCategoryId ? (
            <FolderTree className="w-4 h-4 text-primary" />
          ) : (
            <Folder className="w-4 h-4 text-primary" />
          )}
          {category.name[locale]}
        </div>
      ),
    },
    {
      id: 'shortCode',
      label: t('categories.table.shortCode'),
      sortable: true,
      accessor: 'shortCode',
    },
    {
      id: 'isActive',
      label: t('categories.table.status'),
      sortable: true,
      accessor: (category: Category) => (
        <Badge variant={category.isActive ? 'default' : 'secondary'}>
          {category.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  // Table actions configuration
  const actions: CategoryTableAction<Category>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      onClick: (category: Category) => openModal(category),
      variant: 'default',
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      onClick: (category: Category) => {
        openConfirmationModal(
          async () => {
            await handleDeleteCategory(category._id!);
          },
          {
            title: t('categories.delete.title'),
            description: t('categories.delete.description', {
              name: category.name[locale],
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
  const handleCreateCategory = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      // Simulate API call and receive a new object
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newCategory: Category = {
        ...data,
        _id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'your-user-id',
        updatedBy: 'your-user-id',
        brandId: 'your-brand-id',
      };
      setCategories((prev) => [newCategory, ...prev]);
      toast.success(t('categories.create.success'));
      closeModal();
    } catch (error) {
      console.error('Create category error:', error);
      toast.error(t('categories.create.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory?._id) return;
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedCategory: Category = {
        ...editingCategory,
        ...data,
        updatedAt: new Date(),
        updatedBy: 'your-user-id',
      };
      setCategories((prev) =>
        prev.map((category) =>
          category._id === editingCategory._id ? updatedCategory : category
        )
      );
      toast.success(t('categories.update.success'));
      closeModal();
    } catch (error) {
      console.error('Update category error:', error);
      toast.error(t('categories.update.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCategories((prev) => prev.filter((category) => category._id !== id));
      toast.success(t('categories.delete.success'));
      closeConfirmationModal();
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error(t('categories.delete.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    if (isEditing) {
      await handleUpdateCategory(data);
    } else {
      await handleCreateCategory(data);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Folder className="h-8 w-8" />
              {t('categories.title')}
            </h1>
            <p className="text-muted-foreground">{t('categories.subtitle')}</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('categories.addCategory')}
          </Button>
        </div>

        {/* Categories Table */}
        <Card>
          <CardContent>
            <DataTable
              data={categories}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('categories.searchPlaceholder')}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Category Form Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            isEditing
              ? t('categories.edit.title')
              : t('categories.create.title')
          }
          description={
            isEditing
              ? t('categories.edit.description')
              : t('categories.create.description')
          }
          form={form}
          onSubmit={handleSubmit}
          loading={loading}
          size="xl">
          <CategoryFormContent form={form} />
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

export default CategoriesPage;
