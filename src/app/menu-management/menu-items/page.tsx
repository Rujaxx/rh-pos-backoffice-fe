'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/common/layout';
import { useSearchParams } from 'next/navigation';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Save,
  X,
  UtensilsCrossed,
  Filter,
  Upload,
  Download,
  Plus,
} from 'lucide-react';
import {
  MenuItemQueryParams,
  MenuItemFormData,
  MenuItem,
} from '@/types/menu-item.type';
import {
  useBulkUpdateMenuItems,
  useUploadMenuExcel,
  useCreateMenuItem,
  useDeleteMenuItem,
} from '@/services/api/menu-items/menu-items.mutation';
import { useUploadImage } from '@/services/api/upload/upload.mutations';
import { UploadFolderType } from '@/types/upload';
import { useActiveCategories } from '@/services/api/categories/categories.queries';
import { useActiveTaxProductGroups } from '@/services/api/tax-product-groups.ts/tax-product-groups.queries';
import { useActiveKitchenDepartments } from '@/services/api/kitchen-departments/kitchen-departments.queries';
import {
  useMenuItems,
  useActiveMenuItems,
} from '@/services/api/menu-items/menu-items.queries';
import {
  getSortOrderForQuery,
  getSortFieldForQuery,
} from '@/components/menu-management/menu-items/menu-item-table-columns';
import { useEditableMenuItemColumns } from '@/components/menu-management/menu-items/editable-menu-item-columns';
import { useMenuItemChanges } from '@/hooks/useMenuItemChanges';
import {
  ConfirmationModal,
  CrudModal,
  useConfirmationModal,
  useModal,
} from '@/components/ui/crud-modal';
import {
  MenuItemFormContent,
  useMenuItemForm,
} from '@/components/menu-management/menu-items/menu-item-form';
import { Suspense } from 'react';
import { useI18n } from '@/providers/i18n-provider';

export default function MenuItemsPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Page />
    </Suspense>
  );
}

