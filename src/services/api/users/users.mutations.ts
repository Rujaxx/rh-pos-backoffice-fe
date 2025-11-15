import { useQueryUtils } from "@/lib/query-client";
import { SuccessResponse } from "@/types/api";
import { User, UserFormData } from "@/types/user.type";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { userService } from "./users.queries";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/config/api";

function transformToBackendFormat(
  data: UserFormData,
  excludeId: boolean = false,
) {
  const transformed = {
    ...data,
    name: data.name ?? "",
    username: data.username,
    role: data.role,
    email: data.email,
    phoneNumber: data.phoneNumber ?? "",
    password: data.password ?? "",
    address: data.address ?? "",
    designation: data.designation ?? "",
    webAccess: data.webAccess ?? false,
    brandIds: data.brandIds ?? [],
    restaurantIds: data.restaurantIds ?? [],
    isActive: data.isActive ?? true,
    shiftStart: data.shiftStart ?? 0,
    shiftEnd: data.shiftEnd ?? 0,
    macAddress: data.macAddress ?? "",
    language: data.language ?? "en",
    timeZone: data.timeZone ?? "Asia/Karachi",
    agreeToTerms: data.agreeToTerms ?? false,
  };

  if (excludeId && "_id" in transformed) {
    const { _id, password, ...rest } = transformed;
    return rest;
  }

  return transformed;
}

export const useCreateUser = (
  options?: UseMutationOptions<SuccessResponse<User>, Error, UserFormData>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: UserFormData) => {
      const result = await userService.create(transformToBackendFormat(data));
      return result;
    },
    onSuccess: (data) => {
      toast.success("User created successfully");
      queryUtils.invalidateQueries(["users"]);
      queryUtils.invalidateQueries(QUERY_KEYS.USERS.LIST());
      queryUtils.refetchQueries(["users"]);
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.USERS.DETAIL(data.data._id), data);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create user");
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<
    SuccessResponse<User>,
    Error,
    { id: string; data: UserFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const result = await userService.update(
        id,
        transformToBackendFormat(data, true),
      );
      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;
      toast.success("User updated successfully");
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.USERS.DETAIL(id), data);
      }
      queryUtils.invalidateQueries(["users"]);
      queryUtils.invalidateQueries(QUERY_KEYS.USERS.LIST());
      queryUtils.refetchQueries(["users"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update user");
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: (_, id) => {
      toast.success("User deleted successfully");
      queryUtils.removeQueries(QUERY_KEYS.USERS.DETAIL(id));
      queryUtils.invalidateQueries(["users"]);
      queryUtils.invalidateQueries(QUERY_KEYS.USERS.LIST());
      queryUtils.refetchQueries(["users"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete user");
    },
    ...options,
  });
};
