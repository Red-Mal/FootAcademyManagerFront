import { useSearchParams } from 'react-router-dom'
import type { PlayerListFilters } from '../api/players.api'

export function usePlayerUrlFilters() {
  const [params, setParams] = useSearchParams()

  return {
    filters: {
      search: params.get('search') ?? undefined,
      category: params.get('category') ?? undefined,
      teamId: params.get('teamId') ?? undefined,
      page: Number(params.get('page') ?? 0),
      size: Number(params.get('size') ?? 20),
    } satisfies PlayerListFilters,
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
