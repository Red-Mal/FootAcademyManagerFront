import type { CoachListFilters } from './coaches.api'

export const coachKeys = {
  all: ['coaches'] as const,
  lists: () => [...coachKeys.all, 'list'] as const,
  list: (filters: CoachListFilters) => [...coachKeys.lists(), filters] as const,
  details: () => [...coachKeys.all, 'detail'] as const,
  detail: (id: string) => [...coachKeys.details(), id] as const,
}
