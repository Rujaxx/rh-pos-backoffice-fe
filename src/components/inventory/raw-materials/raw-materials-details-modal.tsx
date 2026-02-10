'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RawItem } from '@/types/raw-materials.type';
import { Calendar, User, Package, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

interface RawItemDetailsModalProps {
  item: RawItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (item: RawItem) => void;
  onEdit?: (item: RawItem) => void;
}

// Helper functions
const formatDate = (dateString: Date | string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
};

export function RawItemDetailsModal({
  item,
  isOpen,
  onClose,
  onDelete,
  onEdit,
}: RawItemDetailsModalProps) {
  const { t } = useTranslation();

  const modalData = useMemo(() => {
    if (!item) return null;

    const getTypeDisplay = (type: string) => {
      return (
        {
          RAW: t('rawMaterials.type.raw'),
          SEMI: t('rawMaterials.type.semiFinished'),
          FINISHED: t('rawMaterials.type.finished'),
        }[type] || type
      );
    };

    const getStatusDisplay = (isActive: boolean) => {
      return isActive ? t('rawMaterials.active') : t('rawMaterials.inactive');
    };

    return {
      getTypeDisplay,
      getStatusDisplay,
      item,
    };
  }, [item, t]);

  if (!item || !modalData) return null;

  const { getTypeDisplay, getStatusDisplay } = modalData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold">
              {t('rawMaterials.itemDetails')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.name')}
              </h3>
              <p className="text-base font-medium">{item.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.type')}
              </h3>
              <Badge
                variant={
                  item.type === 'RAW'
                    ? 'secondary'
                    : item.type === 'SEMI'
                      ? 'outline'
                      : 'default'
                }
              >
                {getTypeDisplay(item.type)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.unit')}
              </h3>
              <p className="text-base uppercase">{item.baseUnit}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.status')}
              </h3>
              <Badge variant={item.isActive ? 'default' : 'secondary'}>
                {getStatusDisplay(item.isActive)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.minStock')}
              </h3>
              <p className="text-base">{item.minimumStock || 0}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.wasteRatio')}
              </h3>
              <p className="text-base">
                {((item.expectedWasteRatio || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('rawMaterials.columns.createdBy')}
                </h3>
                <p className="text-base">
                  {item.createdBy || t('common.system')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('rawMaterials.columns.modified')}
                </h3>
                <p className="text-base">{formatDate(item.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Restaurant & Brand Info (if available) */}
          {(item.restaurantName || item.brandName) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.restaurantName && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('rawMaterials.restaurant')}
                    </h3>
                    <p className="text-base">
                      {item.restaurantName.en || item.restaurantName.ar || ''}
                    </p>
                  </div>
                )}
                {item.brandName && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('rawMaterials.brand')}
                    </h3>
                    <p className="text-base">
                      {item.brandName.en || item.brandName.ar || ''}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          {(onDelete || onEdit) && (
            <>
              <Separator />
              <div className="flex justify-end space-x-2 pt-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit(item);
                      onClose();
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDelete(item);
                      onClose();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('rawMaterials.delete')}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
