'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

import { Edit2, Save, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { MealTimeConfig } from '@/types/meal-time-report.type';
import { useMealTimeFrames } from '@/services/api/reports/meal-time-frame/meal-time-frame.query';
import { useUpdateMealTimeFrame } from '@/services/api/reports/meal-time-frame/meal-time-frame.mutaiton';
import { MealTimeFrame } from '@/types/meal-time-frame.type';

interface MealTimeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId?: string;
}

export function MealTimeConfigModal({
  isOpen,
  onClose,
  brandId,
}: MealTimeConfigModalProps) {
  const { t } = useTranslation();

  // API Hooks
  const { data: mealTimeFramesData, isLoading } = useMealTimeFrames(
    brandId || '',
    {
      enabled: !!brandId && isOpen,
    },
  );

  const updateMealTimeFrameMutation = useUpdateMealTimeFrame();

  const [mealTimes, setMealTimes] = useState<MealTimeConfig[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<MealTimeConfig> | null>(
    null,
  );

  // Initialize data from API
  useEffect(() => {
    if (isOpen && mealTimeFramesData?.data && !isLoading) {
      const formattedData: MealTimeConfig[] = mealTimeFramesData.data.map(
        (item: MealTimeFrame) => ({
          _id: item._id,
          name: item.name,
          from: item.from,
          to: item.to,
          isActive: item.isActive,
        }),
      );
      setMealTimes(formattedData);
      setEditingId(null);
      setEditData(null);
    } else if (isOpen && !brandId) {
      setMealTimes([]);
    }
  }, [isOpen, mealTimeFramesData, isLoading, brandId]);

  const handleEdit = (id: string) => {
    const mealTime = mealTimes.find((mt) => mt._id === id);
    if (mealTime) {
      setEditingId(id);
      setEditData({
        ...mealTime,
        from: mealTime.from?.slice(0, 5) || '',
        to: mealTime.to?.slice(0, 5) || '',
      });
    }
  };

  const handleSave = async (id: string) => {
    if (!editData || !brandId) return;

    setIsSaving(true);
    try {
      // Update
      await updateMealTimeFrameMutation.mutateAsync({
        id,
        data: {
          brandId,
          name: editData.name || '',
          from: editData.from || '',
          to: editData.to || '',
          isActive: editData.isActive ?? true,
        },
      });
      setEditingId(null);
      setEditData(null);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (id: string) => {
    setEditingId(null);
    setEditData(null);
  };

  const handleChange = (
    field: keyof MealTimeConfig,
    value: string | boolean | string[],
  ) => {
    if (!editData) return;
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    onClose();
  };

  const isEditing = (id: string) => editingId === id;
  const getMealTime = (id: string) => {
    if (isEditing(id) && editData) return editData;
    return mealTimes.find((mt) => mt._id === id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('reports.mealTime.configureMealTimes')}
            </DialogTitle>
          </DialogHeader>

          {!brandId ? (
            <div className="py-8 text-center text-muted-foreground">
              Please select a brand to configure meal times.
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center">Loading configuration...</div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground">
                {t('reports.mealTime.configDescription') ||
                  'Configure meal times to analyze sales based on different time periods of the day.'}
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        Meal Slot Name
                        <span className="text-destructive ml-1">*</span>
                      </TableHead>
                      <TableHead className="w-[120px]">
                        From
                        <span className="text-destructive ml-1">*</span>
                      </TableHead>
                      <TableHead className="w-[120px]">
                        To
                        <span className="text-destructive ml-1">*</span>
                      </TableHead>
                      <TableHead className="w-[100px]">
                        {t('common.status')}
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        {t('common.actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mealTimes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No meal times configured. Add one from above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      mealTimes.map((mealTime) => {
                        const currentData = getMealTime(mealTime._id);
                        const editing = isEditing(mealTime._id);
                        const formatTime = (t?: string) => t?.slice(0, 5) || '';

                        return (
                          <TableRow key={mealTime._id} className="group">
                            <TableCell>
                              {editing ? (
                                <Input
                                  value={currentData?.name || ''}
                                  onChange={(e) =>
                                    handleChange('name', e.target.value)
                                  }
                                  placeholder="Enter meal slot name"
                                  className="w-full"
                                />
                              ) : (
                                <div className="font-medium">
                                  {currentData?.name}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editing ? (
                                <Input
                                  type="time"
                                  value={currentData?.from || ''}
                                  onChange={(e) =>
                                    handleChange('from', e.target.value)
                                  }
                                  className="w-full"
                                />
                              ) : (
                                <div className="font-mono">
                                  {formatTime(currentData?.from)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editing ? (
                                <Input
                                  type="time"
                                  value={currentData?.to || ''}
                                  onChange={(e) =>
                                    handleChange('to', e.target.value)
                                  }
                                  className="w-full"
                                />
                              ) : (
                                <div className="font-mono flex items-center gap-1">
                                  {formatTime(currentData?.to)}
                                  {currentData?.from &&
                                    currentData?.to &&
                                    currentData.from > currentData.to && (
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        (+1 day)
                                      </span>
                                    )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editing ? (
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={currentData?.isActive || false}
                                    onCheckedChange={(checked) =>
                                      handleChange('isActive', checked)
                                    }
                                  />
                                  <Label className="text-sm">
                                    {currentData?.isActive
                                      ? t('common.active')
                                      : t('common.inactive')}
                                  </Label>
                                </div>
                              ) : (
                                <Badge
                                  variant={
                                    currentData?.isActive
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className={
                                    currentData?.isActive
                                      ? 'bg-green-500 hover:bg-green-600 text-white'
                                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                                  }
                                >
                                  {currentData?.isActive
                                    ? t('common.active')
                                    : t('common.inactive')}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editing ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleSave(mealTime._id)}
                                    className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                                    title={t('common.save')}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancel(mealTime._id)}
                                    className="h-8 w-8 p-0"
                                    title={t('common.cancel')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(mealTime._id)}
                                    className="h-8 w-8 p-0"
                                    title={t('common.edit')}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
