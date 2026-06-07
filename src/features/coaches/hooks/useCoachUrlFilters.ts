import { useSearchParams } from 'react-router-dom'
import type { CoachListFilters } from '../api/coaches.api'

export function useCoachUrlFilters() {
  const [params, setParams] = useSearchParams()

  return {
    filters: {
      search: params.get('search') ?? undefined,
      category: params.get('category') ?? undefined,
      page: Number(params.get('page') ?? 0),
      size: Number(params.get('size') ?? 20),
    } satisfies CoachListFilters,
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
