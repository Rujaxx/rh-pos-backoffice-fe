/**
 * Feedback Config Mutations
 * TanStack Query mutations for feedback config operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  FeedbackConfig,
  FeedbackConfigFormData,
} from '@/types/feedback-config.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { feedbackConfigService } from './feedback-config.query';
import { toast } from 'sonner';

// Create feedback config mutation
export const useCreateFeedbackConfig = (
  options?: UseMutationOptions<
    SuccessResponse<FeedbackConfig>,
    Error,
    FeedbackConfigFormData
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: FeedbackConfigFormData) => {
      return await feedbackConfigService.create(data);
    },

    onSuccess: (data) => {
      toast.success('Feedback config created successfully');

      // Invalidate list queries
      queryUtils.invalidateQueries(['feedback-configs', 'list']);

      // Cache the created item
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.FEEDBACK_CONFIGS.DETAIL(data.data._id),
          data,
        );
      }
    },

    onError: (error) => {
      const msg = error.message || 'Failed to create feedback config';
      toast.error(msg);
    },

    ...options,
  });
};

// Update feedback config mutation
export const useUpdateFeedbackConfig = (
  options?: UseMutationOptions<
    SuccessResponse<FeedbackConfig>,
    Error,
    { id: string; data: FeedbackConfigFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { _id, ...dataWithoutId } = data;
      return await feedbackConfigService.update(id, dataWithoutId);
    },

    onSuccess: (data, variables) => {
      const { id } = variables;

      toast.success('Feedback config updated successfully');

      // Update cached detail
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.FEEDBACK_CONFIGS.DETAIL(id), data);
      }

      // Refresh list
      queryUtils.invalidateQueries(['feedback-configs', 'list']);
    },

    onError: (error) => {
      const msg = error.message || 'Failed to update feedback config';
      toast.error(msg);
    },

    ...options,
  });
};

// Delete feedback config mutation
export const useDeleteFeedbackConfig = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (id: string) => {
      return await feedbackConfigService.delete(id);
    },

    onSuccess: (_, id) => {
      toast.success('Feedback config deleted successfully');

      // Remove cached detail
      queryUtils.removeQueries(QUERY_KEYS.FEEDBACK_CONFIGS.DETAIL(id));

      // Refresh list
      queryUtils.invalidateQueries(['feedback-configs', 'list']);
    },

    onError: (error) => {
      const msg = error.message || 'Failed to delete feedback config';
      toast.error(msg);
    },

    ...options,
  });
};
