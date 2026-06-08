import type { SessionListFilters, SessionRangeFilters } from './sessions.api'

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: SessionListFilters) => [...sessionKeys.lists(), filters] as const,
  byTeam: (teamId: string, range: SessionRangeFilters) =>
    [...sessionKeys.all, 'byTeam', teamId, range] as const,
  mine: (range: SessionRangeFilters) => [...sessionKeys.all, 'mine', range] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
}
