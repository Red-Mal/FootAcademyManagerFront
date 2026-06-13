import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { parseISO } from 'date-fns'
import { useSessionsList, useMySessions } from '@/features/sessions/api/sessions.queries'
import { useTeamsList, useMyTeam } from '@/features/teams/api/teams.queries'
import { SessionList } from '@/features/sessions/components/SessionList'
import type { SessionRangeFilters } from '@/features/sessions/api/sessions.api'
import type { Role, TeamResponse } from '@/shared/types/domain'

interface UpcomingSessionsCardProps {
  role: Role
  range: SessionRangeFilters
}

export function UpcomingSessionsCard({ role, range }: UpcomingSessionsCardProps) {
  return role === 'PLAYER' ? <PlayerUpcomingSessions range={range} /> : <StaffUpcomingSessions range={range} />
}

function StaffUpcomingSessions({ range }: { range: SessionRangeFilters }) {
  const { data, isLoading, isError, error, refetch } = useSessionsList({ ...range, size: 5 })
  const { data: teamsPage } = useTeamsList({ size: 100 })

  const teamById = useMemo(() => {
    const map = new Map<string, TeamResponse>()
    for (const team of teamsPage?.content ?? []) map.set(team.id, team)
    return map
  }, [teamsPage])

  return (
    <UpcomingSessionsSection
      sessions={data?.content ?? []}
      teamById={teamById}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      viewAllPath="/sessions"
    />
  )
}

function PlayerUpcomingSessions({ range }: { range: SessionRangeFilters }) {
  const { data, isLoading, isError, error, refetch } = useMySessions({ ...range, size: 100 })
  const { data: myTeam } = useMyTeam()

  const teamById = useMemo(() => {
    const map = new Map<string, TeamResponse>()
    if (myTeam) map.set(myTeam.id, myTeam)
    return map
  }, [myTeam])

  // /players/me/sessions renvoie tout le planning de l'équipe (pas de filtre from/to côté API),
  // donc on applique la fenêtre "à venir" nous-mêmes.
  const sessions = useMemo(() => {
    const now = new Date()
    const horizon = range.to ? parseISO(range.to) : undefined
    return (data?.content ?? [])
      .filter((session) => {
        const start = parseISO(session.startDateTime)
        return start >= now && (!horizon || start <= horizon)
      })
      .slice(0, 5)
  }, [data, range.to])

  return (
    <UpcomingSessionsSection
      sessions={sessions}
      teamById={teamById}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      viewAllPath="/me/schedule"
    />
  )
}

interface UpcomingSessionsSectionProps {
  sessions: Parameters<typeof SessionList>[0]['sessions']
  teamById: Map<string, TeamResponse>
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry: () => void
  viewAllPath: string
}

function UpcomingSessionsSection({
  sessions,
  teamById,
  isLoading,
  isError,
  error,
  onRetry,
  viewAllPath,
}: UpcomingSessionsSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('pages.dashboard.upcomingSessions.title')}</h2>
        <Link to={viewAllPath} className="text-sm font-medium text-primary hover:underline">
          {t('pages.dashboard.upcomingSessions.viewAll')}
        </Link>
      </div>
      <SessionList
        sessions={sessions}
        teamById={teamById}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={onRetry}
      />
    </section>
  )
}