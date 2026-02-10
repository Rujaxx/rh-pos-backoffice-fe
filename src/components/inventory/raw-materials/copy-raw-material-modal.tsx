'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { RawItem } from '@/types/raw-materials.type';

// Mock outlets data
const mockOutlets = [
  { id: 'outlet1', name: 'Main Restaurant' },
  { id: 'outlet2', name: 'Food Court Stall' },
  { id: 'outlet3', name: 'Express Counter' },
  { id: 'outlet4', name: 'Cafeteria' },
];

interface CopyRawMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: RawItem[];
  onCopy: (outletIds: string[]) => void;
}

export function CopyRawMaterialModal({
  isOpen,
  onClose,
  items,
  onCopy,
}: CopyRawMaterialModalProps) {
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
      toast.error(
        t('rawMaterials.selectAtLeastOneOutlet') ||
          'Please select at least one outlet',
      );
      return;
    }
    onCopy(selectedOutlets);
    onClose();
  };

  const getDescription = () => {
    if (items.length === 1) {
      return t('rawMaterials.copyModal.descriptionSingle', {
        itemName: items[0].name,
      });
    }
    return t('rawMaterials.copyModal.descriptionMultiple', {
      itemCount: items.length,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            {t('rawMaterials.copyModal.title')}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('rawMaterials.copyModal.selectOutlets')}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllOutlets}
              className="h-7"
            >
              {selectedOutlets.length === mockOutlets.length
                ? t('rawMaterials.copyModal.deselectAll')
                : t('rawMaterials.copyModal.selectAll')}
            </Button>
          </div>

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
            {t('rawMaterials.copyModal.outletsSelected', {
              count: selectedOutlets.length,
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('rawMaterials.copyModal.cancel')}
          </Button>
          <Button onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {t('rawMaterials.copyModal.copyToOutlets', {
              count: selectedOutlets.length,
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