function Page() {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const searchParams = useSearchParams();
  const menuId = searchParams.get('menuId');

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );

  // Build query parameters
  const queryParams = useMemo<MenuItemQueryParams>(() => {
    const params: MenuItemQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortOrder: getSortOrderForQuery(sorting) || 'desc',
    };

    if (menuId) params.menuId = menuId;
    if (searchTerm.trim()) params.term = searchTerm.trim();

    const sortField = getSortFieldForQuery(sorting);
    if (sortField) params.sortOrder = getSortOrderForQuery(sorting) || 'desc';

    if (statusFilter !== undefined) {
      params.isActive = statusFilter === 'active' ? 'true' : 'false';
    }

    return params;
  }, [pagination, sorting, searchTerm, statusFilter, menuId]);

  // Fetch menu items
  const { data: menuItemsResponse, isLoading } = useMenuItems(queryParams);
  const menuItems = menuItemsResponse?.data || [];
  const totalCount = menuItemsResponse?.meta?.total || 0;

  // Fetch dropdown options
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useActiveCategories({
      limit: 100,
    });
  const { data: taxGroupsData, isLoading: isLoadingTaxGroups } =
    useActiveTaxProductGroups({
      limit: 100,
    });
  const { data: kitchenDeptsData, isLoading: isLoadingKitchenDepts } =
    useActiveKitchenDepartments({
      limit: 100,
    });
  const { data: addonsData, isLoading: isLoadingAddons } = useActiveMenuItems({
    isAddon: 'true',
    limit: 100,
  });

  // Prepare options for dropdowns
  const categoriesOptions = useMemo(
    () =>
      categoriesData?.data.map((cat) => ({
        value: cat._id!,
        label: cat.name.en,
      })) || [],
    [categoriesData],
  );

  const taxGroupsOptions = useMemo(
    () =>
      taxGroupsData?.data.map((tax) => ({
        value: tax._id!,
        label: tax.name.en,
      })) || [],
    [taxGroupsData],
  );

  const kitchenDeptOptions = useMemo(
    () =>
      kitchenDeptsData?.data.map((dept) => ({
        value: dept._id!,
        label: dept.name.en,
      })) || [],
    [kitchenDeptsData],
  );

  const addonsOptions = useMemo(
    () =>
      addonsData?.data.map((item) => ({
        value: item._id!,
        label: item.itemName.en,
      })) || [],
    [addonsData],
  );

  const isLoadingOptions =
    isLoadingCategories ||
    isLoadingTaxGroups ||
    isLoadingKitchenDepts ||
    isLoadingAddons;

  // Change tracking
  const {
    updateField,
    getFieldValue,
    isFieldModified,
    getModifiedItemsForUpdate,
    clearChanges,
    modifiedCount,
    hasChanges,
  } = useMenuItemChanges(menuItems);

  // Bulk update mutation
  const bulkUpdateMutation = useBulkUpdateMenuItems(menuId || '');
  const uploadMenuMutation = useUploadMenuExcel();
  const createMenuItemMutation = useCreateMenuItem();
  const uploadImageMutation = useUploadImage();
  const { isOpen, openModal, closeModal } = useModal();
  const { form } = useMenuItemForm(menuId || undefined, null);

  const handleCreateSubmit = async (data: MenuItemFormData) => {
    try {
      await createMenuItemMutation.mutateAsync(data);
      closeModal();
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    const result = await uploadImageMutation.mutateAsync({
      file,
      options: {
        folderType: UploadFolderType.MENU_ITEMS,
      },
    });
    return {
      key: result.data.key,
      url: result.data.url,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && menuId) {
      uploadMenuMutation.mutate({
        file,
        params: { menuId },
      });
    }
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  // Delete mutation
  const deleteMenuItemMutation = useDeleteMenuItem();

  // Confirmation modal for delete
  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Delete handler with ref pattern
  const deleteHandlerRef = useRef<((menuItem: MenuItem) => void) | null>(null);

  const deleteHandler = useCallback((menuItem: MenuItem) => {
    deleteHandlerRef.current?.(menuItem);
  }, []);

  deleteHandlerRef.current = (menuItem: MenuItem) => {
    openConfirmationModal(
      async () => {
        try {
          await deleteMenuItemMutation.mutateAsync(menuItem._id!);
        } catch (err) {
          console.error('Failed to delete menu item:', err);
        }
      },
      {
        title: t('menuItems.delete.title'),
        description: t('menuItems.delete.description', {
          itemName: menuItem.itemName?.[locale] || menuItem.itemName?.en,
        }),
        confirmButtonText: t('common.delete'),
        variant: 'destructive',
      },
    );
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    const itemsToUpdate = getModifiedItemsForUpdate();
    try {
      await bulkUpdateMutation.mutateAsync(itemsToUpdate);
      clearChanges();
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  // Create editable columns
  const columns = useEditableMenuItemColumns({
    updateField,
    getFieldValue,
    isFieldModified,
    categoriesOptions,
    taxGroupsOptions,
    kitchenDeptOptions,
    addonsOptions,
    isLoadingOptions,
    onDelete: deleteHandler,
    onUploadImage: handleImageUpload,
  });

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span>{t('menuItems.title')}</span>
            </h2>
            <p className="text-muted-foreground">{t('menuItems.subtitle')}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status filter */}
            <Button
              variant={statusFilter !== undefined ? 'default' : 'outline'}
              onClick={() => {
                setStatusFilter(
                  statusFilter === 'active'
                    ? 'inactive'
                    : statusFilter === 'inactive'
                      ? undefined
                      : 'active',
                );
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === 'active'
                ? t('menuItems.status.active')
                : statusFilter === 'inactive'
                  ? t('menuItems.status.inactive')
                  : t('categories.allStatus')}
            </Button>

            {/* Upload Button */}
            {menuId && (
              <>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      'https://rhpos-uploads-dev.s3.me-central-1.amazonaws.com/sample_menu_sheet_50.xlsx',
                      '_blank',
                    )
                  }
                  className="h-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('menuItems.downloadSample')}
                </Button>
                <Button onClick={() => openModal()} className="h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('menuItems.addNewItem')}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8"
                  disabled={uploadMenuMutation.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadMenuMutation.isPending
                    ? t('menuItems.uploading')
                    : t('menuItems.uploadMenu')}
                </Button>
              </>
            )}

            {/* Save/Discard buttons */}
            {hasChanges && (
              <>
                <Button
                  variant="outline"
                  onClick={clearChanges}
                  className="h-8"
                  disabled={bulkUpdateMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.discardChanges')}
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="h-8"
                  disabled={bulkUpdateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('common.saveChanges')}
                  {modifiedCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {modifiedCount}
                    </Badge>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-6">
            <TanStackTable
              data={menuItems}
              columns={columns}
              totalCount={totalCount}
              isLoading={isLoading || bulkUpdateMutation.isPending}
              searchValue={searchTerm}
              searchPlaceholder={t('menuItems.searchPlaceholder')}
              onSearchChange={setSearchTerm}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={setSorting}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              manualPagination={true}
              manualSorting={true}
              manualFiltering={true}
              showSearch={true}
              showPagination={true}
              showPageSizeSelector={true}
              emptyMessage={t('menuItems.errorLoading')}
              enableMultiSort={false}
            />
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteMenuItemMutation.isPending}
        />
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={t('menuItems.form.createTitle')}
          description={t('menuItems.form.createDescription')}
          form={form}
          onSubmit={handleCreateSubmit}
          loading={createMenuItemMutation.isPending}
          size="xl"
          submitButtonText={t('menuItems.form.createButton')}
        >
          <MenuItemFormContent form={form} />
        </CrudModal>
        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={deleteMenuItemMutation.isPending}
        />
      </div>
    </Layout>
  );
}
