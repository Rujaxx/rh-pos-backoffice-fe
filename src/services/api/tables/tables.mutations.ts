/**
 * Table Mutations
 * TanStack Query mutations for table operations
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Table, TableFormData } from "@/types/table";
import { SuccessResponse } from "@/types/api";
import { QUERY_KEYS } from "@/config/api";
import { useQueryUtils } from "@/lib/query-client";
import { tableService } from "./tables.queries";
import { toast } from "sonner";

// Create table mutation
export const useCreateTable = (
  options?: UseMutationOptions<SuccessResponse<Table>, Error, TableFormData>
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: TableFormData) => {
      const result = await tableService.create(data);
      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success("Table created successfully");

      // Invalidate and refetch tables list - use partial matching to catch all table list queries
      queryUtils.invalidateQueries(["tables", "list"]);

      // Set the new table in cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.TABLES.DETAIL(data.data._id), data);
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to create table";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update table mutation
export const useUpdateTable = (
  options?: UseMutationOptions<
    SuccessResponse<Table>,
    Error,
    { id: string; data: TableFormData }
  >
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TableFormData }) => {
      // Exclude _id from data for update
      const { _id, ...dataWithoutId } = data;
      const result = await tableService.update(id, dataWithoutId);
      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Show success message
      toast.success("Table updated successfully");

      // Update specific table cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.TABLES.DETAIL(id), data);
      }

      // Invalidate tables list to refresh the table - use partial matching
      queryUtils.invalidateQueries(["tables", "list"]);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to update table";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete table mutation
export const useDeleteTable = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => tableService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success("Table deleted successfully");

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.TABLES.DETAIL(id));

      // Invalidate tables list - use partial matching
      queryUtils.invalidateQueries(["tables", "list"]);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to delete table";
      toast.error(errorMessage);
    },
    ...options,
  });
};
