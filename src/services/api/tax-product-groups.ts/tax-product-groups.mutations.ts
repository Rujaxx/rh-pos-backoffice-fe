import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  TaxProductGroup,
  TaxProductGroupFormData,
} from "@/types/tax-product-group.type";
import { SuccessResponse } from "@/types/api";
import { QUERY_KEYS } from "@/config/api";
import { useQueryUtils } from "@/lib/query-client";
import { taxProductGroupService } from "./tax-product-groups.queries";
import { toast } from "sonner";

// Create tax product group mutation
export const useCreateTaxProductGroup = (
  options?: UseMutationOptions<
    SuccessResponse<TaxProductGroup>,
    Error,
    TaxProductGroupFormData
  >
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: TaxProductGroupFormData) => {
      return await taxProductGroupService.create(data);
    },

    onSuccess: (data) => {
      toast.success("Tax product group created successfully");

      // Invalidate list queries
      queryUtils.invalidateQueries(["tax-product-groups", "list"]);

      // Cache the created item
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.TAX_PRODUCT_GROUPS.DETAIL(data.data._id!),
          data
        );
      }
    },

    onError: (error) => {
      const msg = error.message || "Failed to create tax product group";
      toast.error(msg);
    },

    ...options,
  });
};

// Update tax product group mutation
export const useUpdateTaxProductGroup = (
  options?: UseMutationOptions<
    SuccessResponse<TaxProductGroup>,
    Error,
    { id: string; data: TaxProductGroupFormData }
  >
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { _id, ...dataWithoutId } = data;
      return await taxProductGroupService.update(id, dataWithoutId);
    },

    onSuccess: (data, variables) => {
      const { id } = variables;

      toast.success("Tax product group updated successfully");

      // Update cached detail
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.TAX_PRODUCT_GROUPS.DETAIL(id), data);
      }

      // Refresh list
      queryUtils.invalidateQueries(["tax-product-groups", "list"]);
    },

    onError: (error) => {
      const msg = error.message || "Failed to update tax product group";
      toast.error(msg);
    },

    ...options,
  });
};

// Delete tax product group mutation
export const useDeleteTaxProductGroup = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (id: string) => {
      return await taxProductGroupService.delete(id);
    },

    onSuccess: (_, id) => {
      toast.success("Tax product group deleted successfully");

      // Remove cached detail
      queryUtils.removeQueries(QUERY_KEYS.TAX_PRODUCT_GROUPS.DETAIL(id));

      // Refresh list
      queryUtils.invalidateQueries(["tax-product-groups", "list"]);
    },

    onError: (error) => {
      const msg = error.message || "Failed to delete tax product group";
      toast.error(msg);
    },

    ...options,
  });
};
