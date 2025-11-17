/**
 * Upload Mutations
 * TanStack Query mutations for upload operations
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { uploadService } from "./upload.queries";
import { toast } from "sonner";
import { useQueryUtils } from "@/lib/query-client";
import { QUERY_KEYS } from "@/config/api";
import {
  UploadResponse,
  UploadOptions,
  UploadConfirmResponse,
  DeleteTemporaryUploadResponse,
} from "@/types/upload";
import { SuccessResponse } from "@/types/api";

// Upload single image mutation
export const useUploadImage = (
  options?: UseMutationOptions<
    SuccessResponse<UploadResponse>,
    Error,
    { file: File; options: UploadOptions }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: ({ file, options }: { file: File; options: UploadOptions }) =>
      uploadService.uploadImage(file, options),
    onSuccess: (data, variables) => {
      // Show success message
      toast.success("Image uploaded successfully");

      // Cache the upload result
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.UPLOAD.IMAGE(data.data.key), data);
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to upload image";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Upload multiple images mutation
export const useUploadMultipleImages = (
  options?: UseMutationOptions<
    SuccessResponse<UploadResponse[]>,
    Error,
    { files: File[]; options: UploadOptions }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: ({
      files,
      options,
    }: {
      files: File[];
      options: UploadOptions;
    }) => uploadService.uploadMultipleImages(files, options),
    onSuccess: (data, variables) => {
      // Show success message
      toast.success(`${variables.files.length} images uploaded successfully`);

      // Cache the upload results
      if (data.data) {
        data.data.forEach((upload) => {
          queryUtils.setQueryData(QUERY_KEYS.UPLOAD.IMAGE(upload.key), {
            data: upload,
          });
        });
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || "Failed to upload images";
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Confirm uploads mutation
export const useConfirmUploads = (
  options?: UseMutationOptions<UploadConfirmResponse, Error, string[]>,
) => {
  return useMutation({
    mutationFn: (keys: string[]) => uploadService.confirmUploads(keys),
    onSuccess: (data, variables) => {
      console.log(`Confirmed ${variables.length} uploads successfully`);
      // Note: Not showing toast for confirm as it happens automatically after form submission
    },
    onError: (error) => {
      // Show error message for confirm failures as they're critical
      const errorMessage = error.message || "Failed to confirm uploads";
      toast.error(errorMessage);
      console.error("Upload confirmation failed:", error);
    },
    ...options,
  });
};

// Delete temporary upload mutation
export const useDeleteTemporaryUpload = (
  options?: UseMutationOptions<DeleteTemporaryUploadResponse, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (key: string) => uploadService.deleteTemporaryUpload(key),
    onSuccess: (data, variables) => {
      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.UPLOAD.IMAGE(variables));

      console.log("Temporary upload deleted successfully");
      // Note: Usually silent operation, no toast needed
    },
    onError: (error) => {
      // Log error but don't show toast as delete is usually a cleanup operation
      console.error("Failed to delete temporary upload:", error);
    },
    ...options,
  });
};
