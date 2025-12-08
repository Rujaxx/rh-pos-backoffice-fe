'use client';

import React, { useState, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MeatType, MenuItem } from '@/types/menu-item.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import {
  EditableToggleCell,
  EditableSelectCell,
  EditableTextCell,
  EditableNumberCell,
} from './editable-cells-components';
import { MultilingualText } from '@/types';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { getS3UrlFromKey } from '@/lib/upload-utils';
import { Button } from '@/components/ui/button';

interface EditableColumnsConfig {
  updateField: (itemId: string, field: keyof MenuItem, value: unknown) => void;
  getFieldValue: (itemId: string, field: keyof MenuItem) => unknown;
  isFieldModified: (itemId: string, field: keyof MenuItem) => boolean;
  categoriesOptions: Array<{ value: string; label: string }>;
  taxGroupsOptions: Array<{ value: string; label: string }>;
  kitchenDeptOptions: Array<{ value: string; label: string }>;
  addonsOptions: Array<{ value: string; label: string }>;
  isLoadingOptions: boolean;
  onDelete?: (menuItem: MenuItem) => void;
  onUploadImage: (file: File) => Promise<{ key: string; url: string }>;
}

/**
 * Extracted component to handle primary image cell rendering
 * Allows use of React hooks within the cell
 */
function PrimaryImageCell({
  menuItem,
  imageKey,
  onUploadImage,
  updateField,
}: {
  menuItem: MenuItem;
  imageKey: string;
  onUploadImage: (file: File) => Promise<{ key: string; url: string }>;
  updateField: (itemId: string, field: keyof MenuItem, value: unknown) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>(
    imageKey ? getS3UrlFromKey(imageKey) : '',
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await onUploadImage(file);
      // Update preview immediately with the full URL
      setPreviewUrl(result.url);
      // Only save the KEY to the backend/state if it's a new/modified image
      // This ensures we only send updates when there's an actual change
      updateField(menuItem._id!, 'primaryImage', result.key);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className="h-10 w-10 relative rounded-md overflow-hidden bg-muted cursor-pointer group hover:opacity-80 transition-opacity"
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={menuItem.itemName?.en || 'Menu Item'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <ImageIcon className="h-4 w-4 text-muted-foreground group-hover:hidden" />
              <Upload className="h-4 w-4 text-muted-foreground hidden group-hover:block" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </>
      )}
    </div>
  );
}

