'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/types/recipes.type';
import { useTranslation } from '@/hooks/useTranslation';
import { Edit, Trash2, X, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RecipeDetailsModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
}

export const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {recipe.name?.en || 'Recipe Details'}
          </DialogTitle>
          <DialogDescription>
            {t('recipes.details.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.brand')}
              </h4>
              <p>{recipe.brandName?.en || '-'}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.restaurant')}
              </h4>
              <p>{recipe.restaurantName?.en || '-'}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.status')}
              </h4>
              <Badge variant={recipe.isActive ? 'default' : 'secondary'}>
                {recipe.isActive ? t('common.active') : t('common.inactive')}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.created')}
              </h4>
              <p>
                {format(new Date(recipe.createdAt), 'dd-MMM-yyyy HH:mm:ss')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.modified')}
              </h4>
              <p>
                {format(new Date(recipe.updatedAt), 'dd-MMM-yyyy HH:mm:ss')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.createdBy')}
              </h4>
              <p>{recipe.createdBy || '-'}</p>
            </div>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('recipes.details.instructions')}
              </h4>
              <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                {recipe.instructions}
              </div>
            </div>
          )}

          {/* Recipe Items */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('recipes.details.recipeItems')}
            </h4>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('recipes.details.itemName')}</TableHead>
                    <TableHead>{t('recipes.details.quantity')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.recipeItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.itemName || `Item ${index + 1}`}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
