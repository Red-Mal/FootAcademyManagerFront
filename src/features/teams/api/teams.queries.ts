import { useQuery } from '@tanstack/react-query'
import { teamsApi, type TeamListFilters } from './teams.api'
import { teamKeys } from './teams.keys'

export function useTeamsList(filters: TeamListFilters) {
  return useQuery({
    queryKey: teamKeys.list(filters),
    queryFn: () => teamsApi.list(filters),
    placeholderData: (prev) => prev, // évite le flash blanc en pagination/filtres
  })
}

export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: teamKeys.detail(id ?? ''),
    queryFn: () => teamsApi.getById(id!),
    enabled: !!id,
  })
}

export function useMyTeam() {
  return useQuery({
    queryKey: teamKeys.mine(),
    queryFn: () => teamsApi.getMine(),
  })
}