export const createEditableMenuItemColumns = (
  config: EditableColumnsConfig,
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
): ColumnDef<MenuItem>[] => {
  const {
    updateField,
    getFieldValue,
    isFieldModified,
    categoriesOptions,
    taxGroupsOptions,
    kitchenDeptOptions,

    isLoadingOptions,
    onDelete,
    onUploadImage,
  } = config;

  const meatTypeOptions = MeatType.map((type) => ({
    value: type.value,
    label: t(`menuItems.meatTypes.${type.label}`),
  }));

  return [
    //delete menu item
    {
      id: 'actions',
      header: t('table.actions'),
      size: 100,
      cell: ({ row }) => {
        const menuItem = row.original;

        return (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(menuItem)}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    // Primary Image
    {
      id: 'primaryImage',
      header: t('menuItems.table.image'),
      size: 80,
      cell: ({ row }) => {
        const menuItem = row.original;
        const imageKey = getFieldValue(menuItem._id!, 'primaryImage') as string;

        return (
          <PrimaryImageCell
            menuItem={menuItem}
            imageKey={imageKey}
            onUploadImage={onUploadImage}
            updateField={updateField}
          />
        );
      },
    },
    // Item Name (Editable Text - Multilingual)
    {
      accessorKey: 'itemName',
      id: 'itemName',
      header: t('menuItems.table.itemName'),
      size: 250,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'itemName',
        ) as MultilingualText;

        return (
          <EditableTextCell
            value={currentValue?.[locale] || ''}
            onChange={(value) =>
              updateField(menuItem._id!, 'itemName', {
                ...currentValue,
                [locale]: value,
              })
            }
            isModified={isFieldModified(menuItem._id!, 'itemName')}
            placeholder={t('menuItems.table.itemName')}
          />
        );
      },
    },

    // Short Code (Editable Text)
    {
      id: 'shortCode',
      header: t('menuItems.table.shortCode'),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'shortCode',
        ) as string;

        return (
          <EditableTextCell
            value={currentValue || ''}
            onChange={(value) => updateField(menuItem._id!, 'shortCode', value)}
            isModified={isFieldModified(menuItem._id!, 'shortCode')}
            placeholder="Code"
          />
        );
      },
    },

    // Base Price (Editable Number)
    {
      accessorKey: 'baseItemPrice',
      id: 'baseItemPrice',
      header: t('menuItems.table.basePrice'),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'baseItemPrice',
        ) as number;

        return (
          <EditableNumberCell
            value={currentValue || 0}
            onChange={(value) =>
              updateField(menuItem._id!, 'baseItemPrice', value)
            }
            isModified={isFieldModified(menuItem._id!, 'baseItemPrice')}
            format="currency"
            min={0}
            step={0.01}
          />
        );
      },
    },

    // Current Stock (Editable Number)
    {
      accessorKey: 'currentStock',
      id: 'currentStock',
      header: t('menuItems.table.stock'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'currentStock',
        ) as number;

        return (
          <EditableNumberCell
            value={currentValue || 0}
            onChange={(value) =>
              updateField(menuItem._id!, 'currentStock', value)
            }
            isModified={isFieldModified(menuItem._id!, 'currentStock')}
            format="integer"
            min={0}
          />
        );
      },
    },

    // Category (Editable Select)
    {
      id: 'category',
      header: t('menuItems.table.category'),
      size: 200,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'categoryId',
        ) as string;

        return (
          <EditableSelectCell
            value={currentValue || ''}
            options={categoriesOptions}
            onChange={(value) =>
              updateField(menuItem._id!, 'categoryId', value)
            }
            isModified={isFieldModified(menuItem._id!, 'categoryId')}
            isLoading={isLoadingOptions}
            placeholder="Select category"
          />
        );
      },
    },

    // Tax Product Group (Editable Select)
    {
      id: 'taxProductGroup',
      header: t('menuItems.table.taxInfo'),
      size: 200,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'taxProductGroupId',
        ) as string;

        return (
          <EditableSelectCell
            value={currentValue || ''}
            options={taxGroupsOptions}
            onChange={(value) =>
              updateField(menuItem._id!, 'taxProductGroupId', value)
            }
            isModified={isFieldModified(menuItem._id!, 'taxProductGroupId')}
            isLoading={isLoadingOptions}
            placeholder="Select tax group"
          />
        );
      },
    },

    // Kitchen Department (Editable Select)
    {
      id: 'kitchenDepartment',
      header: t('menuItems.table.kitchenDepartment'),
      size: 200,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'kitchenDepartmentId',
        ) as string;

        return (
          <EditableSelectCell
            value={currentValue || ''}
            options={kitchenDeptOptions}
            onChange={(value) =>
              updateField(menuItem._id!, 'kitchenDepartmentId', value)
            }
            isModified={isFieldModified(menuItem._id!, 'kitchenDepartmentId')}
            isLoading={isLoadingOptions}
            placeholder="Select department"
          />
        );
      },
    },

    // Food Type (Editable Select)
    {
      id: 'foodType',
      header: t('menuItems.table.foodType'),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(menuItem._id!, 'foodType') as string;

        const foodTypeOptions = [
          { value: 'VEG', label: t('menuItems.foodTypes.VEG') },
          { value: 'NON_VEG', label: t('menuItems.foodTypes.NON_VEG') },
          { value: 'VEGAN', label: t('menuItems.foodTypes.VEGAN') },
        ];

        return (
          <EditableSelectCell
            value={currentValue || ''}
            options={foodTypeOptions}
            onChange={(value) => updateField(menuItem._id!, 'foodType', value)}
            isModified={isFieldModified(menuItem._id!, 'foodType')}
            placeholder="Select type"
          />
        );
      },
    },

    // Meat Type (Editable Select)
    {
      id: 'meatType',
      header: t('menuItems.table.meatType'),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(menuItem._id!, 'meatType') as string;

        return (
          <EditableSelectCell
            value={currentValue || ''}
            options={meatTypeOptions}
            onChange={(value) => updateField(menuItem._id!, 'meatType', value)}
            isModified={isFieldModified(menuItem._id!, 'meatType')}
            placeholder="Select type"
          />
        );
      },
    },

    // Discount Type (Editable Select with dependency)
    {
      id: 'discountType',
      header: t('menuItems.table.discountType'),
      size: 150,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'discountType',
        ) as string;
        const discountTypeOptions = [
          { value: 'Fixed Amount', label: 'Fixed Amount' },
          { value: 'Percentage', label: 'Percentage' },
        ];

        return (
          <EditableSelectCell
            value={currentValue || ''}
            options={discountTypeOptions}
            onChange={(value) =>
              updateField(menuItem._id!, 'discountType', value)
            }
            isModified={isFieldModified(menuItem._id!, 'discountType')}
            placeholder="Select type"
          />
        );
      },
    },

    {
      accessorKey: 'discountedPrice',
      id: 'discountedPrice',
      header: t('menuItems.table.discountedPrice'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'discountedPrice',
        ) as number;

        return (
          <EditableNumberCell
            value={currentValue || 0}
            onChange={(value) =>
              updateField(menuItem._id!, 'discountedPrice', value)
            }
            isModified={isFieldModified(menuItem._id!, 'discountedPrice')}
            format="integer"
            min={0}
          />
        );
      },
    },
    // Platform Status (Toggle)
    {
      id: 'platformStatus',
      header: t('menuItems.table.platformStatus'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'platformStatus',
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, 'platformStatus', value)
            }
            isModified={isFieldModified(menuItem._id!, 'platformStatus')}
          />
        );
      },
    },

    // Digital Discount (Toggle)
    {
      id: 'digitalDiscount',
      header: t('menuItems.table.digitalDiscount'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'digitalDiscount',
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, 'digitalDiscount', value)
            }
            isModified={isFieldModified(menuItem._id!, 'digitalDiscount')}
          />
        );
      },
    },

    // Is Recommended (Toggle)
    {
      id: 'isRecommended',
      header: t('menuItems.table.recommended'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'isRecommended',
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, 'isRecommended', value)
            }
            isModified={isFieldModified(menuItem._id!, 'isRecommended')}
          />
        );
      },
    },

    // Open Item (Toggle)
    {
      id: 'openItem',
      header: t('menuItems.table.openItem'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'openItem',
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) => updateField(menuItem._id!, 'openItem', value)}
            isModified={isFieldModified(menuItem._id!, 'openItem')}
          />
        );
      },
    },

    // Open Price (Toggle)
    {
      id: 'openPrice',
      header: t('menuItems.table.openPrice'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'openPrice',
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) => updateField(menuItem._id!, 'openPrice', value)}
            isModified={isFieldModified(menuItem._id!, 'openPrice')}
          />
        );
      },
    },

    // Sync to Aggregator (Toggle)
    {
      id: 'syncToAggregator',
      header: t('menuItems.table.syncToAggregator'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(
          menuItem._id!,
          'syncToAggregator',
        ) as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) =>
              updateField(menuItem._id!, 'syncToAggregator', value)
            }
            isModified={isFieldModified(menuItem._id!, 'syncToAggregator')}
          />
        );
      },
    },

    // Is Combo (Toggle)
    {
      id: 'isCombo',
      header: t('menuItems.table.isCombo'),
      size: 120,
      cell: ({ row }) => {
        const menuItem = row.original;
        const currentValue = getFieldValue(menuItem._id!, 'isCombo') as boolean;

        return (
          <EditableToggleCell
            value={currentValue || false}
            onChange={(value) => updateField(menuItem._id!, 'isCombo', value)}
            isModified={isFieldModified(menuItem._id!, 'isCombo')}
          />
        );
      },
    },
  ];
};

// Hook for using editable columns
export const useEditableMenuItemColumns = (config: EditableColumnsConfig) => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return createEditableMenuItemColumns(config, t, locale);
};
