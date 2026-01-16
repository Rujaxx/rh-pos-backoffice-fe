/**
 * Upload Service Queries
 * Upload service following existing API patterns
 */

import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import { SuccessResponse } from '@/types/api';
import {
  UploadResponse,
  UploadOptions,
  ConfirmUploadsRequest,
  UploadConfirmResponse,
  DeleteTemporaryUploadResponse,
} from '@/types/upload';

// Upload service class
class UploadService {
  private readonly baseEndpoint = API_ENDPOINTS.UPLOAD;

  /**
   * Upload a single image file
   */
  async uploadImage(
    file: File,
    options: UploadOptions,
  ): Promise<SuccessResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folderType', options.folderType);

    if (options.quality !== undefined) {
      formData.append('quality', options.quality.toString());
    }
    if (options.maxWidth !== undefined) {
      formData.append('maxWidth', options.maxWidth.toString());
    }
    if (options.maxHeight !== undefined) {
      formData.append('maxHeight', options.maxHeight.toString());
    }

    // Use axios instance with multipart/form-data
    return api.post(this.baseEndpoint.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Upload multiple image files
   */
  async uploadMultipleImages(
    files: File[],
    options: UploadOptions,
  ): Promise<SuccessResponse<UploadResponse[]>> {
    const formData = new FormData();

    // Append files
    files.forEach((file) => {
      formData.append('images', file);
    });

    // Append options
    formData.append('folderType', options.folderType);
    if (options.quality !== undefined) {
      formData.append('quality', options.quality.toString());
    }
    if (options.maxWidth !== undefined) {
      formData.append('maxWidth', options.maxWidth.toString());
    }
    if (options.maxHeight !== undefined) {
      formData.append('maxHeight', options.maxHeight.toString());
    }

    return api.post(this.baseEndpoint.IMAGES_MULTIPLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Confirm uploaded files to make them permanent
   */
  async confirmUploads(ids: string[]): Promise<UploadConfirmResponse> {
    const payload: ConfirmUploadsRequest = { ids };
    return api.post(this.baseEndpoint.CONFIRM, payload);
  }

  /**
   * Delete a temporary upload
   */
  async deleteTemporaryUpload(
    key: string,
  ): Promise<DeleteTemporaryUploadResponse> {
    return api.delete(
      `${this.baseEndpoint.DELETE_TEMPORARY}?key=${encodeURIComponent(key)}`,
    );
  }
}

// Create service instance
const uploadService = new UploadService();

// Export service for use in mutations
export { uploadService };
