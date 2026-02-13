/**
 * Feedback Config Queries
 * TanStack Query hooks for feedback config management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import {
  FeedbackConfig,
  FeedbackConfigFormData,
  FeedbackConfigQueryParams,
} from '@/types/feedback-config.type';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Feedback config service extending base service
class FeedbackConfigService extends BaseApiService<
  FeedbackConfig,
  FeedbackConfigFormData,
  FeedbackConfigFormData
> {
  constructor() {
    super(API_ENDPOINTS.FEEDBACK_CONFIGS.LIST);
  }

  // Get all feedback configs with optional filters
  async getAllFeedbackConfigs(
    params?: FeedbackConfigQueryParams,
  ): Promise<PaginatedResponse<FeedbackConfig>> {
    return this.getAll(params);
  }

  // Get single feedback config by ID
  async getFeedbackConfigById(
    id: string,
  ): Promise<SuccessResponse<FeedbackConfig>> {
    return this.getById(id);
  }

  // Get only active feedback configs
  async getActiveFeedbackConfigs(
    params?: Omit<FeedbackConfigQueryParams, 'isActive'>,
  ): Promise<PaginatedResponse<FeedbackConfig>> {
    return this.getAll({ ...params, isActive: 'true' });
  }

  // Get feedback configs filtered by restaurant
  async getFeedbackConfigsByRestaurant(
    restaurantId: string,
    params?: Omit<FeedbackConfigQueryParams, 'restaurantId'>,
  ): Promise<PaginatedResponse<FeedbackConfig>> {
    return this.getAll({ ...params, restaurantId });
  }
}

// Create service instance
const feedbackConfigService = new FeedbackConfigService();

// ── Query Hooks ────────────────────────────────────────

// Get all feedback configs with pagination and filters
export const useFeedbackConfigs = (
  params?: FeedbackConfigQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<FeedbackConfig>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.FEEDBACK_CONFIGS.LIST(params),
    queryFn: () => feedbackConfigService.getAllFeedbackConfigs(params),
    ...options,
  });
};

// Get single feedback config by ID
export const useFeedbackConfig = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<FeedbackConfig>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.FEEDBACK_CONFIGS.DETAIL(id),
    queryFn: () => feedbackConfigService.getFeedbackConfigById(id),
    enabled: !!id,
    ...options,
  });
};

// Get only active feedback configs
export const useActiveFeedbackConfigs = (
  params?: Omit<FeedbackConfigQueryParams, 'isActive'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<FeedbackConfig>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.FEEDBACK_CONFIGS.LIST({
      ...params,
      isActive: 'true',
    }),
    queryFn: () => feedbackConfigService.getActiveFeedbackConfigs(params),
    ...options,
  });
};

// Get feedback configs by restaurant
export const useFeedbackConfigsByRestaurant = (
  restaurantId: string,
  params?: Omit<FeedbackConfigQueryParams, 'restaurantId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<FeedbackConfig>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.FEEDBACK_CONFIGS.LIST({
      ...params,
      restaurantId,
    }),
    queryFn: () =>
      feedbackConfigService.getFeedbackConfigsByRestaurant(
        restaurantId,
        params,
      ),
    enabled: !!restaurantId,
    ...options,
  });
};

// Export service for use in mutations
export { feedbackConfigService };
