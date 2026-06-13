import { useTranslation } from 'react-i18next'
import { Award, CalendarDays, ShieldCheck, Users } from 'lucide-react'
import { StatCard } from './StatCard'
import { useTeamsList } from '@/features/teams/api/teams.queries'
import { usePlayersList } from '@/features/players/api/players.queries'
import { useCoachesList } from '@/features/coaches/api/coaches.queries'
import { useSessionsList } from '@/features/sessions/api/sessions.queries'
import type { Role } from '@/shared/types/domain'
import type { SessionRangeFilters } from '@/features/sessions/api/sessions.api'

interface DashboardStatsProps {
  role: Role
  upcomingRange: SessionRangeFilters
}

export function DashboardStats({ role, upcomingRange }: DashboardStatsProps) {
  const { t } = useTranslation()

  const { data: teams, isLoading: teamsLoading } = useTeamsList({ size: 1 })
  const { data: players, isLoading: playersLoading } = usePlayersList({ size: 1 })
  const { data: coaches, isLoading: coachesLoading } = useCoachesList(
    { size: 1 },
    { enabled: role === 'ADMIN' },
  )
  const { data: sessions, isLoading: sessionsLoading } = useSessionsList({
    ...upcomingRange,
    size: 5,
  })

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        icon={ShieldCheck}
        label={t('pages.dashboard.stats.teams')}
        value={teams?.totalElements}
        isLoading={teamsLoading}
      />
      <StatCard
        icon={Users}
        label={t('pages.dashboard.stats.players')}
        value={players?.totalElements}
        isLoading={playersLoading}
      />
      {role === 'ADMIN' && (
        <StatCard
          icon={Award}
          label={t('pages.dashboard.stats.coaches')}
          value={coaches?.totalElements}
          isLoading={coachesLoading}
        />
      )}
      <StatCard
        icon={CalendarDays}
        label={t('pages.dashboard.stats.upcomingSessions')}
        value={sessions?.totalElements}
        isLoading={sessionsLoading}
      />
    </div>
  )
}
