import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { FeedbackQuestion } from '@/types/feedback-config.type';
import { SuccessResponse } from '@/types/api';
import { useQueryUtils } from '@/lib/query-client';
import { QUESTION_QUERY_KEYS } from './feedback-questions.query';
import { toast } from 'sonner';
import api from '@/lib/axios';

// Create Question
export const useCreateFeedbackQuestion = (
  configId: string,
  options?: UseMutationOptions<
    SuccessResponse<FeedbackQuestion>,
    Error,
    Partial<FeedbackQuestion>
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data) => {
      // Endpoint: POST /feedback/config/:configId/questions
      return await api.post<SuccessResponse<FeedbackQuestion>>(
        `/feedback/config/${configId}/questions`,
        data,
      );
    },
    onSuccess: () => {
      toast.success('Question added successfully');
      queryUtils.invalidateQueries(QUESTION_QUERY_KEYS.LIST(configId));
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add question');
    },
    ...options,
  });
};

// Update Question
export const useUpdateFeedbackQuestion = (
  configId: string,
  options?: UseMutationOptions<
    SuccessResponse<FeedbackQuestion>,
    Error,
    { questionId: string; data: Partial<FeedbackQuestion> }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ questionId, data }) => {
      return await api.patch<SuccessResponse<FeedbackQuestion>>(
        `/feedback/questions/${questionId}`,
        data,
      );
    },
    onSuccess: () => {
      toast.success('Question updated successfully');
      queryUtils.invalidateQueries(QUESTION_QUERY_KEYS.LIST(configId));
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update question');
    },
    ...options,
  });
};

// Delete Question
export const useDeleteFeedbackQuestion = (
  configId: string,
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (questionId) => {
      return await api.delete<SuccessResponse<void>>(
        `/feedback/config/${configId}/questions/${questionId}`,
      );
    },
    onSuccess: () => {
      toast.success('Question deleted successfully');
      queryUtils.invalidateQueries(QUESTION_QUERY_KEYS.LIST(configId));
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete question');
    },
    ...options,
  });
};
