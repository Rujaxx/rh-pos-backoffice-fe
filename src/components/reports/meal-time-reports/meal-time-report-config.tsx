'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { MealTimeConfig } from '@/types/meal-time-report.type';

interface MealTimeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealTimes: MealTimeConfig[]) => Promise<void>;
}

// Initial meal slot names
const INITIAL_MEAL_SLOT_OPTIONS = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Brunch', value: 'brunch' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Afternoon Snack', value: 'afternoon_snack' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Late Night', value: 'late_night' },
  { label: 'All Day', value: 'all_day' },
  { label: 'Happy Hour', value: 'happy_hour' },
  { label: 'Weekend Special', value: 'weekend_special' },
  { label: 'Buffet', value: 'buffet' },
];

export function MealTimeConfigModal({
  isOpen,
  onClose,
  onSave,
}: MealTimeConfigModalProps) {
  const { t } = useTranslation();
  const [mealTimes, setMealTimes] = useState<MealTimeConfig[]>([
    {
      _id: '1',
      name: 'Breakfast',
      startTime: '06:00',
      endTime: '11:00',
      isActive: true,
      mealSlotNames: ['breakfast'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      name: 'Lunch',
      startTime: '12:00',
      endTime: '16:00',
      isActive: true,
      mealSlotNames: ['lunch'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      name: 'Dinner',
      startTime: '18:00',
      endTime: '23:00',
      isActive: true,
      mealSlotNames: ['dinner'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<MealTimeConfig> | null>(
    null,
  );
  const [mealSlotOptions, setMealSlotOptions] = useState(
    INITIAL_MEAL_SLOT_OPTIONS,
  );
  const [newSlotInput, setNewSlotInput] = useState('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Store initial state to detect changes
  const [initialMealTimes, setInitialMealTimes] = useState<MealTimeConfig[]>(
    [],
  );
  const [initialMealSlotOptions, setInitialMealSlotOptions] = useState(
    INITIAL_MEAL_SLOT_OPTIONS,
  );

  // Check for changes - compare meal times (ignoring _id for temp items)
  const hasChanges = useMemo(() => {
    // Check if meal times have changed
    const cleanCurrent = mealTimes.map(
      ({ _id, createdAt, updatedAt, ...rest }) => rest,
    );
    const cleanInitial = initialMealTimes.map(
      ({ _id, createdAt, updatedAt, ...rest }) => rest,
    );

    const mealTimesChanged =
      JSON.stringify(cleanCurrent) !== JSON.stringify(cleanInitial);

    // Check if meal slot options have changed
    const optionsChanged =
      JSON.stringify(mealSlotOptions) !==
      JSON.stringify(initialMealSlotOptions);

    return mealTimesChanged || optionsChanged;
  }, [mealTimes, initialMealTimes, mealSlotOptions, initialMealSlotOptions]);

  useEffect(() => {
    if (isOpen) {
      // Clone initial state when modal opens
      const initial = mealTimes.map((mt) => ({ ...mt }));
      setInitialMealTimes(initial);
      setInitialMealSlotOptions([...mealSlotOptions]);
      setEditingId(null);
      setEditData(null);
      setNewSlotInput('');
      setShowCloseConfirm(false);
    }
  }, [isOpen]);

  const handleEdit = (id: string) => {
    const mealTime = mealTimes.find((mt) => mt._id === id);
    if (mealTime) {
      setEditingId(id);
      setEditData({ ...mealTime });
    }
  };

  const handleSave = (id: string) => {
    if (!editData) return;

    const updatedMealTime: MealTimeConfig = {
      _id: id,
      name: editData.name || '',
      startTime: editData.startTime || '',
      endTime: editData.endTime || '',
      isActive: editData.isActive ?? true,
      mealSlotNames: editData.mealSlotNames || [],
      createdAt:
        mealTimes.find((mt) => mt._id === id)?.createdAt ||
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMealTimes((prev) =>
      prev.map((mt) => (mt._id === id ? updatedMealTime : mt)),
    );
    setEditingId(null);
    setEditData(null);
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

  const handleAddToMealSlots = () => {
    if (!newSlotInput.trim()) {
      toast.error('Please enter a slot name');
      return;
    }

    // Check if slot already exists
    const exists = mealSlotOptions.some(
      (option) =>
        option.value.toLowerCase() === newSlotInput.trim().toLowerCase() ||
        option.label.toLowerCase() === newSlotInput.trim().toLowerCase(),
    );

    if (exists) {
      toast.error('This slot name already exists');
      return;
    }

    const newValue = newSlotInput.trim().toLowerCase().replace(/\s+/g, '_');
    const newOption = {
      label: newSlotInput.trim(),
      value: newValue,
    };

    setMealSlotOptions((prev) => [...prev, newOption]);

    // Also create a new meal time with this slot
    const newId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const newMealTime: MealTimeConfig = {
      _id: newId,
      name: newSlotInput.trim(),
      startTime: '06:00',
      endTime: '10:00',
      isActive: true,
      mealSlotNames: [newValue],
      createdAt: now,
      updatedAt: now,
    };

    setMealTimes((prev) => [...prev, newMealTime]);
    setEditingId(newId);
    setEditData(newMealTime);

    setNewSlotInput('');
  };

  const handleClickTagToAdd = (option: { label: string; value: string }) => {
    // Check if this meal slot is already used
    const isAlreadyUsed = mealTimes.some((mt) =>
      mt.mealSlotNames?.includes(option.value),
    );

    if (isAlreadyUsed) {
      toast.error(`"${option.label}" is already configured`);
      return;
    }

    // Create new meal time with this slot
    const newId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const newMealTime: MealTimeConfig = {
      _id: newId,
      name: option.label,
      startTime: '06:00',
      endTime: '10:00',
      isActive: true,
      mealSlotNames: [option.value],
      createdAt: now,
      updatedAt: now,
    };

    setMealTimes((prev) => [...prev, newMealTime]);
    setEditingId(newId);
    setEditData(newMealTime);
  };

  const handleDelete = (id: string) => {
    if (mealTimes.length <= 1) {
      toast.error(
        t('reports.mealTime.minOneMealTime') ||
          'At least one meal time must be configured',
      );
      return;
    }

    setMealTimes((prev) => prev.filter((mt) => mt._id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditData(null);
    }
  };

  const validateMealTimes = (): string[] => {
    const errors: string[] = [];

    // First validate individual meal times
    mealTimes.forEach((mt, index) => {
      // Validate name (which is now the meal slot name)
      if (!mt.name?.trim()) {
        errors.push(`Meal time ${index + 1} requires a name`);
      }

      // Validate time format and range
      const startTimeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const endTimeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

      if (!startTimeRegex.test(mt.startTime)) {
        errors.push(
          `Invalid start time format for "${mt.name}". Use HH:MM format.`,
        );
      }

      if (!endTimeRegex.test(mt.endTime)) {
        errors.push(
          `Invalid end time format for "${mt.name}". Use HH:MM format.`,
        );
      }

      // Validate time range
      const [startHour, startMinute] = mt.startTime.split(':').map(Number);
      const [endHour, endMinute] = mt.endTime.split(':').map(Number);

      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      if (startTotalMinutes >= endTotalMinutes) {
        errors.push(`End time must be after start time for "${mt.name}"`);
      }
    });

    // Check for overlapping time ranges - check each pair only once
    for (let i = 0; i < mealTimes.length; i++) {
      const mt1 = mealTimes[i];

      // Skip if inactive
      if (!mt1.isActive) continue;

      const [startHour1, startMinute1] = mt1.startTime.split(':').map(Number);
      const [endHour1, endMinute1] = mt1.endTime.split(':').map(Number);
      const startTotal1 = startHour1 * 60 + startMinute1;
      const endTotal1 = endHour1 * 60 + endMinute1;

      for (let j = i + 1; j < mealTimes.length; j++) {
        const mt2 = mealTimes[j];

        // Skip if inactive
        if (!mt2.isActive) continue;

        const [startHour2, startMinute2] = mt2.startTime.split(':').map(Number);
        const [endHour2, endMinute2] = mt2.endTime.split(':').map(Number);
        const startTotal2 = startHour2 * 60 + startMinute2;
        const endTotal2 = endHour2 * 60 + endMinute2;

        const overlaps =
          (startTotal1 >= startTotal2 && startTotal1 < endTotal2) ||
          (endTotal1 > startTotal2 && endTotal1 <= endTotal2) ||
          (startTotal1 <= startTotal2 && endTotal1 >= endTotal2);

        if (overlaps) {
          errors.push(
            `Time overlap between "${mt1.name}" (${mt1.startTime}-${mt1.endTime}) and "${mt2.name}" (${mt2.startTime}-${mt2.endTime})`,
          );
        }
      }
    }

    return errors;
  };

  const handleSaveAll = async () => {
    const errors = validateMealTimes();
    if (errors.length > 0) {
      // Show first error only to avoid spam
      toast.error(errors[0]);
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Saving meal time configuration...');

    try {
      await onSave(mealTimes);

      // Update initial states to reflect saved state
      const updatedInitialMealTimes = mealTimes.map((mt) => ({ ...mt }));
      setInitialMealTimes(updatedInitialMealTimes);
      setInitialMealSlotOptions([...mealSlotOptions]);

      toast.dismiss(loadingToast);

      // Don't show success toast here - let parent component handle it
      // The parent will close the modal after successful save

      // Close modal directly
      onClose();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save meal time configuration');
      console.error('Failed to save meal times:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!hasChanges) {
      toast.info('No changes to reset');
      return;
    }

    setMealTimes([...initialMealTimes]);
    setMealSlotOptions([...initialMealSlotOptions]);
    setEditingId(null);
    setEditData(null);
    setNewSlotInput('');
    toast.info('All changes have been reset');
  };

  const handleCloseModal = () => {
    if (hasChanges && !isSaving) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  const isEditing = (id: string) => editingId === id;
  const getMealTime = (id: string) => {
    if (isEditing(id) && editData) return editData;
    return mealTimes.find((mt) => mt._id === id);
  };

  // Get unused meal slot options (for clicking)
  const unusedMealSlotOptions = mealSlotOptions.filter(
    (option) =>
      !mealTimes.some((mt) => mt.mealSlotNames?.includes(option.value)),
  );

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

          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              {t('reports.mealTime.configDescription') ||
                'Configure meal times to analyze sales based on different time periods of the day.'}
            </div>

            {/* Meal Slots Section */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Add Meal Slots</Label>
                <div className="text-sm text-muted-foreground">
                  Click on a tag to add it as a meal time
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={newSlotInput}
                    onChange={(e) => setNewSlotInput(e.target.value)}
                    placeholder="Type new meal slot name and press Add"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddToMealSlots();
                      }
                    }}
                  />
                  <Button onClick={handleAddToMealSlots} variant="outline">
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Available Meal Slots:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unusedMealSlotOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleClickTagToAdd(option)}
                      >
                        {option.label}
                        <Plus className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                    {unusedMealSlotOptions.length === 0 && (
                      <div className="text-sm text-muted-foreground italic">
                        All meal slots are configured. Add a new one above.
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                      Start Time
                      <span className="text-destructive ml-1">*</span>
                    </TableHead>
                    <TableHead className="w-[120px]">
                      End Time
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
                  {mealTimes.map((mealTime) => {
                    const currentData = getMealTime(mealTime._id);
                    const editing = isEditing(mealTime._id);

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
                              value={currentData?.startTime || '06:00'}
                              onChange={(e) =>
                                handleChange('startTime', e.target.value)
                              }
                              className="w-full"
                            />
                          ) : (
                            <div className="font-mono">
                              {currentData?.startTime}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editing ? (
                            <Input
                              type="time"
                              value={currentData?.endTime || '10:00'}
                              onChange={(e) =>
                                handleChange('endTime', e.target.value)
                              }
                              className="w-full"
                            />
                          ) : (
                            <div className="font-mono">
                              {currentData?.endTime}
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
                                currentData?.isActive ? 'default' : 'secondary'
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
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(mealTime._id)}
                                className="h-8 w-8 p-0"
                                title={t('common.edit')}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(mealTime._id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                title={t('common.delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
            >
              {t('common.reset')}
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              {t('common.close')}
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t('common.save')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without
              saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Close Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
