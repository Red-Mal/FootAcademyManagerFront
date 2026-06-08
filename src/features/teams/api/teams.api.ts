import { apiClient } from '@/shared/api/client'
import type { PageResponse, TeamDetailResponse, TeamResponse } from '@/shared/types/domain'

export interface TeamListFilters {
  category?: string
  coachId?: string
  search?: string
  page?: number
  size?: number
}

export interface CreateTeamPayload {
  name: string
  category: string
  coachId: string
}

export interface UpdateTeamPayload {
  name: string
}

export interface ChangeCoachPayload {
  newCoachId: string
}

export const teamsApi = {
  list: async (filters: TeamListFilters) => {
    const { data } = await apiClient.get<PageResponse<TeamResponse>>('/teams', {
      params: filters,
    })
    return data
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<TeamDetailResponse>(`/teams/${id}`)
    return data
  },

  getMine: async () => {
    const { data } = await apiClient.get<TeamResponse>('/players/me/team')
    return data
  },

  create: async (payload: CreateTeamPayload) => {
    const { data } = await apiClient.post<TeamResponse>('/teams', payload)
    return data
  },

  update: async (id: string, payload: UpdateTeamPayload) => {
    const { data } = await apiClient.put<TeamResponse>(`/teams/${id}`, payload)
    return data
  },

  changeCoach: async (id: string, payload: ChangeCoachPayload) => {
    const { data } = await apiClient.put<TeamResponse>(`/teams/${id}/coach`, payload)
    return data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/teams/${id}`)
  },

  addPlayer: async (teamId: string, playerId: string) => {
    await apiClient.post(`/teams/${teamId}/players/${playerId}`)
  },

  removePlayer: async (teamId: string, playerId: string) => {
    await apiClient.delete(`/teams/${teamId}/players/${playerId}`)
  },
}
