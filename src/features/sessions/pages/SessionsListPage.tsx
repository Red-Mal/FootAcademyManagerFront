import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Pagination } from '@/shared/components/Pagination'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useTeamsList } from '@/features/teams/api/teams.queries'
import type { TeamResponse } from '@/shared/types/domain'
import { useSessionsList } from '../api/sessions.queries'
import type { SessionListFilters } from '../api/sessions.api'
import { useSessionUrlFilters, toRangeInstant } from '../hooks/useSessionUrlFilters'
import { SessionFilters } from '../components/SessionFilters'
import { SessionList } from '../components/SessionList'
import { SessionCalendar, type SessionCalendarRange } from '../components/SessionCalendar'

export function SessionsListPage() {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { view, filters, setFilter, setPage, setView } = useSessionUrlFilters()
  const [calendarRange, setCalendarRange] = useState<SessionCalendarRange | null>(null)

  const activeFilters: SessionListFilters =
    view === 'calendar'
      ? {
          teamId: filters.teamId,
          from: calendarRange?.start.toISOString(),
          to: calendarRange?.end.toISOString(),
          page: 0,
          size: 200,
        }
      : {
          teamId: filters.teamId,
          from: toRangeInstant(filters.from, 'start'),
          to: toRangeInstant(filters.to, 'end'),
          page: filters.page,
          size: filters.size,
        }

  const { data, isLoading, isError, error, refetch } = useSessionsList(activeFilters)

  const { data: teamsPage } = useTeamsList({ size: 100 })
  const teamById = useMemo(() => {
    const map = new Map<string, TeamResponse>()
    for (const team of teamsPage?.content ?? []) map.set(team.id, team)
    return map
  }, [teamsPage])

  const canCreate = currentUser?.role === 'ADMIN' || currentUser?.role === 'COACH'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t('sessions.title')}</h1>
        {canCreate && (
          <Button asChild>
            <Link to="/sessions/new">
              <Plus className="h-4 w-4" />
              {t('sessions.new')}
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SessionFilters filters={filters} onFilterChange={setFilter} />

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
        <>
          <SessionList
            sessions={data?.content ?? []}
            teamById={teamById}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => void refetch()}
          />
          {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
        </>
      ) : (
        <SessionCalendar sessions={data?.content ?? []} teamById={teamById} onRangeChange={setCalendarRange} />
      )}
    </div>
  )
}
