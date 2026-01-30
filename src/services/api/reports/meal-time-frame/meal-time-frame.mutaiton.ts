import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { SuccessResponse } from '@/types/api';
import { useQueryUtils } from '@/lib/query-client';
import { mealTimeFrameService } from './meal-time-frame.query';
import { toast } from 'sonner';
import {
  MealTimeFrame,
  MealTimeFrameFormData,
} from '@/types/meal-time-frame.type';

function transformToBackendFormat(
  data: MealTimeFrameFormData,
  excludeId: boolean = false,
): MealTimeFrameFormData {
  const transformed: MealTimeFrameFormData & { _id?: string } = { ...data };

  if (excludeId && transformed._id) {
    const { _id, ...rest } = transformed;
    return rest;
  }

  return transformed;
}

// CREATE
export const useCreateMealTimeFrame = (
  options?: UseMutationOptions<
    SuccessResponse<MealTimeFrame>,
    Error,
    MealTimeFrameFormData
  >,
) => {
  const queryUtils = useQueryUtils();
  return useMutation({
    mutationFn: async (data: MealTimeFrameFormData) =>
      mealTimeFrameService.create(transformToBackendFormat(data)),
    onSuccess: (data) => {
      toast.success('Meal time frame created successfully');
      queryUtils.invalidateQueries(['meal-time-frame']);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to create meal time frame';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// UPDATE
export const useUpdateMealTimeFrame = (
  options?: UseMutationOptions<
    SuccessResponse<MealTimeFrame>,
    Error,
    { id: string; data: MealTimeFrameFormData }
  >,
) => {
  const queryUtils = useQueryUtils();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      mealTimeFrameService.update(id, transformToBackendFormat(data, true)),
    onSuccess: (data, vars) => {
      toast.success('Meal time frame updated successfully');
      queryUtils.invalidateQueries(['meal-time-frame']);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to update meal time frame';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// DELETE
export const useDeleteMealTimeFrame = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();
  return useMutation({
    mutationFn: (id: string) => mealTimeFrameService.delete(id),
    onSuccess: (_, id) => {
      toast.success('Meal time frame deleted successfully');
      queryUtils.invalidateQueries(['meal-time-frame']);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to delete meal time frame';
      toast.error(errorMessage);
    },
    ...options,
  });
};
