import { apiClient } from '@/shared/api/client'
import type { PageResponse, SessionDetailResponse, SessionResponse } from '@/shared/types/domain'

export interface SessionListFilters {
  teamId?: string
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface SessionRangeFilters {
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface CreateSessionPayload {
  teamId: string
  startDateTime: string
  endDateTime: string
  location: string
  notes?: string | null
}

export interface UpdateSessionPayload {
  startDateTime: string
  endDateTime: string
  location: string
  notes?: string | null
}

export const sessionsApi = {
  list: async (filters: SessionListFilters) => {
    const { data } = await apiClient.get<PageResponse<SessionResponse>>('/sessions', {
      params: filters,
    })
    return data
  },

  listByTeam: async (teamId: string, filters: SessionRangeFilters) => {
    const { data } = await apiClient.get<PageResponse<SessionResponse>>(
      `/teams/${teamId}/sessions`,
      { params: filters },
    )
    return data
  },

  listMine: async (filters: SessionRangeFilters) => {
    const { data } = await apiClient.get<PageResponse<SessionResponse>>('/players/me/sessions', {
      params: filters,
    })
    return data
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<SessionDetailResponse>(`/sessions/${id}`)
    return data
  },

  create: async (payload: CreateSessionPayload) => {
    const { data } = await apiClient.post<SessionResponse>('/sessions', payload)
    return data
  },

  update: async (id: string, payload: UpdateSessionPayload) => {
    const { data } = await apiClient.put<SessionResponse>(`/sessions/${id}`, payload)
    return data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/sessions/${id}`)
  },
}