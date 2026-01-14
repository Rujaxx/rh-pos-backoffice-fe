/**
 * Restaurant Mutations
 * TanStack Query mutations for restaurant operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Restaurant, RestaurantFormData } from '@/types/restaurant';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { restaurantService } from './restaurants.queries';
import { uploadService } from '../upload/upload.queries';
import { minutesToBackendTime } from '@/lib/utils/time.utils';
import { getKeyFromS3Url } from '@/lib/upload-utils';
import { toast } from 'sonner';

function transformToBackendFormat(
  data: RestaurantFormData,
  excludeId: boolean = false,
): RestaurantFormData {
  const transformed: RestaurantFormData = {
    ...data,
    startDayTime: minutesToBackendTime(data.startDayTime ?? 0),
    endDayTime: minutesToBackendTime(data.endDayTime ?? 0),
    notificationPhone: data.notificationPhone ?? [],
    notificationEmails: data.notificationEmails ?? [],
    isActive: data.isActive ?? false,
    posLogoutOnClose: data.posLogoutOnClose ?? false,
    isFeedBackActive: data.isFeedBackActive ?? false,
    customQRcode: data.customQRcode ?? [],
  };

  // Extract S3 key from logo URL if it's a full URL
  if (
    transformed.logo &&
    typeof transformed.logo === 'string' &&
    transformed.logo.startsWith('http')
  ) {
    transformed.logo = getKeyFromS3Url(transformed.logo);
  }

  // Remove _id if excludeId is true
  if (excludeId && transformed._id) {
    const { _id, ...rest } = transformed;
    return rest;
  }

  return transformed;
}

// Create restaurant mutation
export const useCreateRestaurant = (
  options?: UseMutationOptions<
    SuccessResponse<Restaurant>,
    Error,
    RestaurantFormData
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: RestaurantFormData) => {
      // Extract upload IDs for confirmation (if any)
      const uploadIds = data._uploadIds || [];

      // Remove internal tracking field before sending to backend
      const { _uploadIds, ...backendData } = data;

      // First create the restaurant with S3 keys
      const result = await restaurantService.create(
        transformToBackendFormat(backendData),
      );

      // Then confirm uploads if there are any upload IDs
      if (uploadIds.length > 0) {
        try {
          await uploadService.confirmUploads(uploadIds);
        } catch (error) {
          console.error(
            'Failed to confirm uploads, but restaurant was created:',
            error,
          );
          // Don't fail the entire operation if upload confirmation fails
        }
      }

      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Restaurant created successfully');

      // Invalidate and refetch all restaurant-related queries
      queryUtils.invalidateQueries(['restaurants']);

      // Also directly refetch the main restaurants list query
      queryUtils.invalidateQueries(QUERY_KEYS.RESTAURANTS.LIST());

      // Force immediate refetch to update the UI
      queryUtils.refetchQueries(['restaurants']);

      // Set the new restaurant in cache
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.RESTAURANTS.DETAIL(data.data._id),
          data,
        );
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to create restaurant';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update restaurant mutation
export const useUpdateRestaurant = (
  options?: UseMutationOptions<
    SuccessResponse<Restaurant>,
    Error,
    { id: string; data: RestaurantFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: RestaurantFormData;
    }) => {
      // Extract upload IDs for confirmation (if any)
      const uploadIds = data._uploadIds || [];

      // Remove internal tracking field before sending to backend
      const { _uploadIds, ...backendData } = data;

      // First update the restaurant with S3 keys (exclude _id from data)
      const result = await restaurantService.update(
        id,
        transformToBackendFormat(backendData, true),
      );

      // Then confirm uploads if there are any upload IDs
      if (uploadIds.length > 0) {
        try {
          await uploadService.confirmUploads(uploadIds);
        } catch (error) {
          console.error(
            'Failed to confirm uploads, but restaurant was updated:',
            error,
          );
          // Don't fail the entire operation if upload confirmation fails
        }
      }

      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Show success message
      toast.success('Restaurant updated successfully');

      // Update specific restaurant cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.RESTAURANTS.DETAIL(id), data);
      }

      // Invalidate all restaurant-related queries to refresh the data
      queryUtils.invalidateQueries(['restaurants']);

      // Also directly refetch the main restaurants list query
      queryUtils.invalidateQueries(QUERY_KEYS.RESTAURANTS.LIST());

      // Force immediate refetch to update the UI
      queryUtils.refetchQueries(['restaurants']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update restaurant';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete restaurant mutation
export const useDeleteRestaurant = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => restaurantService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success('Restaurant deleted successfully');

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.RESTAURANTS.DETAIL(id));

      // Invalidate all restaurant-related queries
      queryUtils.invalidateQueries(['restaurants']);

      // Also directly refetch the main restaurants list query
      queryUtils.invalidateQueries(QUERY_KEYS.RESTAURANTS.LIST());

      // Force immediate refetch to update the UI
      queryUtils.refetchQueries(['restaurants']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to delete restaurant';
      toast.error(errorMessage);
    },
    ...options,
  });
};
