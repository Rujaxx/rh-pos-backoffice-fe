'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RawItem } from '@/types/raw-materials.type';
import { Calendar, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface RawItemDetailsModalProps {
  item: RawItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RawItemDetailsModal({
  item,
  isOpen,
  onClose,
}: RawItemDetailsModalProps) {
  const { t } = useTranslation();

  if (!item) return null;

  // Helper function for date formatting only
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTypeDisplay = (type: string) => {
    return (
      {
        RAW: 'Raw Material',
        SEMI: 'Semi-Finished',
        FINISHED: 'Finished Product',
      }[type] || type
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('rawMaterials.itemDetails') || 'Raw Material Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.name') || 'Name'}
              </h3>
              <p className="text-base font-medium">{item.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.type') || 'Type'}
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
                {t('rawMaterials.columns.unit') || 'Unit'}
              </h3>
              <p className="text-base uppercase">{item.baseUnit}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.status') || 'Status'}
              </h3>
              <Badge variant={item.isActive ? 'default' : 'secondary'}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.minStock') || 'Minimum Stock'}
              </h3>
              <p className="text-base">{item.minimumStock || 0}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('rawMaterials.columns.wasteRatio') || 'Waste Ratio'}
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
                  {t('rawMaterials.columns.createdBy') || 'Created By'}
                </h3>
                <p className="text-base">{item.createdBy || 'System'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('rawMaterials.columns.modified') || 'Last Modified'}
                </h3>
                <p className="text-base">
                  {formatDate(new Date(item.updatedAt))}
                </p>
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
                      {t('rawMaterials.restaurant') || 'Restaurant'}
                    </h3>
                    <p className="text-base">
                      {item.restaurantName.en || item.restaurantName.ar || ''}
                    </p>
                  </div>
                )}
                {item.brandName && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('rawMaterials.brand') || 'Brand'}
                    </h3>
                    <p className="text-base">
                      {item.brandName.en || item.brandName.ar || ''}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
