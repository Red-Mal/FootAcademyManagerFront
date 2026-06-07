import { apiClient } from '@/shared/api/client'
import type { CoachResponse, PageResponse } from '@/shared/types/domain'

export interface CoachListFilters {
  category?: string
  search?: string
  page?: number
  size?: number
}

export interface CreateCoachPayload {
  firstName: string
  lastName: string
  diploma: string | null
  categories: string[]
}

export interface UpdateCoachPayload {
  firstName: string
  lastName: string
  diploma: string | null
}

export interface UpdateCoachCategoriesPayload {
  categories: string[]
}

export const coachesApi = {
  list: async (filters: CoachListFilters) => {
    const { data } = await apiClient.get<PageResponse<CoachResponse>>('/coaches', {
      params: filters,
    })
    return data
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<CoachResponse>(`/coaches/${id}`)
    return data
  },

  create: async (payload: CreateCoachPayload) => {
    const { data } = await apiClient.post<CoachResponse>('/coaches', payload)
    return data
  },

  update: async (id: string, payload: UpdateCoachPayload) => {
    const { data } = await apiClient.put<CoachResponse>(`/coaches/${id}`, payload)
    return data
  },

  updateCategories: async (id: string, payload: UpdateCoachCategoriesPayload) => {
    const { data } = await apiClient.put<CoachResponse>(`/coaches/${id}/categories`, payload)
    return data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/coaches/${id}`)
  },

  uploadPhoto: async (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post<CoachResponse>(`/coaches/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
