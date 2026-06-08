import { useSearchParams } from 'react-router-dom'
import type { TeamListFilters } from '../api/teams.api'

export function useTeamUrlFilters() {
  const [params, setParams] = useSearchParams()

  return {
    filters: {
      search: params.get('search') ?? undefined,
      category: params.get('category') ?? undefined,
      coachId: params.get('coachId') ?? undefined,
      page: Number(params.get('page') ?? 0),
      size: Number(params.get('size') ?? 20),
    } satisfies TeamListFilters,
    setFilter(key: string, value: string | undefined) {
      const next = new URLSearchParams(params)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page') // reset la page quand on change un filtre
      setParams(next)
    },
    setPage(page: number) {
      const next = new URLSearchParams(params)
      next.set('page', String(page))
      setParams(next)
    },
  }
}
