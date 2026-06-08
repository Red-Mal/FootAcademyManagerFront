import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { SessionListItem } from './SessionListItem'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { getErrorMessage } from '@/shared/i18n/error-messages'
import type { SessionResponse, TeamResponse } from '@/shared/types/domain'

interface SessionListProps {
  sessions: SessionResponse[]
  teamById: Map<string, TeamResponse>
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry: () => void
}

export function SessionList({ sessions, teamById, isLoading, isError, error, onRetry }: SessionListProps) {
  const { t } = useTranslation()

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
      ),
    [sessions],
  )

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

  if (sortedSessions.length === 0) {
    return (
      <EmptyState title={t('sessions.empty.title')} description={t('sessions.empty.description')} />
    )
  }

  return (
    <div className="space-y-3">
      {sortedSessions.map((session) => (
        <SessionListItem key={session.id} session={session} team={teamById.get(session.teamId)} />
      ))}
    </div>
  )
}
