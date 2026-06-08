import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { isApiError } from '@/shared/api/error'
import { useMyTeam, useTeam } from '../api/teams.queries'
import { TeamDetailView } from '../components/TeamDetailView'

export function MyTeamPage() {
  const { t } = useTranslation()
  const { data: myTeam, isLoading: isLoadingMyTeam, error } = useMyTeam()
  const { data: team, isLoading: isLoadingDetail } = useTeam(myTeam?.id)

  if (isLoadingMyTeam || (myTeam && isLoadingDetail)) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!myTeam || !team) {
    const notFound = isApiError(error) && error.status === 404
    return (
      <EmptyState
        title={t('teams.me.title')}
        description={notFound ? t('teams.me.noTeam') : t('errors.generic')}
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">{t('teams.me.title')}</h1>
      <TeamDetailView team={team} isAdmin={false} />
    </div>
  )
}
