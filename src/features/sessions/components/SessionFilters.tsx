import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { formatCategory } from '@/shared/lib/format'
import { useTeamsList } from '@/features/teams/api/teams.queries'
import type { SessionUrlFilters } from '../hooks/useSessionUrlFilters'

const ALL_VALUE = 'all'

interface SessionFiltersProps {
  filters: SessionUrlFilters
  onFilterChange: (key: string, value: string | undefined) => void
}

export function SessionFilters({ filters, onFilterChange }: SessionFiltersProps) {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { data: teamsPage } = useTeamsList({ size: 100 })

  const eligibleTeams = useMemo(() => {
    const allTeams = teamsPage?.content ?? []
    return currentUser?.role === 'COACH'
      ? allTeams.filter((candidate) => candidate.coachId === currentUser.profile?.id)
      : allTeams
  }, [teamsPage, currentUser])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select
        value={filters.teamId ?? ALL_VALUE}
        onValueChange={(value) => onFilterChange('teamId', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger className="sm:w-56" aria-label={t('sessions.fields.team')}>
          <SelectValue placeholder={t('sessions.fields.team')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('sessions.filters.allTeams')}</SelectItem>
          {eligibleTeams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name} · {formatCategory(team.category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.from ?? ''}
        onChange={(event) => onFilterChange('from', event.target.value || undefined)}
        aria-label={t('sessions.filters.from')}
        className="sm:w-44"
      />
      <Input
        type="date"
        value={filters.to ?? ''}
        onChange={(event) => onFilterChange('to', event.target.value || undefined)}
        aria-label={t('sessions.filters.to')}
        className="sm:w-44"
      />
    </div>
  )
}
