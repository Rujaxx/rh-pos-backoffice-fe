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
import Layout from '@/components/common/layout';
import {
  Plus,
  Download,
  Upload,
  Trash2,
  FileUp,
  Truck,
  Filter,
  FileDown,
  Power,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Vendor,
  PaymentMethod,
  BalanceType,
  VendorStatus,
} from '@/types/vendors.type';
import { useVendorColumns } from '@/components/inventory/vendors/vendors-columns';
import { VendorDetailsModal } from '@/components/inventory/vendors/vendors-details-modal';
import { VendorPaymentSettlementModal } from '@/components/inventory/vendors/payment-settlement-modal';
import {
  VendorFormContent,
  useVendorForm,
} from '@/components/inventory/vendors/vendors-form';
import { CreateVendorData } from '@/lib/validations/vendors.validation';

// Mock data
const mockVendors: Vendor[] = [
  {
    _id: '1',
    name: 'ABC Vegetables',
    email: 'qwert@petpooja.com',
    phone: '1234567890',
    gstNumber: '',
    panNumber: '',
    paymentType: PaymentMethod.CASH,
    creditLimit: 50000,
    openingBalance: 0,
    currentBalance: 10400,
    balanceType: BalanceType.PAYABLE,
    restaurantId: '1',
    brandId: '1',
    isActive: true,
    createdBy: 'Demo User',
    updatedBy: 'Demo User',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    brandName: { en: 'Demo Brand' },
    restaurantName: { en: 'Demo Restaurant' },
    status: VendorStatus.ACTIVE,
  },
  {
    _id: '2',
    name: 'XYZ Groceries',
    email: 'xyz@petpooja.com',
    phone: '0987654321',
    gstNumber: '',
    panNumber: '',
    paymentType: PaymentMethod.CASH,
    creditLimit: 50000,
    openingBalance: 0,
    currentBalance: 10400,
    balanceType: BalanceType.PAYABLE,
    restaurantId: '1',
    brandId: '1',
    isActive: true,
    createdBy: 'Demo User',
    updatedBy: 'Demo User',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    brandName: { en: 'Demo Brand' },
    restaurantName: { en: 'Demo Restaurant' },
    status: VendorStatus.ACTIVE,
  },
];

