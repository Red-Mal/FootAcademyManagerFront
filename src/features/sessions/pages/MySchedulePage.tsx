import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addDays, parseISO } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { useMyTeam } from '@/features/teams/api/teams.queries'
import type { TeamResponse } from '@/shared/types/domain'
import { useMySessions } from '../api/sessions.queries'
import type { SessionRangeFilters } from '../api/sessions.api'
import { useSessionUrlFilters } from '../hooks/useSessionUrlFilters'
import { SessionList } from '../components/SessionList'
import { SessionCalendar, type SessionCalendarRange } from '../components/SessionCalendar'

const DEFAULT_RANGE_DAYS = 30
const DEFAULT_PAGE_SIZE = 100

export function MySchedulePage() {
  const { t } = useTranslation()
  const { view, setView } = useSessionUrlFilters()
  const [calendarRange, setCalendarRange] = useState<SessionCalendarRange | null>(null)

  const defaultRange = useMemo(() => {
    const now = new Date()
    return { from: now.toISOString(), to: addDays(now, DEFAULT_RANGE_DAYS).toISOString() }
  }, [])

  const range: SessionRangeFilters =
    view === 'calendar' && calendarRange
      ? { from: calendarRange.start.toISOString(), to: calendarRange.end.toISOString(), size: 100 }
      : { ...defaultRange, size: DEFAULT_PAGE_SIZE }

  const { data, isLoading, isError, error, refetch } = useMySessions(range)

  const { data: myTeam } = useMyTeam()
  const teamById = useMemo(() => {
    const map = new Map<string, TeamResponse>()
    if (myTeam) map.set(myTeam.id, myTeam)
    return map
  }, [myTeam])

  // /players/me/sessions renvoie tout le planning de l'équipe (pas de filtre from/to côté API),
  // donc on applique la fenêtre "30 prochains jours" nous-mêmes pour la vue liste.
  const listSessions = useMemo(() => {
    const now = new Date()
    const horizon = addDays(now, DEFAULT_RANGE_DAYS)
    return (data?.content ?? []).filter((session) => {
      const start = parseISO(session.startDateTime)
      return start >= now && start <= horizon
    })
  }, [data])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t('sessions.mySchedule.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('sessions.mySchedule.description')}</p>
        </div>

        <div className="inline-flex w-fit rounded-md border p-1">
          <Button
            type="button"
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            {t('sessions.views.list')}
          </Button>
          <Button
            type="button"
            variant={view === 'calendar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            {t('sessions.views.calendar')}
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <SessionList
          sessions={listSessions}
          teamById={teamById}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
        />
      ) : (
        <SessionCalendar
          sessions={data?.content ?? []}
          teamById={teamById}
          onRangeChange={setCalendarRange}
          allowCreate={false}
        />
      )}
    </div>
  )
}
