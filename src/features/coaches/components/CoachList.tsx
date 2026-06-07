import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { CoachCard } from './CoachCard'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { getErrorMessage } from '@/shared/i18n/error-messages'
import type { CoachResponse } from '@/shared/types/domain'

interface CoachListProps {
  coaches: CoachResponse[]
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry: () => void
}

export function CoachList({ coaches, isLoading, isError, error, onRetry }: CoachListProps) {
  const { t } = useTranslation()

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

  if (coaches.length === 0) {
    return (
      <EmptyState title={t('coaches.empty.title')} description={t('coaches.empty.description')} />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {coaches.map((coach) => (
        <CoachCard key={coach.id} coach={coach} />
      ))}
    </div>
  )
}
