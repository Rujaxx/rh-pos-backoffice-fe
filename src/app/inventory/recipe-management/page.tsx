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
  ChefHat,
  Zap,
  Filter,
  FileDown,
  CopyIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Recipe } from '@/types/recipes.type';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRecipeColumns } from '@/components/inventory/recipes/recipe-columns';
import { RecipeDetailsModal } from '@/components/inventory/recipes/recipe-details-modal';
import {
  RecipeFormContent,
  useRecipeForm,
} from '@/components/inventory/recipes/recipe-form';
import { CreateRecipeData } from '@/lib/validations/recipe.validations';
import { QuickRecipeModal } from '@/components/inventory/recipes/recipe-quick-modal';
import { CopyRecipeModal } from '@/components/inventory/recipes/copy-menu-items';

// Mock data based on your screenshot
const mockRecipes: Recipe[] = [
  {
    _id: '1',
    name: { en: 'Arrabito Pasta', ar: 'أرابيتو باستا' },
    menuItemId: '1',
    restaurantId: '1',
    brandId: '1',
    instructions:
      'Cook pasta al dente. Prepare arrabito sauce with fresh herbs.',
    recipeItems: [
      { itemId: '1', quantity: 200, itemName: 'Pasta' },
      { itemId: '2', quantity: 100, itemName: 'Tomato Sauce' },
      { itemId: '3', quantity: 50, itemName: 'Herbs' },
    ],
    isActive: true,
    createdBy: 'Demo',
    updatedBy: 'Demo',
    createdAt: new Date('2023-06-20T13:22:20Z'),
    updatedAt: new Date('2023-06-20T13:22:20Z'),
    brandName: { en: 'Demo Brand', ar: 'علامة تجارية تجريبية' },
    restaurantName: { en: 'Demo Restaurant', ar: 'المطعم التجريبي' },
  },
  {
    _id: '2',
    name: { en: 'Aloo Gobi Masala', ar: 'آلو غوبي ماسالا' },
    menuItemId: '2',
    restaurantId: '1',
    brandId: '1',
    instructions: 'Sauté potatoes and cauliflower with spices.',
    recipeItems: [
      { itemId: '4', quantity: 300, itemName: 'Potatoes' },
      { itemId: '5', quantity: 200, itemName: 'Cauliflower' },
      { itemId: '6', quantity: 100, itemName: 'Spices' },
    ],
    isActive: true,
    createdBy: 'Demo',
    updatedBy: 'Demo',
    createdAt: new Date('2023-06-20T13:22:20Z'),
    updatedAt: new Date('2023-06-20T13:22:20Z'),
    brandName: { en: 'Demo Brand', ar: 'علامة تجارية تجريبية' },
    restaurantName: { en: 'Demo Restaurant', ar: 'المطعم التجريبي' },
  },
  {
    _id: '3',
    name: { en: 'Chocolate Sundae Ice Cream', ar: 'آيس كريم سندي شوكولاتة' },
    menuItemId: '3',
    restaurantId: '1',
    brandId: '1',
    instructions: 'Layer ice cream with chocolate sauce and toppings.',
    recipeItems: [
      { itemId: '7', quantity: 150, itemName: 'Vanilla Ice Cream' },
      { itemId: '8', quantity: 50, itemName: 'Chocolate Sauce' },
      { itemId: '9', quantity: 30, itemName: 'Sprinkles' },
    ],
    isActive: false,
    createdBy: 'Demo',
    updatedBy: 'Demo',
    createdAt: new Date('2023-06-19T20:12:35Z'),
    updatedAt: new Date('2023-06-19T20:16:37Z'),
    brandName: { en: 'Demo Brand', ar: 'علامة تجارية تجريبية' },
    restaurantName: { en: 'Demo Restaurant', ar: 'المطعم التجريبي' },
  },
];

