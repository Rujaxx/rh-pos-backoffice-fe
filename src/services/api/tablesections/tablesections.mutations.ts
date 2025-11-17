/**
 * Table Section Mutations
 * TanStack Query mutations for table section operations
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TableSection, TableSectionFormData } from "@/types/tablesection.type";
import { SuccessResponse } from "@/types/api";
import { QUERY_KEYS } from "@/config/api";
import { useQueryUtils } from "@/lib/query-client";
import { tableSectionService } from "./tablesections.queries";
import { toast } from "sonner";

// Create table section mutation
export const useCreateTableSection = (
  options?: UseMutationOptions<
    SuccessResponse<TableSection>,
    Error,
    TableSectionFormData
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: TableSectionFormData) => {
      const result = await tableSectionService.create(data);
      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success("Table section created successfully");

      // Invalidate and refetch table sections list - use partial matching to catch all queries
      queryUtils.invalidateQueries(["table-sections", "list"]);

      // Set the new table section in cache
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.TABLE_SECTIONS.DETAIL(data.data._id),
          data,
        );
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to create table section";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update table section mutation
export const useUpdateTableSection = (
  options?: UseMutationOptions<
    SuccessResponse<TableSection>,
    Error,
    { id: string; data: TableSectionFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TableSectionFormData;
    }) => {
      // Exclude _id from data for update
      const { _id, ...dataWithoutId } = data;
      const result = await tableSectionService.update(id, dataWithoutId);
      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Show success message
      toast.success("Table section updated successfully");

      // Update specific table section cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.TABLE_SECTIONS.DETAIL(id), data);
      }

      // Invalidate table sections list to refresh the table - use partial matching
      queryUtils.invalidateQueries(["table-sections", "list"]);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to update table section";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete table section mutation
export const useDeleteTableSection = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => tableSectionService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success("Table section deleted successfully");

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.TABLE_SECTIONS.DETAIL(id));

      // Invalidate table sections list - use partial matching
      queryUtils.invalidateQueries(["table-sections", "list"]);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to delete table section";
      toast.error(errorMessage);
    },
    ...options,
  });
};
