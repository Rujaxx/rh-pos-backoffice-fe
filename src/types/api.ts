/**
 * Base API Response Types
 * Following SOLID principles for extensible and maintainable type definitions
 */

// Base response structure that all API responses extend
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

// Success response extends base response
export interface SuccessResponse<T = unknown> extends BaseResponse {
  success: true;
  data: T;
}

// Error response extends base response
export interface ErrorResponse extends BaseResponse {
  success: false;
  errorCode: string;
  validationErrors?: string[];
}

// Pagination metadata
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Paginated response extends success response
export interface PaginatedResponse<T = unknown> extends SuccessResponse<T[]> {
  meta: PaginationMeta;
}

// API Error class for consistent error handling
export class ApiError extends Error {
  constructor(
    public response: ErrorResponse,
    message?: string,
  ) {
    super(message || response.message);
    this.name = "ApiError";
  }
}

// Query parameters interface
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  fields?: string[];
  [key: string]: string | number | boolean | string[] | undefined;
}

// Mutation response wrapper
export type MutationResponse<T = unknown> = Promise<SuccessResponse<T>>;

// Query response wrapper
export type QueryResponse<T = unknown> = Promise<SuccessResponse<T>>;
