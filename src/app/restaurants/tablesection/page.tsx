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
  TableSectionFormContent,
  useTableSectionForm,
} from '@/components/restaurants/tableSection-form';
import Layout from '@/components/common/layout';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';

import { toast } from 'sonner';
import { useI18n } from '@/providers/i18n-provider';
import { TableAction, TableSection } from '@/types/tablesection.type';
import { TableSectionFormData } from '@/lib/validations/tablesection.validation';

// Mock data - replace with actual API calls
const mockTableSections: TableSection[] = [
  {
    _id: '1',
    restaurantId: '64b23abc123456',
    restaurantName: {
      en: 'Pizza Palace - Downtown',
      ar: 'قصر البيتزا - وسط المدينة',
    },
    name: { en: 'Indoor', ar: 'داخلي' },
    isActive: true,
    deletedAt: new Date('2024-01-10'),
  },
  {
    _id: '2',
    restaurantId: '64b23abc123457',
    restaurantName: {
      en: 'Burger House - Central',
      ar: 'بيت البرجر - المركزية',
    },
    name: { en: 'Outdoor', ar: 'خارجي' },
    isActive: false,
    deletedAt: new Date('2024-01-10'),
  },
];

export default function TableSectionPage() {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [tableSections, setTableSections] =
    useState<TableSection[]>(mockTableSections);
  const [loading, setLoading] = useState(false);

  // Modal hooks
  const {
    isOpen,
    editingItem: editingTableSection,
    openModal,
    closeModal,
  } = useModal<TableSection>();
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useTableSectionForm(editingTableSection);

  const columns = [
    {
      id: 'restaurantName',
      label: t('tableSection.restaurant'),
      accessor: (tableSection: TableSection) => (
        <div>
          <div className="font-medium text-foreground truncate">
            {tableSection.restaurantName[locale] ||
              tableSection.restaurantName.en}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'name',
      label: t('tableSection.name'),
      accessor: (tableSection: TableSection) => (
        <div>
          <div className="font-medium text-foreground truncate">
            {tableSection.name[locale] || tableSection.name.en}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'status',
      label: t('tableSection.status'),
      accessor: (tableSection: TableSection) => (
        <Badge variant={tableSection.isActive ? 'default' : 'secondary'}>
          {tableSection.isActive ? t('tables.active') : t('tables.inactive')}
        </Badge>
      ),
      sortable: true,
    },
  ];

  const actions: TableAction<TableSection>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      onClick: (tableSection) => openModal(tableSection),
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      variant: 'destructive',
      onClick: (tableSection) => {
        openConfirmationModal(() => handleDeleteTableSection(tableSection), {
          title: t('tableSection.deleteConfirmationTitle'),
          description: t('tableSection.deleteConfirmationDescription', {
            name: tableSection.name[locale],
          }),
          confirmButtonText: t('common.delete'),
          variant: 'destructive',
        });
      },
      disabled: (tableSection) => tableSection.isActive ?? false, // Don't allow deleting active brands
    },
  ];

  const handleCreateTableSection = async (data: TableSectionFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTableSection: TableSection = {
        _id: Date.now().toString(),
        ...data,
        deletedAt: new Date(),
        isActive: true,
        restaurantName: mockTableSections.find(
          (r) => r.restaurantId === data.restaurantId
        )?.restaurantName || { en: 'Unknown Restaurant', ar: 'مطعم غير معروف' },
      };

      setTableSections((prev) => [newTableSection, ...prev]);
      toast.success(t('tableSection.addSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTableSection = async (data: TableSectionFormData) => {
    if (!editingTableSection) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedTableSection: TableSection = {
        ...editingTableSection,
        ...data,
        restaurantName: mockTableSections.find(
          (r) => r.restaurantId === data.restaurantId
        )?.restaurantName || { en: 'Unknown Restaurant', ar: 'مطعم غير معروف' },
      };

      setTableSections((prev) =>
        prev.map((section) =>
          section._id === editingTableSection._id ? updatedTableSection : section
        )
      );
      toast.success(t('tableSection.editSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTableSection = async (
    tableSectionToDelete: TableSection
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTableSections((prev) =>
        prev.filter((section) => section._id !== tableSectionToDelete._id)
      );
      toast.success(t('tableSection.deleteSuccess'));
    } catch {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: TableSectionFormData) => {
    if (editingTableSection) {
      await handleUpdateTableSection(data);
    } else {
      await handleCreateTableSection(data);
    }
  };

  const getModalTitle = () => {
    return editingTableSection
      ? t('tableSection.editTitle')
      : t('tableSection.addTitle');
  };

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {t('tableSection.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('tableSection.subtitle')}
            </p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
            disabled={loading}>
            <Plus className="h-4 w-4" />
            {t('tableSection.addNewTableSection')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('tableSection.allTableSections')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tableSections}
              columns={columns}
              actions={actions}
              searchable
              searchPlaceholder={t('tableSection.searchPlaceholder')}
              pagination
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Table Section CRUD Modal */}
        <CrudModal<TableSectionFormData>
          isOpen={isOpen}
          onClose={closeModal}
          title={getModalTitle()}
          form={form}
          onSubmit={handleFormSubmit}
          loading={loading}>
          <TableSectionFormContent form={form} />
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
