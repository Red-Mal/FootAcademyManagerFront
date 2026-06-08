import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { isApiError } from '@/shared/api/error'
import { getErrorMessage } from '@/shared/i18n/error-messages'
import { useTeamsList, useMyTeam } from '@/features/teams/api/teams.queries'
import type { SessionDetailResponse } from '@/shared/types/domain'
import { useMySessions, useSession } from '../api/sessions.queries'
import { SessionDetailCard } from '../components/SessionDetailCard'
import { SessionDeleteDialog } from '../components/SessionDeleteDialog'

const PLAYER_SCHEDULE_LOOKUP_SIZE = 100

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()

  if (isLoadingUser || !id) {
    return <DetailSkeleton />
  }

  return currentUser?.role === 'PLAYER' ? (
    <PlayerSessionDetail id={id} />
  ) : (
    <StaffSessionDetail id={id} />
  )
}

// L'API ne propose pas de lecture de séance unique pour un joueur (GET /sessions/:id est
// réservé à ADMIN/COACH) : on retrouve la séance dans son planning d'équipe et on
// reconstruit le détail à partir de /players/me/team.
function PlayerSessionDetail({ id }: { id: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: myTeam, isLoading: isLoadingTeam } = useMyTeam()
  const {
    data: sessionsPage,
    isLoading: isLoadingSessions,
    error,
  } = useMySessions({ size: PLAYER_SCHEDULE_LOOKUP_SIZE })

  const session = useMemo<SessionDetailResponse | undefined>(() => {
    if (!myTeam) return undefined
    const match = sessionsPage?.content.find((candidate) => candidate.id === id)
    if (!match) return undefined
    return { ...match, team: { id: myTeam.id, name: myTeam.name, category: myTeam.category } }
  }, [sessionsPage, myTeam, id])

  if (isLoadingTeam || isLoadingSessions) {
    return <DetailSkeleton />
  }

  if (!session) {
    return (
      <EmptyState
        title={isApiError(error) ? getErrorMessage(error) : t('sessions.detail.notFound')}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/me/schedule')}>
            <ArrowLeft className="h-4 w-4" />
            {t('sessions.detail.backToList')}
          </Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/me/schedule">
          <ArrowLeft className="h-4 w-4" />
          {t('sessions.detail.backToList')}
        </Link>
      </Button>

      <SessionDetailCard session={session} />
    </div>
  )
}

function StaffSessionDetail({ id }: { id: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()
  const { data: session, isLoading, error } = useSession(id)
  const { data: teamsPage } = useTeamsList({ size: 100 })
  const [deleteOpen, setDeleteOpen] = useState(false)

  const team = teamsPage?.content.find((candidate) => candidate.id === session?.team.id)
  const isAdmin = currentUser?.role === 'ADMIN'
  const isOwnerCoach = currentUser?.role === 'COACH' && team?.coachId === currentUser.profile?.id
  const canEdit = isAdmin || isOwnerCoach

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (!session) {
    const notFound = isApiError(error) && error.status === 404
    return (
      <EmptyState
        title={notFound ? t('sessions.detail.notFound') : getErrorMessage(error)}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/sessions')}>
            <ArrowLeft className="h-4 w-4" />
            {t('sessions.detail.backToList')}
          </Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/sessions">
            <ArrowLeft className="h-4 w-4" />
            {t('sessions.detail.backToList')}
          </Link>
        </Button>

        {(canEdit || isAdmin) && (
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/sessions/${session.id}/edit`}>{t('common.edit')}</Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                {t('common.delete')}
              </Button>
            )}
          </div>
        )}
      </div>

      <SessionDetailCard session={session} />

      {isAdmin && (
        <SessionDeleteDialog
          sessionId={session.id}
          teamId={session.teamId}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </div>
  )
}
