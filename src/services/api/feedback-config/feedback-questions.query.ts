import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { FeedbackQuestion } from '@/types/feedback-config.type';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import api from '@/lib/axios';

const QUESTION_QUERY_KEYS = {
  LIST: (configId: string) =>
    ['feedback-config', configId, 'questions'] as const,
  DETAIL: (configId: string, questionId: string) =>
    ['feedback-config', configId, 'questions', questionId] as const,
};

class FeedbackQuestionService extends BaseApiService<FeedbackQuestion> {
  constructor() {
    super(API_ENDPOINTS.FEEDBACK_CONFIGS.LIST); // Base endpoint
  }

  // Override or add specific methods for nested resource
  async getQuestionsByConfigId(
    configId: string,
  ): Promise<SuccessResponse<FeedbackQuestion[]>> {
    const url = `/feedback/config/${configId}/questions`;
    return api.get<SuccessResponse<FeedbackQuestion[]>>(url);
  }
}

const feedbackQuestionService = new FeedbackQuestionService();

// Hook to get questions for a config
export const useFeedbackQuestions = (
  configId: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<FeedbackQuestion[]>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.LIST(configId),
    queryFn: () => feedbackQuestionService.getQuestionsByConfigId(configId),
    enabled: !!configId,
    ...options,
  });
};

export { feedbackQuestionService, QUESTION_QUERY_KEYS };
