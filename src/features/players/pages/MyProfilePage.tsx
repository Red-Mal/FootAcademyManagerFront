import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { useMyPlayerProfile } from '../api/players.queries'
import { PlayerDetailsCard } from '../components/PlayerDetailsCard'

export function MyProfilePage() {
  const { t } = useTranslation()
  const { data: player, isLoading } = useMyPlayerProfile()

  if (isLoading || !player) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">{t('players.myProfile')}</h1>

      {!player.teamId && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{t('players.me.noTeam')}</AlertDescription>
        </Alert>
      )}

      <PlayerDetailsCard player={player} />
    </div>
  )
}
