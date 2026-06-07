import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { PlayerCard } from './PlayerCard'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { getErrorMessage } from '@/shared/i18n/error-messages'
import type { PlayerResponse } from '@/shared/types/domain'

interface PlayerListProps {
  players: PlayerResponse[]
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry: () => void
}

export function PlayerList({ players, isLoading, isError, error, onRetry }: PlayerListProps) {
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

  if (players.length === 0) {
    return (
      <EmptyState title={t('players.empty.title')} description={t('players.empty.description')} />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
