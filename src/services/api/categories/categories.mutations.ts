/**
 * Category Mutations
 * TanStack Query mutations for category operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { Category, CategoryFormData } from '@/types/category.type'
import { SuccessResponse } from '@/types/api'
import { QUERY_KEYS } from '@/config/api'
import { useQueryUtils } from '@/lib/query-client'
import { categoryService } from './categories.queries'
import { toast } from 'sonner'

// Create category mutation
export const useCreateCategory = (
  options?: UseMutationOptions<SuccessResponse<Category>, Error, CategoryFormData>
) => {
  const queryUtils = useQueryUtils()
  
  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const result = await categoryService.create(data)
      return result
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Category created successfully')
      
      // Invalidate and refetch categories list - use partial matching to catch all category list queries
      queryUtils.invalidateQueries(['categories', 'list'])
      
      // Set the new category in cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.CATEGORIES.DETAIL(data.data._id), data)
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to create category'
      toast.error(errorMessage)
    },
    ...options,
  })
}

// Update category mutation
export const useUpdateCategory = (
  options?: UseMutationOptions<SuccessResponse<Category>, Error, { id: string; data: CategoryFormData }>
) => {
  const queryUtils = useQueryUtils()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      // Exclude _id from data for update
      const { _id, ...dataWithoutId } = data
      const result = await categoryService.update(id, dataWithoutId)
      return result
    },
    onSuccess: (data, variables) => {
      const { id } = variables
      
      // Show success message
      toast.success('Category updated successfully')
      
      // Update specific category cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.CATEGORIES.DETAIL(id), data)
      }
      
      // Invalidate categories list to refresh the table - use partial matching
      queryUtils.invalidateQueries(['categories', 'list'])
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update category'
      toast.error(errorMessage)
    },
    ...options,
  })
}

// Delete category mutation
export const useDeleteCategory = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>
) => {
  const queryUtils = useQueryUtils()
  
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success('Category deleted successfully')
      
      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.CATEGORIES.DETAIL(id))
      
      // Invalidate categories list - use partial matching
      queryUtils.invalidateQueries(['categories', 'list'])
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to delete category'
      toast.error(errorMessage)
    },
    ...options,
  })
}