export default function RecipesPage() {
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

  // SELECTION STATE
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllMode, setSelectAllMode] = useState<boolean>(false);

  // Details Modal State
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isQuickRecipeModalOpen, setIsQuickRecipeModalOpen] = useState(false);
  const [selectedBrandId] = useState<string>();
  const [selectedRestaurantId] = useState<string>();

  const [isCopyRecipeModalOpen, setIsCopyRecipeModalOpen] = useState(false);

  // Modal hooks
  const {
    isOpen,
    editingItem: editingRecipe,
    openModal,
    closeModal,
  } = useModal<Recipe>();

  const {
    isConfirmationOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
    executeConfirmation,
  } = useConfirmationModal();

  // Form hook
  const { form } = useRecipeForm(editingRecipe);

  // Mock loading state
  const [isLoading, setIsLoading] = useState(false);

  // Mock data filtering
  const filteredRecipes = useMemo(() => {
    let recipes = [...mockRecipes];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      recipes = recipes.filter(
        (recipe) =>
          recipe.name?.en?.toLowerCase().includes(term) ||
          recipe.name?.ar?.toLowerCase().includes(term),
      );
    }

    if (statusFilter === 'active') {
      recipes = recipes.filter((recipe) => recipe.isActive);
    } else if (statusFilter === 'inactive') {
      recipes = recipes.filter((recipe) => !recipe.isActive);
    }

    return recipes;
  }, [searchTerm, statusFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredRecipes.slice(start, end);
  }, [filteredRecipes, pagination.pageIndex, pagination.pageSize]);

  const totalCount = filteredRecipes.length;

  // Get selected items
  const selectedRecipes = useMemo(() => {
    return filteredRecipes.filter((recipe) => selectedIds.includes(recipe._id));
  }, [filteredRecipes, selectedIds]);

  // Selection calculations
  const allIds = useMemo(
    () => filteredRecipes.map((recipe) => recipe._id),
    [filteredRecipes],
  );

  const currentPageIds = useMemo(
    () => paginatedData.map((recipe) => recipe._id),
    [paginatedData],
  );

  // Action handlers
  const handleViewDetails = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailsModalOpen(true);
  }, []);

  const handleEdit = useCallback(
    (recipe: Recipe) => {
      openModal(recipe);
    },
    [openModal],
  );

  const handleDelete = useCallback(
    (recipe: Recipe) => {
      openConfirmationModal(
        async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(t('recipes.deletedSuccess'));
          } catch (error) {
            const msg =
              error instanceof Error ? error.message : t('recipes.deleteError');
            toast.error(msg);
          } finally {
            setIsLoading(false);
          }
        },
        {
          title: t('recipes.deleteItem'),
          description: t('recipes.deleteConfirmation', {
            itemName: recipe.name?.en,
          }),
          confirmButtonText: t('recipes.deleteButton'),
          variant: 'destructive',
        },
      );
    },
    [openConfirmationModal, t],
  );

  // Submit handler for create/edit modal
  const handleSubmit = useCallback(
    async (data: CreateRecipeData) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingRecipe) {
          toast.success(t('recipes.updatedSuccess'));
        } else {
          toast.success(t('recipes.createdSuccess'));
        }
        closeModal();
      } catch (error) {
        toast.error(t('recipes.saveError'));
      } finally {
        setIsLoading(false);
      }
    },
    [editingRecipe, closeModal, t],
  );

  // Details Modal handlers
  const handleDetailsModalDelete = useCallback(
    (recipe: Recipe) => {
      setIsDetailsModalOpen(false);
      handleDelete(recipe);
    },
    [handleDelete],
  );

  const handleDetailsModalEdit = useCallback(
    (recipe: Recipe) => {
      setIsDetailsModalOpen(false);
      handleEdit(recipe);
    },
    [handleEdit],
  );

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedRecipe(null);
  }, []);

  // Get columns from separate file
  const columns = useRecipeColumns(handleEdit, handleDelete, handleViewDetails);

  // Selection handlers
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
      return t('recipes.allItemsSelected', { count: totalCount });
    } else if (selectedIds.length > 0) {
      return t('recipes.itemsSelected', { count: selectedIds.length });
    }
    return null;
  }, [selectedIds.length, selectAllMode, totalCount, t]);

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
          <div className="flex items-center justify-center p-2">
            <Checkbox
              checked={isAllOnPageSelected}
              onCheckedChange={handleSelectCurrentPage}
              aria-label={t('recipes.selectAllCurrentPage')}
            />
          </div>
        );
      },
      cell: ({ row }: { row: Row<Recipe> }) => {
        const recipe = row.original;
        const isSelected = selectAllMode || selectedIds.includes(recipe._id);

        return (
          <div className="p-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelectItem(recipe._id)}
              aria-label={t('recipes.selectItem', { name: recipe.name?.en })}
            />
          </div>
        );
      },
      size: 50,
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [
    columns,
    selectedIds,
    isAllOnPageSelected,
    handleSelectCurrentPage,
    selectAllMode,
    toggleSelectItem,
    t,
  ]);

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

  // Bulk delete handler
  const handleBulkDelete = useCallback(() => {
    if (selectedRecipes.length === 0) {
      toast.error(t('recipes.selectItemsToDelete'));
      return;
    }

    openConfirmationModal(
      async () => {
        setIsLoading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const itemCount = selectAllMode ? totalCount : selectedRecipes.length;
          toast.success(t('recipes.bulkDeleteSuccess', { count: itemCount }));
          clearSelection();
        } catch (error) {
          toast.error(t('recipes.bulkDeleteFailed'));
        } finally {
          setIsLoading(false);
        }
      },
      {
        title: t('recipes.bulkDeleteTitle'),
        description: selectAllMode
          ? t('recipes.bulkDeleteAll', { count: totalCount })
          : t('recipes.bulkDeleteSelected', {
              count: selectedRecipes.length,
            }),
        confirmButtonText: t('recipes.deleteButton'),
        variant: 'destructive',
      },
    );
  }, [
    selectedRecipes,
    selectAllMode,
    totalCount,
    openConfirmationModal,
    clearSelection,
    t,
  ]);

  // Import handlers
  const handleImportRecipe = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('recipes.importSuccess'));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(t('recipes.importFailed'));
      setIsLoading(false);
    }
  }, [t]);

  const handleDownloadTemplate = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('recipes.templateDownloadSuccess'));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(t('recipes.templateDownloadFailed'));
      setIsLoading(false);
    }
  }, [t]);

  const handleUploadData = useCallback(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('recipes.uploadSuccess'));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(t('recipes.uploadFailed'));
      setIsLoading(false);
    }
  }, [t]);

  // Export handlers
  const handleExportCurrentPage = useCallback(() => {
    const itemCount = paginatedData.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(
          t('recipes.exportCurrentPageSuccess', { count: itemCount }),
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(t('recipes.exportFailed'));
      setIsLoading(false);
    }
  }, [paginatedData, t]);

  const handleExportAll = useCallback(() => {
    const itemCount = filteredRecipes.length;
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success(t('recipes.exportAllSuccess', { count: itemCount }));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error(t('recipes.exportFailed'));
      setIsLoading(false);
    }
  }, [filteredRecipes, t]);

  // Modal handlers
  const handleQuickRecipe = useCallback(() => {
    setIsQuickRecipeModalOpen(true);
  }, []);

  const handleCopyRecipeModal = useCallback(() => {
    setIsCopyRecipeModalOpen(true);
  }, []);

  const selectionInfo = getSelectionInfo();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <ChefHat className="h-6 w-6" />
              <span>{t('recipes.title')}</span>
            </h2>
            <p className="text-muted-foreground">{t('recipes.subtitle')}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Selection info and controls - DIRECT DELETE BUTTON */}
            {selectionInfo ? (
              <div className="flex items-center gap-2 mr-2">
                <Badge variant="secondary" className="h-7">
                  {selectionInfo}
                </Badge>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-7 flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  {t('recipes.deleteSelected') || 'Delete Selected'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7"
                >
                  {selectAllMode
                    ? t('recipes.deselectAll')
                    : t('recipes.selectAll')}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="h-7"
              >
                {t('recipes.selectAll')}
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
              }}
              className="h-8 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>
                {statusFilter === 'active'
                  ? t('brands.active')
                  : statusFilter === 'inactive'
                    ? t('brands.inactive')
                    : t('brands.allStatus')}
              </span>
            </Button>

            {/* Quick Recipe Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickRecipe}
              className="h-8 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>{t('recipes.quickRecipe') || 'Quick Recipe'}</span>
            </Button>

            {/* Copy Recipe Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRecipeModal}
              className="h-8 flex items-center gap-2"
            >
              <CopyIcon className="h-4 w-4" />
              <span>{t('recipes.copyRecipe') || 'Copy Recipe'}</span>
            </Button>

            {/* Import Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{t('recipes.import')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadTemplate}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('recipes.downloadTemplate')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUploadData}>
                  <FileUp className="mr-2 h-4 w-4" />
                  {t('recipes.uploadData')}
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
                  <span>{t('recipes.export')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCurrentPage}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('recipes.exportCurrentPage')}
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({paginatedData.length} {t('common.items')})
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAll}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {t('recipes.exportAll')}
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({filteredRecipes.length} {t('common.items')})
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add New Recipe */}
            <Button
              onClick={() => openModal()}
              className="h-8 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('recipes.addNew')}</span>
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
              searchPlaceholder={t('recipes.searchPlaceholder')}
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
            editingRecipe
              ? t('recipes.form.editTitle')
              : t('recipes.form.createTitle')
          }
          size="xl"
          form={form}
          onSubmit={handleSubmit}
          loading={isLoading}
          submitButtonText={
            editingRecipe
              ? t('recipes.form.updateButton')
              : t('recipes.form.createButton')
          }
        >
          <RecipeFormContent form={form} editingRecipe={editingRecipe} />
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

        {/* Recipe Details Modal */}
        <RecipeDetailsModal
          recipe={selectedRecipe}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onDelete={handleDetailsModalDelete}
          onEdit={handleDetailsModalEdit}
        />

        <QuickRecipeModal
          isOpen={isQuickRecipeModalOpen}
          onClose={() => setIsQuickRecipeModalOpen(false)}
          brandId={selectedBrandId}
          restaurantId={selectedRestaurantId}
        />

        {/* Copy Recipe Modal */}
        <CopyRecipeModal
          isOpen={isCopyRecipeModalOpen}
          onClose={() => setIsCopyRecipeModalOpen(false)}
          brandId={selectedBrandId}
          restaurantId={selectedRestaurantId}
        />
      </div>
    </Layout>
  );
}
