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
import {
  RawItem,
  RawItemQueryParams,
  RawItemType,
} from '@/types/raw-materials.type';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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

// Mock outlets data
const mockOutlets = [
  { id: 'outlet1', name: 'Main Restaurant' },
  { id: 'outlet2', name: 'Food Court Stall' },
  { id: 'outlet3', name: 'Express Counter' },
  { id: 'outlet4', name: 'Cafeteria' },
];

// Copy Raw Material Modal Component
function CopyRawMaterialModal({
  isOpen,
  onClose,
  items,
  onCopy,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: RawItem[];
  onCopy: (outletIds: string[]) => void;
}) {
  const { t } = useTranslation();
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);

  const handleSelectAllOutlets = () => {
    if (selectedOutlets.length === mockOutlets.length) {
      setSelectedOutlets([]);
    } else {
      setSelectedOutlets(mockOutlets.map((outlet) => outlet.id));
    }
  };

  const toggleOutlet = (outletId: string) => {
    setSelectedOutlets((prev) =>
      prev.includes(outletId)
        ? prev.filter((id) => id !== outletId)
        : [...prev, outletId],
    );
  };

  const handleCopy = () => {
    if (selectedOutlets.length === 0) {
      toast.error('Please select at least one outlet');
      return;
    }
    onCopy(selectedOutlets);
    onClose();
  };

  const getItemNames = () => {
    if (items.length === 1) {
      return items[0].name;
    }
    return `${items.length} items`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copy Raw Material
          </DialogTitle>
          <DialogDescription>
            Copy `&quot;`{getItemNames()}`&quot;` to selected outlets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Select Outlets</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllOutlets}
              className="h-7"
            >
              {selectedOutlets.length === mockOutlets.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </div>

          {/* Replace ScrollArea with div and max-height */}
          <div className="max-h-60 overflow-y-auto border rounded-md p-4">
            <div className="space-y-3">
              {mockOutlets.map((outlet) => (
                <div key={outlet.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`outlet-${outlet.id}`}
                    checked={selectedOutlets.includes(outlet.id)}
                    onCheckedChange={() => toggleOutlet(outlet.id)}
                  />
                  <Label
                    htmlFor={`outlet-${outlet.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {outlet.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedOutlets.length} outlet(s) selected
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to {selectedOutlets.length} Outlet(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
      return `All ${totalCount} items selected`;
    } else if (selectedIds.length > 0) {
      return `${selectedIds.length} item${selectedIds.length !== 1 ? 's' : ''} selected`;
    }
    return null;
  }, [selectedIds.length, selectAllMode, totalCount]);

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
      toast.error('Please select items to copy');
      return;
    }
    setItemsToCopy(selectedItems);
    setIsCopyModalOpen(true);
  }, [selectedItems]);

  const handleCopyToOutlets = useCallback(
    (outletIds: string[]) => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          const itemNames = itemsToCopy.map((item) => item.name).join(', ');
          const outletNames = outletIds
            .map((id) => mockOutlets.find((o) => o.id === id)?.name || id)
            .join(', ');

          toast.success(
            `Copied ${itemsToCopy.length} item(s) to ${outletIds.length} outlet(s)`,
            {
              description: `${itemNames} copied to ${outletNames}`,
            },
          );

          // Clear selection after copy
          clearSelection();
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to copy items');
        setIsLoading(false);
      }
    },
    [itemsToCopy, clearSelection],
  );

  const handleDelete = useCallback(
    (item: RawItem) => {
      openConfirmationModal(
        async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(
              t('rawMaterials.deletedSuccess') || 'Raw material deleted',
            );
          } catch (error) {
            const msg =
              error instanceof Error
                ? error.message
                : t('rawMaterials.deleteError') ||
                  'Failed to delete raw material';
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
      toast.error('Please select items to delete');
      return;
    }

    openConfirmationModal(
      async () => {
        setIsLoading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const itemCount = selectAllMode ? totalCount : selectedItems.length;
          toast.success(`Deleted ${itemCount} item(s)`);
          clearSelection();
        } catch (error) {
          toast.error('Failed to delete items');
        } finally {
          setIsLoading(false);
        }
      },
      {
        title: 'Delete Selected Items',
        description: selectAllMode
          ? `Are you sure you want to delete all ${totalCount} items?`
          : `Are you sure you want to delete ${selectedItems.length} selected item(s)?`,
        confirmButtonText: 'Delete',
        variant: 'destructive',
      },
    );
  }, [
    selectedItems,
    selectAllMode,
    totalCount,
    openConfirmationModal,
    clearSelection,
  ]);

  const handleBarcodeGeneration = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to generate barcodes');
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(`Generated barcodes for ${selectedItems.length} item(s)`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to generate barcodes');
      setIsLoading(false);
    }
  }, [selectedItems]);

  const handleBulkActivate = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to activate');
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(`Activated ${selectedItems.length} item(s)`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to activate items');
      setIsLoading(false);
    }
  }, [selectedItems]);

  const handleBulkDeactivate = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to deactivate');
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(`Deactivated ${selectedItems.length} item(s)`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to deactivate items');
      setIsLoading(false);
    }
  }, [selectedItems]);

  // Export handlers
  const handleExportCurrentPage = useCallback(() => {
    const itemCount = paginatedData.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(`Exported current page (${itemCount} items)`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to export current page');
      setIsLoading(false);
    }
  }, [paginatedData]);

  const handleExportAll = useCallback(() => {
    const itemCount = filteredItems.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(`Exported all data (${itemCount} items)`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to export all data');
      setIsLoading(false);
    }
  }, [filteredItems]);

  const handleExportSelected = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to export');
      return;
    }

    const itemCount = selectAllMode ? totalCount : selectedItems.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(`Exported ${itemCount} selected item(s)`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to export selected items');
      setIsLoading(false);
    }
  }, [selectedItems, selectAllMode, totalCount]);

  // Import handlers
  const handleDownloadTemplate = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success('Template downloaded successfully');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to download template');
      setIsLoading(false);
    }
  }, []);

  const handleUploadData = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success('Data uploaded successfully');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to upload data');
      setIsLoading(false);
    }
  }, []);

  // Get columns with all actions
  const baseColumns = useRawItemColumns(
    openModal,
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
          <div className="flex items-center">
            <Checkbox
              checked={isAllOnPageSelected}
              onCheckedChange={handleSelectCurrentPage}
              aria-label="Select all on current page"
            />
          </div>
        );
      },
      cell: ({ row }: { row: Row<RawItem> }) => {
        const item = row.original;
        const isSelected = selectAllMode || selectedIds.includes(item._id);

        return (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelectItem(item._id)}
            aria-label={`Select ${item.name}`}
          />
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
  ]);

  // Submit handler
  const handleSubmit = useCallback(
    async (data: RawItemFormData) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingRawItem) {
          toast.success(
            t('rawMaterials.updatedSuccess') || 'Raw material updated',
          );
        } else {
          toast.success(
            t('rawMaterials.createdSuccess') || 'Raw material created',
          );
        }
        closeModal();
      } catch (error) {
        toast.error(
          t('rawMaterials.saveError') || 'Failed to save raw material',
        );
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
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleBulkCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy {selectAllMode ? 'All' : 'Selected'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBarcodeGeneration}>
                      <Barcode className="mr-2 h-4 w-4" />
                      Generate Barcode {selectAllMode ? 'All' : 'Selected'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportSelected}>
                      <Download className="mr-2 h-4 w-4" />
                      Export {selectAllMode ? 'All' : 'Selected'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkActivate}>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Activate {selectAllMode ? 'All' : 'Selected'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkDeactivate}>
                      <Square className="mr-2 h-4 w-4" />
                      Deactivate {selectAllMode ? 'All' : 'Selected'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleBulkDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete {selectAllMode ? 'All' : 'Selected'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7"
                >
                  {selectAllMode ? 'Deselect All' : 'Select All'}
                </Button>

                {/* Copy button for selected items */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkCopy}
                  className="h-7 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="h-7"
              >
                Select All
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
                  Download Template
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUploadData}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Data
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
                  Export Current Page
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({paginatedData.length} items)
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAll}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export All Data
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({filteredItems.length} items)
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleExportSelected}
                  disabled={selectedItems.length === 0 && !selectAllMode}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Selected
                  <span className="ml-auto text-xs text-muted-foreground">
                    {selectAllMode
                      ? `(${totalCount} items)`
                      : selectedItems.length > 0
                        ? `(${selectedItems.length} items)`
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
