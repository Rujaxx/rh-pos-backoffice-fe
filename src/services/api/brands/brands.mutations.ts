/**
 * Brand Mutations
 * TanStack Query mutations for brand operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Brand, BrandFormData } from '@/types/brand.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { brandService } from './brands.queries';
import { uploadService } from '../upload/upload.queries';
import { toast } from 'sonner';

// Create brand mutation
export const useCreateBrand = (
  options?: UseMutationOptions<SuccessResponse<Brand>, Error, BrandFormData>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: BrandFormData) => {
      // First create the brand
      const result = await brandService.create(data);

      // Then confirm uploads if there are any upload keys
      const uploadKeys: string[] = [];
      if (data.logo && !data.logo.startsWith('http')) {
        // If logo is a key (not a URL), add it to confirm list
        uploadKeys.push(data.logo);
      }

      if (uploadKeys.length > 0) {
        try {
          await uploadService.confirmUploads(uploadKeys);
        } catch (error) {
          console.error(
            'Failed to confirm uploads, but brand was created:',
            error,
          );
          // Don't fail the entire operation if upload confirmation fails
        }
      }

      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Brand created successfully');

      // Invalidate and refetch brands list - use partial matching to catch all brand list queries
      queryUtils.invalidateQueries(['brands', 'list']);

      // Set the new brand in cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.BRANDS.DETAIL(data.data._id), data);
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to create brand';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update brand mutation
export const useUpdateBrand = (
  options?: UseMutationOptions<
    SuccessResponse<Brand>,
    Error,
    { id: string; data: BrandFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BrandFormData }) => {
      // First update the brand (exclude _id from data)
      const { _id, ...dataWithoutId } = data;
      const result = await brandService.update(id, dataWithoutId);

      // Then confirm uploads if there are any upload keys
      const uploadKeys: string[] = [];
      if (data.logo && !data.logo.startsWith('http')) {
        // If logo is a key (not a URL), add it to confirm list
        uploadKeys.push(data.logo);
      }

      if (uploadKeys.length > 0) {
        try {
          await uploadService.confirmUploads(uploadKeys);
        } catch (error) {
          console.error(
            'Failed to confirm uploads, but brand was updated:',
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
      toast.success('Brand updated successfully');

      // Update specific brand cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.BRANDS.DETAIL(id), data);
      }

      // Invalidate brands list to refresh the table - use partial matching
      queryUtils.invalidateQueries(['brands', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update brand';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete brand mutation
export const useDeleteBrand = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => brandService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success('Brand deleted successfully');

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.BRANDS.DETAIL(id));

      // Invalidate brands list - use partial matching
      queryUtils.invalidateQueries(['brands', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to delete brand';
      toast.error(errorMessage);
    },
    ...options,
  });
};
