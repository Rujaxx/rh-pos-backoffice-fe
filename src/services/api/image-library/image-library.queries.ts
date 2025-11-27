/**
 * Image Library Service Queries
 * TanStack Query hooks for image library management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { ImageLibraryItem } from '@/types/imageLibrary.type';
import { PaginatedResponse, SuccessResponse, QueryParams } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Image Library service extending base service
class ImageLibraryService extends BaseApiService<
  ImageLibraryItem,
  Omit<ImageLibraryItem, '_id' | 'code'>,
  Partial<Omit<ImageLibraryItem, '_id' | 'code'>>
> {
  constructor() {
    super(API_ENDPOINTS.IMAGE_LIBRARY.LIST);
  }

  // Get all image library items with optional filters
  async getAllImageLibraryItems(
    params?: QueryParams,
  ): Promise<PaginatedResponse<ImageLibraryItem>> {
    return this.getAll(params);
  }

  // Get image library item by ID
  async getImageLibraryItemById(
    id: string,
  ): Promise<SuccessResponse<ImageLibraryItem>> {
    return this.getById(id);
  }
}

// Create service instance
const imageLibraryService = new ImageLibraryService();

// Query hooks

// Get all image library items with pagination and filters
export const useImageLibraryItems = (
  params?: QueryParams,
  options?: UseQueryOptions<PaginatedResponse<ImageLibraryItem>>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.IMAGE_LIBRARY.LIST(params),
    queryFn: () => imageLibraryService.getAllImageLibraryItems(params),
    ...options,
  });
};

// Get single image library item by ID
export const useImageLibraryItem = (
  id: string,
  options?: UseQueryOptions<SuccessResponse<ImageLibraryItem>>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.IMAGE_LIBRARY.DETAIL(id),
    queryFn: () => imageLibraryService.getImageLibraryItemById(id),
    enabled: !!id,
    ...options,
  });
};

// Export service for use in mutations
export { imageLibraryService };
