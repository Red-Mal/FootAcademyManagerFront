import { useQuery } from '@tanstack/react-query'
import { playersApi, type PlayerListFilters } from './players.api'
import { playerKeys } from './players.keys'

export function usePlayersList(filters: PlayerListFilters) {
  return useQuery({
    queryKey: playerKeys.list(filters),
    queryFn: () => playersApi.list(filters),
    placeholderData: (prev) => prev, // évite le flash blanc en pagination/filtres
  })
}

export function usePlayer(id: string | undefined) {
  return useQuery({
    queryKey: playerKeys.detail(id ?? ''),
    queryFn: () => playersApi.getById(id!),
    enabled: !!id,
  })
}

export function useMyPlayerProfile() {
  return useQuery({
    queryKey: playerKeys.me(),
    queryFn: () => playersApi.getMe(),
  })
}
