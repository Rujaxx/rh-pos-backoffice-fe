import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  KitchenDepartment,
  KitchenDepartmentFormData,
} from "@/types/kitchen-department.type";
import { SuccessResponse } from "@/types/api";
import { QUERY_KEYS } from "@/config/api";
import { useQueryUtils } from "@/lib/query-client";
import { kitchenDepartmentService } from "./kitchen-departments.queries";
import { toast } from "sonner";

// Create kitchen department mutation
export const useCreateKitchenDepartment = (
  options?: UseMutationOptions<
    SuccessResponse<KitchenDepartment>,
    Error,
    KitchenDepartmentFormData
  >
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: KitchenDepartmentFormData) => {
      const result = await kitchenDepartmentService.create(data);
      return result;
    },
    onSuccess: (data) => {
      toast.success("Kitchen department created successfully");
      queryUtils.invalidateQueries(["kitchen-departments", "list"]);

      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.KITCHEN_DEPARTMENTS.DETAIL(data.data._id),
          data
        );
      }
    },
    onError: (error) => {
      const errorMessage =
        error.message || "Failed to create kitchen department";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update kitchen department mutation
export const useUpdateKitchenDepartment = (
  options?: UseMutationOptions<
    SuccessResponse<KitchenDepartment>,
    Error,
    { id: string; data: KitchenDepartmentFormData }
  >
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: KitchenDepartmentFormData;
    }) => {
      const { _id, ...dataWithoutId } = data;
      const result = await kitchenDepartmentService.update(id, dataWithoutId);
      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      toast.success("Kitchen department updated successfully");

      // Update cached item
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.KITCHEN_DEPARTMENTS.DETAIL(id),
          data
        );
      }

      // Refresh list
      queryUtils.invalidateQueries(["kitchen-departments", "list"]);
    },
    onError: (error) => {
      const errorMessage =
        error.message || "Failed to update kitchen department";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete kitchen department mutation
export const useDeleteKitchenDepartment = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => kitchenDepartmentService.delete(id),
    onSuccess: (_, id) => {
      toast.success("Kitchen department deleted successfully");

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.KITCHEN_DEPARTMENTS.DETAIL(id));

      // Refresh list
      queryUtils.invalidateQueries(["kitchen-departments", "list"]);
    },
    onError: (error) => {
      const errorMessage =
        error.message || "Failed to delete kitchen department";
      toast.error(errorMessage);
    },
    ...options,
  });
};
