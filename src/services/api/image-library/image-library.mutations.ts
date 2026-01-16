/**
 * Image Library Mutations
 * TanStack Query mutations for image library operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ImageLibraryItem } from '@/types/imageLibrary.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { imageLibraryService } from './image-library.queries';
import { uploadService } from '../upload/upload.queries';
import { toast } from 'sonner';

// Create image library item mutation
export const useCreateImageLibraryItem = (
  options?: UseMutationOptions<
    SuccessResponse<ImageLibraryItem>,
    Error,
    Omit<ImageLibraryItem, '_id' | 'code'>
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: Omit<ImageLibraryItem, '_id' | 'code'>) => {
      // Extract upload IDs for confirmation (if any)
      const uploadIds =
        ((data as Record<string, unknown>)._uploadIds as string[]) || [];

      // Remove internal tracking field before sending to backend
      const { _uploadIds, ...backendData } = data as Record<string, unknown>;

      // First create the image library item with S3 keys
      const result = await imageLibraryService.create(
        backendData as Omit<ImageLibraryItem, '_id' | 'code'>,
      );

      // Then confirm uploads if there are any upload IDs
      if (uploadIds.length > 0) {
        try {
          await uploadService.confirmUploads(uploadIds);
        } catch (error) {
          console.error(
            'Failed to confirm uploads, but image library item was created:',
            error,
          );
          // Don't fail the entire operation if upload confirmation fails
        }
      }

      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Image added successfully');

      // Invalidate and refetch image library list - use partial matching to catch all queries
      queryUtils.invalidateQueries(['image-library', 'list']);

      // Set the new item in cache
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.IMAGE_LIBRARY.DETAIL(data.data._id),
          data,
        );
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to add image';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update image library item mutation
export const useUpdateImageLibraryItem = (
  options?: UseMutationOptions<
    SuccessResponse<ImageLibraryItem>,
    Error,
    { id: string; data: Partial<Omit<ImageLibraryItem, '_id'>> }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<ImageLibraryItem, '_id'>>;
    }) => {
      // Extract upload IDs for confirmation (if any)
      const uploadIds =
        ((data as Record<string, unknown>)._uploadIds as string[]) || [];

      // Remove internal tracking field before sending to backend
      const { _uploadIds, ...backendData } = data as Record<string, unknown>;

      // Update the image library item with S3 keys
      const result = await imageLibraryService.update(
        id,
        backendData as Partial<Omit<ImageLibraryItem, '_id'>>,
      );

      // Then confirm uploads if there are any upload IDs
      if (uploadIds.length > 0) {
        try {
          await uploadService.confirmUploads(uploadIds);
        } catch (error) {
          console.error(
            'Failed to confirm uploads, but image library item was updated:',
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
      toast.success('Image updated successfully');

      // Update specific item cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.IMAGE_LIBRARY.DETAIL(id), data);
      }

      // Invalidate image library list to refresh the table - use partial matching
      queryUtils.invalidateQueries(['image-library', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update image';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete image library item mutation
export const useDeleteImageLibraryItem = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => imageLibraryService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success('Image deleted successfully');

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.IMAGE_LIBRARY.DETAIL(id));

      // Invalidate image library list - use partial matching
      queryUtils.invalidateQueries(['image-library', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to delete image';
      toast.error(errorMessage);
    },
    ...options,
  });
};
