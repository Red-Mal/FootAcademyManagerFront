import { useSearchParams } from 'react-router-dom'

export type SessionView = 'list' | 'calendar'

export interface SessionUrlFilters {
  teamId?: string
  from?: string
  to?: string
  page: number
  size: number
}

export function useSessionUrlFilters() {
  const [params, setParams] = useSearchParams()

  const view: SessionView = params.get('view') === 'calendar' ? 'calendar' : 'list'

  return {
    view,
    filters: {
      teamId: params.get('teamId') ?? undefined,
      from: params.get('from') ?? undefined,
      to: params.get('to') ?? undefined,
      page: Number(params.get('page') ?? 0),
      size: Number(params.get('size') ?? 20),
    } satisfies SessionUrlFilters,
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
    setView(nextView: SessionView) {
      const next = new URLSearchParams(params)
      if (nextView === 'list') next.delete('view')
      else next.set('view', nextView)
      next.delete('page')
      setParams(next)
    },
  }
}

// Convertit une borne de date (yyyy-MM-dd, choisie via <input type="date">) en
// Instant ISO pour l'API : on laisse Date/toISOString gérer la conversion vers
// l'UTC plutôt que de manipuler des offsets à la main.
export function toRangeInstant(
  date: string | undefined,
  boundary: 'start' | 'end',
): string | undefined {
  if (!date) return undefined
  const time = boundary === 'end' ? '23:59:59.999' : '00:00:00.000'
  return new Date(`${date}T${time}`).toISOString()
}
