import { useQuery } from '@tanstack/react-query'
import { coachesApi, type CoachListFilters } from './coaches.api'
import { coachKeys } from './coaches.keys'

export function useCoachesList(filters: CoachListFilters) {
  return useQuery({
    queryKey: coachKeys.list(filters),
    queryFn: () => coachesApi.list(filters),
    placeholderData: (prev) => prev, // évite le flash blanc en pagination/filtres
  })
}

export function useCoach(id: string | undefined) {
  return useQuery({
    queryKey: coachKeys.detail(id ?? ''),
    queryFn: () => coachesApi.getById(id!),
    enabled: !!id,
  })
}