export default function VendorsPage() {
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

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllMode, setSelectAllMode] = useState<boolean>(false);

  // Modal states
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Payment Settlement Modal
  const [isPaymentSettlementModalOpen, setIsPaymentSettlementModalOpen] =
    useState(false);
  const [settlementVendor, setSettlementVendor] = useState<Vendor | null>(null);

  // Modal hooks
  const {
    isOpen,
    editingItem: editingVendor,
    openModal,
    closeModal,
  } = useModal<Vendor>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useVendorForm(editingVendor);
  const [isLoading, setIsLoading] = useState(false);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let vendors = [...mockVendors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      vendors = vendors.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(term) ||
          vendor.email?.toLowerCase().includes(term) ||
          vendor.phone?.includes(term),
      );
    }

    if (statusFilter === 'active') {
      vendors = vendors.filter((vendor) => vendor.isActive);
    } else if (statusFilter === 'inactive') {
      vendors = vendors.filter((vendor) => !vendor.isActive);
    }

    return vendors;
  }, [searchTerm, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredVendors.slice(start, end);
  }, [filteredVendors, pagination.pageIndex, pagination.pageSize]);

  const totalCount = filteredVendors.length;

  const selectedVendors = useMemo(() => {
    return filteredVendors.filter((vendor) => selectedIds.includes(vendor._id));
  }, [filteredVendors, selectedIds]);

  const allIds = useMemo(
    () => filteredVendors.map((vendor) => vendor._id),
    [filteredVendors],
  );

  const currentPageIds = useMemo(
    () => paginatedData.map((vendor) => vendor._id),
    [paginatedData],
  );

  const isAllOnPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const selectionInfo = useMemo(() => {
    if (selectAllMode)
      return t('vendors.bulk.allSelected', { count: totalCount });
    if (selectedIds.length > 0)
      return t('vendors.bulk.itemsSelected', { count: selectedIds.length });
    return null;
  }, [selectedIds.length, selectAllMode, totalCount, t]);

  // ============ HANDLERS ============
  const handleViewDetails = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDetailsModalOpen(true);
  }, []);

  const handleEdit = useCallback(
    (vendor: Vendor) => {
      openModal(vendor);
    },
    [openModal],
  );

  const handleDelete = useCallback(
    (vendor: Vendor) => {
      openConfirmationModal(
        async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(t('vendors.message.deleteSuccess'));
          } catch {
            toast.error(t('vendors.message.deleteError'));
          } finally {
            setIsLoading(false);
          }
        },
        {
          title: t('vendors.confirm.deleteTitle'),
          description: t('vendors.confirm.deleteMessage', {
            name: vendor.name,
          }),
          confirmButtonText: t('vendors.actions.delete'),
          variant: 'destructive',
        },
      );
    },
    [openConfirmationModal, t],
  );

  // Make Payment opens settlement modal
  const handleMakePayment = useCallback((vendor: Vendor) => {
    setSettlementVendor(vendor);
    setIsPaymentSettlementModalOpen(true);
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (selectedVendors.length === 0 && !selectAllMode) {
      toast.error(t('vendors.message.selectItemsToDelete'));
      return;
    }

    const itemCount = selectAllMode ? totalCount : selectedVendors.length;
    openConfirmationModal(
      async () => {
        setIsLoading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success(
            t('vendors.message.bulkDeleteSuccess', { count: itemCount }),
          );
          setSelectedIds([]);
          setSelectAllMode(false);
        } catch {
          toast.error(t('vendors.message.bulkDeleteFailed'));
        } finally {
          setIsLoading(false);
        }
      },
      {
        title: t('vendors.confirm.bulkDeleteTitle'),
        description: selectAllMode
          ? t('vendors.confirm.bulkDeleteAll', { count: totalCount })
          : t('vendors.confirm.bulkDeleteMessage', {
              count: selectedVendors.length,
            }),
        confirmButtonText: t('vendors.actions.delete'),
        variant: 'destructive',
      },
    );
  }, [selectedVendors, selectAllMode, totalCount, openConfirmationModal, t]);

  // Bulk Status Change Handler - Single or Multiple
  const handleBulkStatusChange = useCallback(
    (activate: boolean) => {
      if (selectedVendors.length === 0 && !selectAllMode) {
        toast.error(t('vendors.message.selectItems'));
        return;
      }

      const itemCount = selectAllMode ? totalCount : selectedVendors.length;

      openConfirmationModal(
        async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(
              activate
                ? t('vendors.message.bulkActivateSuccess', { count: itemCount })
                : t('vendors.message.bulkDeactivateSuccess', {
                    count: itemCount,
                  }),
            );
            setSelectedIds([]);
            setSelectAllMode(false);
          } catch {
            toast.error(
              activate
                ? t('vendors.message.bulkActivateFailed')
                : t('vendors.message.bulkDeactivateFailed'),
            );
          } finally {
            setIsLoading(false);
          }
        },
        {
          title: activate
            ? t('vendors.confirm.bulkActivateTitle')
            : t('vendors.confirm.bulkDeactivateTitle'),
          description: selectAllMode
            ? activate
              ? t('vendors.confirm.bulkActivateAll', { count: totalCount })
              : t('vendors.confirm.bulkDeactivateAll', { count: totalCount })
            : activate
              ? t('vendors.confirm.bulkActivateMessage', {
                  count: selectedVendors.length,
                })
              : t('vendors.confirm.bulkDeactivateMessage', {
                  count: selectedVendors.length,
                }),
          confirmButtonText: activate
            ? t('vendors.actions.activate')
            : t('vendors.actions.deactivate'),
          variant: activate ? 'default' : 'destructive',
        },
      );
    },
    [selectedVendors, selectAllMode, totalCount, openConfirmationModal, t],
  );

  const handleSubmit = useCallback(
    async (data: CreateVendorData) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
          editingVendor
            ? t('vendors.message.updateSuccess')
            : t('vendors.message.createSuccess'),
        );
        closeModal();
      } catch {
        toast.error(t('vendors.message.saveError'));
      } finally {
        setIsLoading(false);
      }
    },
    [editingVendor, closeModal, t],
  );

  // ============ SELECTION HANDLERS ============
  const handleSelectAll = useCallback(() => {
    if (selectAllMode) {
      setSelectedIds([]);
      setSelectAllMode(false);
    } else {
      setSelectAllMode(true);
      setSelectedIds(allIds);
    }
  }, [selectAllMode, allIds]);

  const handleSelectCurrentPage = useCallback(() => {
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      const newSelection = [...selectedIds];
      currentPageIds.forEach((id) => {
        if (!newSelection.includes(id)) newSelection.push(id);
      });
      setSelectedIds(newSelection);
    }
    setSelectAllMode(false);
  }, [selectedIds, currentPageIds]);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
    setSelectAllMode(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectAllMode(false);
  }, []);

  const columns = useVendorColumns(
    handleEdit,
    handleDelete,
    handleViewDetails,
    handleMakePayment,
  );

  const columnsWithSelection = useMemo(() => {
    const selectionColumn = {
      id: 'select',
      header: () => (
        <div className="flex items-center justify-center p-3">
          <Checkbox
            checked={isAllOnPageSelected}
            onCheckedChange={handleSelectCurrentPage}
            aria-label={t('vendors.bulk.selectAll')}
          />
        </div>
      ),
      cell: ({ row }: { row: Row<Vendor> }) => (
        <div className="flex items-center justify-center p-2">
          <Checkbox
            checked={selectAllMode || selectedIds.includes(row.original._id)}
            onCheckedChange={() => toggleSelectItem(row.original._id)}
            aria-label={t('vendors.bulk.selectAll')}
          />
        </div>
      ),
      size: 50,
      enableSorting: false,
      enableHiding: false,
    };
    return [selectionColumn, ...columns];
  }, [
    columns,
    selectedIds,
    selectAllMode,
    isAllOnPageSelected,
    handleSelectCurrentPage,
    toggleSelectItem,
    t,
  ]);

  // ============ MODAL HANDLERS ============
  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedVendor(null);
  }, []);

  const handleDetailsModalEdit = useCallback(
    (vendor: Vendor) => {
      setIsDetailsModalOpen(false);
      handleEdit(vendor);
    },
    [handleEdit],
  );

  const handleDetailsModalDelete = useCallback(
    (vendor: Vendor) => {
      setIsDetailsModalOpen(false);
      handleDelete(vendor);
    },
    [handleDelete],
  );

  // Payment settlement modal handlers
  const handleClosePaymentSettlementModal = useCallback(() => {
    setIsPaymentSettlementModalOpen(false);
    setSettlementVendor(null);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    toast.success(
      t('vendors.payment.success') || 'Payment recorded successfully',
    );
    handleClosePaymentSettlementModal();
  }, [t, handleClosePaymentSettlementModal]);

  // ============ SEARCH & PAGINATION ============
  const handleSearchChange = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      clearSelection();
    },
    [clearSelection],
  );

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
  );

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      clearSelection();
    },
    [clearSelection],
  );

  // ============ IMPORT/EXPORT ============
  const handleDownloadTemplate = useCallback(
    () => toast.success(t('vendors.message.templateDownloadSuccess')),
    [t],
  );
  const handleUploadData = useCallback(
    () => toast.success(t('vendors.message.uploadSuccess')),
    [t],
  );
  const handleExportCurrentPage = useCallback(
    () =>
      toast.success(
        t('vendors.message.exportSuccess', { count: paginatedData.length }),
      ),
    [paginatedData.length, t],
  );
  const handleExportAll = useCallback(
    () =>
      toast.success(
        t('vendors.message.exportSuccess', { count: filteredVendors.length }),
      ),
    [filteredVendors.length, t],
  );

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Truck className="h-6 w-6" />
              {t('vendors.title')}
            </h2>
            <p className="text-muted-foreground">{t('vendors.subtitle')}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Selection info and controls */}
            {selectionInfo ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-7">
                  {selectionInfo}
                </Badge>

                {/* BULK STATUS BUTTON */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <Power className="h-3 w-3" />
                      {t('vendors.bulk.status') || 'Status'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleBulkStatusChange(true)}
                    >
                      {t('vendors.bulk.activateSelected')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkStatusChange(false)}
                    >
                      {t('vendors.bulk.deactivateSelected')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* BULK DELETE BUTTON */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-7 gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  {t('vendors.bulk.deleteSelected')}
                </Button>

                {/* SELECT ALL/DESELECT ALL */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7"
                >
                  {selectAllMode
                    ? t('vendors.bulk.deselectAll')
                    : t('vendors.bulk.selectAll')}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="h-7"
              >
                {t('vendors.bulk.selectAll')}
              </Button>
            )}

            {/* STATUS FILTER */}
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
              className="h-8 gap-2"
            >
              <Filter className="h-4 w-4" />
              {statusFilter === 'active'
                ? t('vendors.filters.active')
                : statusFilter === 'inactive'
                  ? t('vendors.filters.inactive')
                  : t('vendors.filters.allStatus')}
            </Button>

            {/* IMPORT DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('vendors.actions.import')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadTemplate}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('vendors.actions.downloadTemplate')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUploadData}>
                  <FileUp className="mr-2 h-4 w-4" />
                  {t('vendors.actions.uploadData')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* EXPORT DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8">
                  <Download className="h-4 w-4 mr-2" />
                  {t('vendors.actions.export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCurrentPage}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('vendors.actions.exportCurrentPage')}
                  <span className="ml-auto text-xs">
                    ({paginatedData.length})
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAll}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('vendors.actions.exportAll')}
                  <span className="ml-auto text-xs">
                    ({filteredVendors.length})
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ADD NEW BUTTON */}
            <Button onClick={() => openModal()} className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              {t('vendors.form.title.create')}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-6">
            <TanStackTable
              data={paginatedData}
              columns={columnsWithSelection}
              totalCount={totalCount}
              isLoading={isLoading}
              searchValue={searchTerm}
              searchPlaceholder={t('vendors.placeholder.search')}
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
              emptyMessage={t('vendors.empty.noSuppliers')}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <CrudModal
          isOpen={isOpen}
          onClose={closeModal}
          title={
            editingVendor
              ? t('vendors.form.title.edit')
              : t('vendors.form.title.create')
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isLoading}
          submitButtonText={
            editingVendor
              ? t('vendors.form.button.update')
              : t('vendors.form.button.create')
          }
        >
          <VendorFormContent form={form} editingVendor={editingVendor} />
        </CrudModal>

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

        <VendorDetailsModal
          vendor={selectedVendor}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onEdit={handleDetailsModalEdit}
          onDelete={handleDetailsModalDelete}
        />

        {/* Payment Settlement Modal */}
        <VendorPaymentSettlementModal
          vendor={settlementVendor}
          isOpen={isPaymentSettlementModalOpen}
          onClose={handleClosePaymentSettlementModal}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </Layout>
  );
}
