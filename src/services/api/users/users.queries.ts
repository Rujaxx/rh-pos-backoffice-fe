/**
 * User Service Queries
 * TanStack Query hooks for employee/user management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { UserFormData } from '@/lib/validations/user.validation';
import { User, UserQueryParams } from '@/types/user.type';

// User service extending base service for common CRUD
class UserService extends BaseApiService<User, UserFormData, UserFormData> {
  constructor() {
    super(API_ENDPOINTS.USERS.LIST);
  }

  // Get all users with optional filters
  async getAllUsers(
    params?: UserQueryParams,
  ): Promise<PaginatedResponse<User>> {
    return this.getAll(params);
  }

  // Get single user by ID
  async getUserById(id: string): Promise<SuccessResponse<User>> {
    return this.getById(id);
  }

  // Get active users only (for dropdowns, role assignments, etc.)
  async getActiveUsers(
    params?: Omit<UserQueryParams, 'isActive'>,
  ): Promise<PaginatedResponse<User>> {
    return this.getAll({ ...params, isActive: 'true' });
  }

  // Get users by restaurant ID (for restaurant-lev el staff)
  async getUsersByRestaurant(
    restaurantId: string,
    params?: Omit<UserQueryParams, 'restaurantId'>,
  ): Promise<PaginatedResponse<User>> {
    return this.getAll({ ...params, restaurantId });
  }

  // get Permissions
  //   async getPermissions(id: string): Promise<SuccessResponse<User>> {
  //     return this.getAll();
  //   }
}

// Create service instance
export const userService = new UserService();

// Get all users with pagination and filters
export const useUsers = (
  params?: UserQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<User>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(params),
    queryFn: () => userService.getAllUsers(params),
    ...options,
  });

// Get single user by ID
export const useUser = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<User>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    ...options,
  });

// Get active users (used for dropdowns, staff filters, etc.)
export const useActiveUsers = (
  params?: Omit<UserQueryParams, 'isActive'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<User>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: QUERY_KEYS.USERS.LIST({ ...params, isActive: 'true' }),
    queryFn: () => userService.getActiveUsers(params),
    ...options,
  });

// Get users by restaurant (for restaurant-specific staff lists)
export const useUsersByRestaurant = (
  restaurantId: string,
  params?: Omit<UserQueryParams, 'restaurantId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<User>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: QUERY_KEYS.USERS.LIST({ ...params, restaurantId }),
    queryFn: () => userService.getUsersByRestaurant(restaurantId, params),
    enabled: !!restaurantId,
    ...options,
  });
