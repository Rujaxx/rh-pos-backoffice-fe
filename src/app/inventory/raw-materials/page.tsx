'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
  Row,
} from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  useModal,
  CrudModal,
  ConfirmationModal,
  useConfirmationModal,
} from '@/components/ui/crud-modal';
import {
  RawItemFormContent,
  useRawItemForm,
} from '@/components/inventory/raw-materials/raw-materials-form';
import { useRawItemColumns } from '@/components/inventory/raw-materials/raw-materials-cols';
import { RawItemDetailsModal } from '@/components/inventory/raw-materials/raw-materials-details-modal';
import { CopyRawMaterialModal } from '@/components/inventory/raw-materials/copy-raw-material-modal';
import Layout from '@/components/common/layout';
import {
  Plus,
  Package,
  Filter,
  Download,
  Upload,
  Trash2,
  CheckSquare,
  Square,
  Copy,
  Barcode,
  FileDown,
  FileUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { RawItem, RawItemType } from '@/types/raw-materials.type';
import { RawItemFormData } from '@/lib/validations/raw-item.validation';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Minimal mock data for testing
const mockRawItems: RawItem[] = [
  {
    _id: '1',
    name: 'Banana Chips',
    type: 'FINISHED',
    baseUnit: 'kg',
    minimumStock: 10,
    expectedWasteRatio: 0.05,
    restaurantId: 'rest1',
    brandId: 'brand1',
    isActive: true,
    createdBy: 'Demo',
    updatedBy: 'Demo',
    createdAt: new Date('2023-06-15T10:57:00Z'),
    updatedAt: new Date('2023-06-15T10:57:00Z'),
  },
  {
    _id: '2',
    name: 'Bar Code Labels',
    type: 'RAW',
    baseUnit: 'pack',
    minimumStock: 50,
    expectedWasteRatio: 0.02,
    restaurantId: 'rest1',
    brandId: 'brand1',
    isActive: false,
    createdBy: 'Demo',
    updatedBy: 'Demo',
    createdAt: new Date('2023-06-14T10:59:42Z'),
    updatedAt: new Date('2023-06-14T10:59:42Z'),
  },
];

export default function RawMaterialsPage() {
  const { t } = useTranslation();

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
  const [typeFilter, setTypeFilter] = useState<RawItemType | undefined>(
    undefined,
  );

  // SELECTION STATE
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllMode, setSelectAllMode] = useState<boolean>(false);

  // Details Modal State
  const [selectedItem, setSelectedItem] = useState<RawItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Copy Modal State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [itemsToCopy, setItemsToCopy] = useState<RawItem[]>([]);

  // Modal hooks
  const {
    isOpen,
    editingItem: editingRawItem,
    openModal,
    closeModal,
  } = useModal<RawItem>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useRawItemForm(editingRawItem);

  // Mock loading state
  const [isLoading, setIsLoading] = useState(false);

  // Mock data filtering
  const filteredItems = useMemo(() => {
    let items = [...mockRawItems];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(term));
    }

    if (statusFilter === 'active') {
      items = items.filter((item) => item.isActive);
    } else if (statusFilter === 'inactive') {
      items = items.filter((item) => !item.isActive);
    }

    if (typeFilter) {
      items = items.filter((item) => item.type === typeFilter);
    }

    return items;
  }, [searchTerm, statusFilter, typeFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, pagination.pageIndex, pagination.pageSize]);

  const totalCount = filteredItems.length;

  // Get selected items
  const selectedItems = useMemo(() => {
    return filteredItems.filter((item) => selectedIds.includes(item._id));
  }, [filteredItems, selectedIds]);

  // Selection calculations
  const allIds = useMemo(
    () => filteredItems.map((item) => item._id),
    [filteredItems],
  );

  const currentPageIds = useMemo(
    () => paginatedData.map((item) => item._id),
    [paginatedData],
  );

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    if (selectAllMode) {
      // Deselect everything
      setSelectedIds([]);
      setSelectAllMode(false);
    } else {
      // Enter select all mode
      setSelectAllMode(true);
      setSelectedIds(allIds);
    }
  }, [selectAllMode, allIds]);

  const handleSelectCurrentPage = useCallback(() => {
    // Check if all items on current page are selected
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Deselect all on current page
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      // Select all on current page
      const newSelection = [...selectedIds];
      currentPageIds.forEach((id) => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      setSelectedIds(newSelection);
    }
    setSelectAllMode(false);
  }, [selectedIds, currentPageIds]);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
    setSelectAllMode(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectAllMode(false);
  }, []);

  // Get selection info text
  const getSelectionInfo = useCallback(() => {
    if (selectAllMode) {
      return t('rawMaterials.allItemsSelected', { count: totalCount });
    } else if (selectedIds.length > 0) {
      return t('rawMaterials.itemsSelected', { count: selectedIds.length });
    }
    return null;
  }, [selectedIds.length, selectAllMode, totalCount, t]);

  // Handlers
  const handleViewDetails = useCallback((item: RawItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  }, []);

  const handleSingleCopy = useCallback((item: RawItem) => {
    setItemsToCopy([item]);
    setIsCopyModalOpen(true);
  }, []);

  const handleBulkCopy = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error(
        t('rawMaterials.selectItemsToCopy') || 'Please select items to copy',
      );
      return;
    }
    setItemsToCopy(selectedItems);
    setIsCopyModalOpen(true);
  }, [selectedItems, t]);

  const handleCopyToOutlets = useCallback(
    (outletIds: string[]) => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          toast.success(t('rawMaterials.copySuccess'), {
            description: t('rawMaterials.copiedSuccess'),
          });

          // Clear selection after copy
          clearSelection();
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast.error(t('rawMaterials.copyFailed') || 'Failed to copy items');
        setIsLoading(false);
      }
    },
    [clearSelection, t],
  );

  const handleDelete = useCallback(
    (item: RawItem) => {
      openConfirmationModal(
        async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(t('rawMaterials.deletedSuccess'));
          } catch (error) {
            const msg =
              error instanceof Error
                ? error.message
                : t('rawMaterials.deleteError');
            toast.error(msg);
          } finally {
            setIsLoading(false);
          }
        },
        {
          title: t('rawMaterials.deleteItem'),
          description: t('rawMaterials.deleteConfirmation', {
            itemName: item.name,
          }),
          confirmButtonText: t('rawMaterials.deleteButton'),
          variant: 'destructive',
        },
      );
    },
    [openConfirmationModal, t],
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error(
        t('rawMaterials.selectItemsToDelete') ||
          'Please select items to delete',
      );
      return;
    }

    openConfirmationModal(
      async () => {
        setIsLoading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const itemCount = selectAllMode ? totalCount : selectedItems.length;
          toast.success(
            t('rawMaterials.bulkDeleteSuccess', { count: itemCount }),
          );
          clearSelection();
        } catch (error) {
          toast.error(
            t('rawMaterials.bulkDeleteFailed') || 'Failed to delete items',
          );
        } finally {
          setIsLoading(false);
        }
      },
      {
        title: t('rawMaterials.bulkDeleteTitle'),
        description: selectAllMode
          ? t('rawMaterials.bulkDeleteAll', { count: totalCount })
          : t('rawMaterials.bulkDeleteSelected', {
              count: selectedItems.length,
            }),
        confirmButtonText: t('rawMaterials.deleteButton'),
        variant: 'destructive',
      },
    );
  }, [
    selectedItems,
    selectAllMode,
    totalCount,
    openConfirmationModal,
    clearSelection,
    t,
  ]);

  const handleBarcodeGeneration = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error(
        t('rawMaterials.selectItemsForBarcode') ||
          'Please select items to generate barcodes',
      );
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(
          t('rawMaterials.barcodeSuccess', { count: selectedItems.length }),
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.barcodeFailed') || 'Failed to generate barcodes',
      );
      setIsLoading(false);
    }
  }, [selectedItems, t]);

  const handleBulkActivate = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error(
        t('rawMaterials.selectItemsToActivate') ||
          'Please select items to activate',
      );
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(
          t('rawMaterials.activateSuccess', { count: selectedItems.length }),
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.activateFailed') || 'Failed to activate items',
      );
      setIsLoading(false);
    }
  }, [selectedItems, t]);

  const handleBulkDeactivate = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error(
        t('rawMaterials.selectItemsToDeactivate') ||
          'Please select items to deactivate',
      );
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(
          t('rawMaterials.deactivateSuccess', { count: selectedItems.length }),
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.deactivateFailed') || 'Failed to deactivate items',
      );
      setIsLoading(false);
    }
  }, [selectedItems, t]);

  // Export handlers
  const handleExportCurrentPage = useCallback(() => {
    const itemCount = paginatedData.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(
          t('rawMaterials.exportCurrentPageSuccess', { count: itemCount }),
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.exportFailed') || 'Failed to export current page',
      );
      setIsLoading(false);
    }
  }, [paginatedData, t]);

  const handleExportAll = useCallback(() => {
    const itemCount = filteredItems.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('rawMaterials.exportAllSuccess', { count: itemCount }));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.exportFailed') || 'Failed to export all data',
      );
      setIsLoading(false);
    }
  }, [filteredItems, t]);

  const handleExportSelected = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error(
        t('rawMaterials.selectItemsToExport') ||
          'Please select items to export',
      );
      return;
    }

    const itemCount = selectAllMode ? totalCount : selectedItems.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(
          t('rawMaterials.exportSelectedSuccess', { count: itemCount }),
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.exportFailed') || 'Failed to export selected items',
      );
      setIsLoading(false);
    }
  }, [selectedItems, selectAllMode, totalCount, t]);

  // Import handlers
  const handleDownloadTemplate = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('rawMaterials.templateDownloadSuccess'));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(
        t('rawMaterials.templateDownloadFailed') ||
          'Failed to download template',
      );
      setIsLoading(false);
    }
  }, [t]);

  const handleUploadData = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('rawMaterials.uploadSuccess'));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(t('rawMaterials.uploadFailed') || 'Failed to upload data');
      setIsLoading(false);
    }
  }, [t]);

  // Get columns with all actions
  const baseColumns = useRawItemColumns(
    (item) => openModal(item),
    handleDelete,
    handleSingleCopy,
    handleViewDetails,
  );

  // Calculate if all items on current page are selected
  const isAllOnPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  // Add selection column at the beginning
  const columnsWithSelection = useMemo(() => {
    const selectionColumn = {
      id: 'select',
      header: () => {
        return (
          <div className="flex items-center p-2">
            <Checkbox
              checked={isAllOnPageSelected}
              onCheckedChange={handleSelectCurrentPage}
              aria-label={
                t('rawMaterials.selectAllCurrentPage') ||
                'Select all on current page'
              }
            />
          </div>
        );
      },
      cell: ({ row }: { row: Row<RawItem> }) => {
        const item = row.original;
        const isSelected = selectAllMode || selectedIds.includes(item._id);

        return (
          <div className="p-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelectItem(item._id)}
              aria-label={
                t('rawMaterials.selectItem', { name: item.name }) ||
                `Select ${item.name}`
              }
            />
          </div>
        );
      },
      size: 50,
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...baseColumns];
  }, [
    baseColumns,
    selectedIds,
    isAllOnPageSelected,
    handleSelectCurrentPage,
    selectAllMode,
    toggleSelectItem,
    t,
  ]);

  // Submit handler
  const handleSubmit = useCallback(
    async (data: RawItemFormData) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingRawItem) {
          toast.success(t('rawMaterials.updatedSuccess'));
        } else {
          toast.success(t('rawMaterials.createdSuccess'));
        }
        closeModal();
      } catch (error) {
        toast.error(t('rawMaterials.saveError'));
      } finally {
        setIsLoading(false);
      }
    },
    [editingRawItem, closeModal, t],
  );

  // Search handler
  const handleSearchChange = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      clearSelection();
    },
    [clearSelection],
  );

  // Pagination handler
  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
  );

  // Sorting handler
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Column filters handler
  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      clearSelection();
    },
    [clearSelection],
  );

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedItem(null);
  }, []);

  const handleCloseCopyModal = useCallback(() => {
    setIsCopyModalOpen(false);
    setItemsToCopy([]);
  }, []);

  const handleDetailsModalDelete = useCallback(
    (item: RawItem) => {
      setIsDetailsModalOpen(false);
      handleDelete(item);
    },
    [handleDelete],
  );

  const handleDetailsModalEdit = useCallback(
    (item: RawItem) => {
      setIsDetailsModalOpen(false);
      openModal(item);
    },
    [openModal],
  );

  const selectionInfo = getSelectionInfo();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span>{t('rawMaterials.title')}</span>
            </h2>
            <p className="text-muted-foreground">
              {t('rawMaterials.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Selection info and controls */}
            {selectionInfo ? (
              <div className="flex items-center gap-2 mr-2">
                <Badge variant="secondary" className="h-7">
                  {selectionInfo}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7">
                      {t('rawMaterials.bulkActions')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleBulkCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      {t('rawMaterials.bulkActions.copySelected')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBarcodeGeneration}>
                      <Barcode className="mr-2 h-4 w-4" />
                      {t('rawMaterials.bulkActions.generateBarcode')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportSelected}>
                      <Download className="mr-2 h-4 w-4" />
                      {t('rawMaterials.bulkActions.exportSelected')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkActivate}>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      {t('rawMaterials.bulkActions.activateSelected')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkDeactivate}>
                      <Square className="mr-2 h-4 w-4" />
                      {t('rawMaterials.bulkActions.deactivateSelected')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleBulkDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('rawMaterials.bulkActions.deleteSelected')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7"
                >
                  {selectAllMode
                    ? t('rawMaterials.deselectAll')
                    : t('rawMaterials.selectAll')}
                </Button>

                {/* Copy button for selected items */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkCopy}
                  className="h-7 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  {t('rawMaterials.copy')}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="h-7"
              >
                {t('rawMaterials.selectAll')}
              </Button>
            )}

            {/* Status filter button */}
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
                clearSelection();
              }}
              className="h-8 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>
                {statusFilter === 'active'
                  ? t('rawMaterials.active')
                  : statusFilter === 'inactive'
                    ? t('rawMaterials.inactive')
                    : t('rawMaterials.allStatus')}
              </span>
            </Button>

            {/* Import Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{t('rawMaterials.import')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadTemplate}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('rawMaterials.downloadTemplate')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUploadData}>
                  <FileUp className="mr-2 h-4 w-4" />
                  {t('rawMaterials.uploadData')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{t('rawMaterials.export')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCurrentPage}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('rawMaterials.exportCurrentPage')}
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({paginatedData.length} {t('common.items')})
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAll}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('rawMaterials.exportAll')}
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({filteredItems.length} {t('common.items')})
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleExportSelected}
                  disabled={selectedItems.length === 0 && !selectAllMode}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('rawMaterials.exportSelected')}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {selectAllMode
                      ? `(${totalCount} ${t('common.items')})`
                      : selectedItems.length > 0
                        ? `(${selectedItems.length} ${t('common.items')})`
                        : ''}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => openModal()}
              className="h-8 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('rawMaterials.addNew')}</span>
            </Button>
          </div>
        </div>

        {/* TanStack Table */}
        <Card>
          <CardContent className="p-6">
            <TanStackTable
              data={paginatedData}
              columns={columnsWithSelection}
              totalCount={totalCount}
              isLoading={isLoading}
              searchValue={searchTerm}
              searchPlaceholder={t('rawMaterials.searchPlaceholder')}
              onSearchChange={handleSearchChange}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              sorting={sorting}
              onSortingChange={handleSortingChange}
              columnFilters={columnFilters}
              onColumnFiltersChange={handleColumnFiltersChange}
              manualPagination={true}
              manualSorting={true}
              manualFiltering={true}
              showSearch={true}
              showPagination={true}
              showPageSizeSelector={true}
              emptyMessage={t('common.na')}
              enableMultiSort={false}
            />
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            editingRawItem
              ? t('rawMaterials.form.editTitle')
              : t('rawMaterials.form.createTitle')
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isLoading}
          submitButtonText={
            editingRawItem
              ? t('rawMaterials.form.updateButton')
              : t('rawMaterials.form.createButton')
          }
        >
          <RawItemFormContent form={form} editingItem={editingRawItem} />
        </CrudModal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          onConfirm={executeConfirmation || (() => Promise.resolve())}
          title={confirmationConfig?.title}
          description={confirmationConfig?.description}
          confirmButtonText={confirmationConfig?.confirmButtonText}
          variant={confirmationConfig?.variant}
          loading={isLoading}
        />

        {/* Raw Item Details Modal */}
        <RawItemDetailsModal
          item={selectedItem}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onDelete={handleDetailsModalDelete}
          onEdit={handleDetailsModalEdit}
        />

        {/* Copy Raw Material Modal */}
        <CopyRawMaterialModal
          isOpen={isCopyModalOpen}
          onClose={handleCloseCopyModal}
          items={itemsToCopy}
          onCopy={handleCopyToOutlets}
        />
      </div>
    </Layout>
  );
}
