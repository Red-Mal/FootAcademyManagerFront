import { apiClient } from '@/shared/api/client'
import type { PageResponse, PlayerResponse } from '@/shared/types/domain'

export interface PlayerListFilters {
  category?: string
  teamId?: string
  search?: string
  page?: number
  size?: number
}

export interface CreatePlayerPayload {
  firstName: string
  lastName: string
  category: string
  heightCm: number | null
  weightKg: number | null
}

export type UpdatePlayerPayload = CreatePlayerPayload

export const playersApi = {
  list: async (filters: PlayerListFilters) => {
    const { data } = await apiClient.get<PageResponse<PlayerResponse>>('/players', {
      params: filters,
    })
    return data
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<PlayerResponse>(`/players/${id}`)
    return data
  },

  getMe: async () => {
    const { data } = await apiClient.get<PlayerResponse>('/players/me')
    return data
  },

  create: async (payload: CreatePlayerPayload) => {
    const { data } = await apiClient.post<PlayerResponse>('/players', payload)
    return data
  },

  update: async (id: string, payload: UpdatePlayerPayload) => {
    const { data } = await apiClient.put<PlayerResponse>(`/players/${id}`, payload)
    return data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/players/${id}`)
  },

  uploadPhoto: async (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post<PlayerResponse>(`/players/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
