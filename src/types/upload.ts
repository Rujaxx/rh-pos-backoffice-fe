/**
 * Upload Types
 * TypeScript types for upload functionality based on backend DTOs
 */

export enum UploadFolderType {
  BRAND = 'brand',
  RESTAURANT = 'restaurant',
  USERS = 'users',
  MENU_ITEMS = 'menu-items',
  IMAGE_LIBRARY = 'image-library',
}

export interface UploadResponse {
  id: string;
  url: string;
  key: string;
  originalName: string;
  size: number;
  expiresAt: string;
  folderType: UploadFolderType;
}

export interface UploadOptions {
  folderType: UploadFolderType;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ConfirmUploadsRequest {
  ids: string[];
}

export interface UploadConfirmResponse {
  message: string;
}

export interface DeleteTemporaryUploadResponse {
  message: string;
}

export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_REQUEST: 10,
  SUPPORTED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
  ],
  DEFAULT_QUALITY: 80,
  DEFAULT_MAX_WIDTH: 1920,
  DEFAULT_MAX_HEIGHT: 1080,
} as const;
