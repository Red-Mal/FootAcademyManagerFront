import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { TeamCard } from './TeamCard'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { getErrorMessage } from '@/shared/i18n/error-messages'
import { useCoachesList } from '@/features/coaches/api/coaches.queries'
import type { CoachResponse, TeamResponse } from '@/shared/types/domain'

interface TeamListProps {
  teams: TeamResponse[]
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry: () => void
}

export function TeamList({ teams, isLoading, isError, error, onRetry }: TeamListProps) {
  const { t } = useTranslation()
  const { data: coachesPage } = useCoachesList({ size: 100 })

  const coachById = useMemo(() => {
    const map = new Map<string, CoachResponse>()
    for (const coach of coachesPage?.content ?? []) map.set(coach.id, coach)
    return map
  }, [coachesPage])

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-8 w-8 text-destructive" />}
        title={getErrorMessage(error)}
        action={
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t('common.retry')}
          </Button>
        }
      />
    )
  }

  if (teams.length === 0) {
    return <EmptyState title={t('teams.empty.title')} description={t('teams.empty.description')} />
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} coach={coachById.get(team.coachId)} />
      ))}
    </div>
  )
}
