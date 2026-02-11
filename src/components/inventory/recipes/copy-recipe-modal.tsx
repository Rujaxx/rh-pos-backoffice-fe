'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recipe } from '@/types/recipes.type';
import { useTranslation } from '@/hooks/useTranslation';
import { Copy, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface CopyRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onCopy: (restaurantIds: string[]) => void;
}

export const CopyRecipeModal: React.FC<CopyRecipeModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onCopy,
}) => {
  const { t } = useTranslation();
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [newRecipeName, setNewRecipeName] = useState('');

  // Mock restaurants - in real app, fetch from API
  const mockRestaurants = [
    { _id: '1', name: 'Mumbai Branch' },
    { _id: '2', name: 'Delhi Branch' },
    { _id: '3', name: 'Bangalore Branch' },
    { _id: '4', name: 'Chennai Branch' },
  ];

  const handleCopy = () => {
    if (selectedOutlets.length === 0) {
      toast.error(
        t('recipes.copy.selectOutlets') || 'Please select at least one outlet',
      );
      return;
    }

    if (recipes.length === 1 && !newRecipeName.trim()) {
      toast.error(
        t('recipes.copy.enterRecipeName') || 'Please enter a new recipe name',
      );
      return;
    }

    onCopy(selectedOutlets);
    handleClose();
  };

  const handleClose = () => {
    setSelectedOutlets([]);
    setNewRecipeName('');
    onClose();
  };

  const toggleOutlet = (outletId: string) => {
    setSelectedOutlets((prev) =>
      prev.includes(outletId)
        ? prev.filter((id) => id !== outletId)
        : [...prev, outletId],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            {recipes.length === 1
              ? t('recipes.copy.singleTitle')
              : t('recipes.copy.multipleTitle', { count: recipes.length })}
          </DialogTitle>
          <DialogDescription>
            {recipes.length === 1
              ? t('recipes.copy.singleDescription', {
                  name: recipes[0].name?.en,
                })
              : t('recipes.copy.multipleDescription', {
                  count: recipes.length,
                })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe List */}
          {recipes.length > 0 && (
            <div className="space-y-2">
              <Label>{t('recipes.copy.recipesToCopy')}</Label>
              <div className="flex flex-wrap gap-2">
                {recipes.map((recipe) => (
                  <Badge key={recipe._id} variant="secondary">
                    {recipe.name?.en}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* New Recipe Name (for single copy) */}
          {recipes.length === 1 && (
            <div className="space-y-2">
              <Label htmlFor="newName">{t('recipes.copy.newRecipeName')}</Label>
              <Input
                id="newName"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                placeholder={t('recipes.copy.namePlaceholder')}
              />
              <p className="text-sm text-muted-foreground">
                {t('recipes.copy.nameHint')}
              </p>
            </div>
          )}

          {/* Outlet Selection */}
          <div className="space-y-3">
            <Label>{t('recipes.copy.selectOutlets')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedOutlets.includes(restaurant._id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleOutlet(restaurant._id)}
                >
                  <div
                    className={`h-4 w-4 border rounded flex items-center justify-center ${
                      selectedOutlets.includes(restaurant._id)
                        ? 'bg-primary border-primary'
                        : ''
                    }`}
                  >
                    {selectedOutlets.includes(restaurant._id) && (
                      <div className="h-2 w-2 bg-white rounded-sm" />
                    )}
                  </div>
                  <span>{restaurant.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Count */}
          {selectedOutlets.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {t('recipes.copy.selectedCount', {
                count: selectedOutlets.length,
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              {recipes.length === 1
                ? t('recipes.copy.copyButton')
                : t('recipes.copy.copyMultipleButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
