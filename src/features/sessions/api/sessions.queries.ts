import { useQuery } from '@tanstack/react-query'
import {
  sessionsApi,
  type SessionListFilters,
  type SessionRangeFilters,
} from './sessions.api'
import { sessionKeys } from './sessions.keys'

export function useSessionsList(filters: SessionListFilters) {
  return useQuery({
    queryKey: sessionKeys.list(filters),
    queryFn: () => sessionsApi.list(filters),
    placeholderData: (prev) => prev, // évite le flash blanc en pagination/filtres
  })
}

export function useTeamSessions(teamId: string | undefined, range: SessionRangeFilters) {
  return useQuery({
    queryKey: sessionKeys.byTeam(teamId ?? '', range),
    queryFn: () => sessionsApi.listByTeam(teamId!, range),
    enabled: !!teamId,
    placeholderData: (prev) => prev,
  })
}

export function useMySessions(range: SessionRangeFilters) {
  return useQuery({
    queryKey: sessionKeys.mine(range),
    queryFn: () => sessionsApi.listMine(range),
    placeholderData: (prev) => prev,
  })
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.detail(id ?? ''),
    queryFn: () => sessionsApi.getById(id!),
    enabled: !!id,
  })
}