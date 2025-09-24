/**
 * Base API Service
 * Generic service class following single responsibility principle
 */

import api from '@/lib/axios'
import { SuccessResponse, PaginatedResponse, QueryParams, MutationResponse } from '@/types/api'

// Base CRUD operations interface
export interface CrudOperations<T, CreatePayload, UpdatePayload> {
  getAll: (params?: QueryParams) => Promise<PaginatedResponse<T>>
  getById: (id: string) => Promise<SuccessResponse<T>>
  create: (data: CreatePayload) => MutationResponse<T>
  update: (id: string, data: UpdatePayload) => MutationResponse<T>
  delete: (id: string) => MutationResponse<void>
}

// Base service class
export abstract class BaseApiService<T, CreatePayload = Partial<T>, UpdatePayload = Partial<T>> 
  implements CrudOperations<T, CreatePayload, UpdatePayload> {
  
  protected constructor(protected readonly baseEndpoint: string) {}

  // Get all items with pagination
  async getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    const url = searchParams.toString() 
      ? `${this.baseEndpoint}?${searchParams.toString()}`
      : this.baseEndpoint
      
    return api.get(url)
  }

  // Get single item by ID
  async getById(id: string): Promise<SuccessResponse<T>> {
    return api.get(`${this.baseEndpoint}/${id}`)
  }

  // Create new item
  async create(data: CreatePayload): MutationResponse<T> {
    return api.post(this.baseEndpoint, data)
  }

  // Update existing item
  async update(id: string, data: UpdatePayload): MutationResponse<T> {
    return api.patch(`${this.baseEndpoint}/${id}`, data)
  }

  // Delete item
  async delete(id: string): MutationResponse<void> {
    return api.delete(`${this.baseEndpoint}/${id}`)
  }

  // Bulk operations (optional)
  async bulkCreate(data: CreatePayload[]): MutationResponse<T[]> {
    return api.post(`${this.baseEndpoint}/bulk`, data)
  }

  async bulkUpdate(updates: Array<{ id: string; data: UpdatePayload }>): MutationResponse<T[]> {
    return api.patch(`${this.baseEndpoint}/bulk`, updates)
  }

  async bulkDelete(ids: string[]): MutationResponse<void> {
    return api.delete(`${this.baseEndpoint}/bulk`, { data: { ids } })
  }
}

// Utility functions for query parameters
export const buildQueryParams = (params: QueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  return searchParams
}

// Generic search function
export const searchEntities = async <T>(
  endpoint: string, 
  query: string, 
  params?: QueryParams
): Promise<PaginatedResponse<T>> => {
  const searchParams = buildQueryParams({ ...params, search: query })
  const url = `${endpoint}?${searchParams.toString()}`
  return api.get(url)
}