import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { PaginatedResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { MealTimeFrame } from '@/types/meal-time-frame.type';
import { MealTimeFrameSchemaData } from '@/lib/validations/meal-time-frame.validation';
import api from '@/lib/axios';

class MealTimeFrameService extends BaseApiService<
  MealTimeFrame,
  MealTimeFrameSchemaData,
  MealTimeFrameSchemaData
> {
  constructor() {
    super(API_ENDPOINTS.MEAL_TIME_FRAME.LIST);
  }

  async getAllMealTimeFrames(
    restaurantId: string,
  ): Promise<PaginatedResponse<MealTimeFrame>> {
    const url = API_ENDPOINTS.MEAL_TIME_FRAME.LIST_BY_RESTAURANT(restaurantId);
    return api.get(url);
  }
}

const mealTimeFrameService = new MealTimeFrameService();

// Get paginated meal time frames
export const useMealTimeFrames = (
  restaurantId: string,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MealTimeFrame>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEAL_TIME_FRAME.LIST({ restaurantId }),
    queryFn: () => mealTimeFrameService.getAllMealTimeFrames(restaurantId),
    enabled: !!restaurantId,
    ...options,
  });
};

export { mealTimeFrameService };
