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
import {
  Edit,
  Plus,
  Trash2,
  UtensilsCrossed,
  ClipboardList,
} from 'lucide-react';
import { useIntl } from 'react-intl';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { mockMenus } from '@/mock/menus';
import { Menu, MenuFormData, MenuTableAction } from '@/types/menu.type';
import MenuFormContent, {
  useMenuForm,
} from '@/components/menu-management/menu/menu-form';

function MenusPage() {
  const { t } = useTranslation();
  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const [loading, setLoading] = useState(false);
  const locale = useIntl().locale as 'en' | 'ar';

  // Modal hooks
  const {
    isOpen,
    editingItem: editingMenu,
    openModal,
    closeModal,
  } = useModal<Menu>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form, isEditing } = useMenuForm(editingMenu);

  // Table columns configuration
  const columns = [
    {
      id: 'name',
      label: t('menus.table.name'),
      sortable: true,
      accessor: (menu: Menu) => (
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          {menu.name[locale]}
        </div>
      ),
    },
    {
      id: 'shortCode',
      label: t('menus.table.shortCode'),
      sortable: true,
      accessor: 'shortCode',
    },
    {
      id: 'isActive',
      label: t('menus.table.status'),
      sortable: true,
      accessor: (menu: Menu) => (
        <Badge variant={menu.isActive ? 'default' : 'secondary'}>
          {menu.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
    {
      id: 'isPosDefault',
      label: t('menus.table.posDefault'),
      sortable: true,
      accessor: (menu: Menu) =>
        menu.isPosDefault ? (
          <Badge variant="default">{t('menus.table.pos')}</Badge>
        ) : (
          <Badge variant="secondary">{t('common.no')}</Badge>
        ),
    },
    {
      id: 'isDigitalDefault',
      label: t('menus.table.digitalDefault'),
      sortable: true,
      accessor: (menu: Menu) =>
        menu.isDigitalDefault ? (
          <Badge variant="default">{t('menus.table.digital')}</Badge>
        ) : (
          <Badge variant="secondary">{t('common.no')}</Badge>
        ),
    },
  ];

  // Table actions configuration
  const actions: MenuTableAction<Menu>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      onClick: (menu: Menu) => openModal(menu),
      variant: 'default',
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      onClick: (menu: Menu) => {
        openConfirmationModal(
          async () => {
            await handleDeleteMenu(menu._id!);
          },
          {
            title: t('menus.delete.title'),
            description: t('menus.delete.description', {
              name: menu.name[locale],
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
  const handleCreateMenu = async (data: MenuFormData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
      const newMenu: Menu = {
        ...data,
        _id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'your-user-id',
        updatedBy: 'your-user-id',
      };
      setMenus((prev) => [newMenu, ...prev]);
      toast.success(t('menus.create.success'));
      closeModal();
    } catch (error) {
      console.error('Create menu error:', error);
      toast.error(t('menus.create.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenu = async (data: MenuFormData) => {
    if (!editingMenu?._id) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
      const updatedMenu: Menu = {
        ...editingMenu,
        ...data,
        updatedAt: new Date(),
        updatedBy: 'your-user-id',
      };
      setMenus((prev) =>
        prev.map((menu) => (menu._id === editingMenu._id ? updatedMenu : menu))
      );
      toast.success(t('menus.update.success'));
      closeModal();
    } catch (error) {
      console.error('Update menu error:', error);
      toast.error(t('menus.update.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
      setMenus((prev) => prev.filter((menu) => menu._id !== id));
      toast.success(t('menus.delete.success'));
      closeConfirmationModal();
    } catch (error) {
      console.error('Delete menu error:', error);
      toast.error(t('menus.delete.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: MenuFormData) => {
    if (isEditing) {
      await handleUpdateMenu(data);
    } else {
      await handleCreateMenu(data);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8" />
              {t('menus.title')}
            </h1>
            <p className="text-muted-foreground">{t('menus.subtitle')}</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('menus.addMenu')}
          </Button>
        </div>

        {/* Menus Table */}
        <Card>
          <CardContent>
            <DataTable
              data={menus}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('menus.searchPlaceholder')}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Menu Form Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={isEditing ? t('menus.edit.title') : t('menus.create.title')}
          description={
            isEditing
              ? t('menus.edit.description')
              : t('menus.create.description')
          }
          form={form}
          onSubmit={handleSubmit}
          loading={loading}
          size="xl">
          <MenuFormContent form={form} />
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

export default MenusPage;
