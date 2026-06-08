import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { isApiError } from '@/shared/api/error'
import { useTeam } from '../api/teams.queries'
import { TeamDetailView } from '../components/TeamDetailView'

export function TeamDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: currentUser } = useCurrentUser()
  const { data: team, isLoading, error } = useTeam(id)

  const isAdmin = currentUser?.role === 'ADMIN'

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!team) {
    const notFound = isApiError(error) && error.status === 404
    return (
      <EmptyState
        title={notFound ? t('teams.detail.notFound') : t('errors.generic')}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/teams')}>
            <ArrowLeft className="h-4 w-4" />
            {t('teams.detail.backToList')}
          </Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/teams">
          <ArrowLeft className="h-4 w-4" />
          {t('teams.detail.backToList')}
        </Link>
      </Button>

      <TeamDetailView team={team} isAdmin={isAdmin} />
    </div>
  )
}
