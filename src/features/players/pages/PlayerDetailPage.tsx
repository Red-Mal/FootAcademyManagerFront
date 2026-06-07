import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { isApiError } from '@/shared/api/error'
import { usePlayer } from '../api/players.queries'
import { PlayerDetailsCard } from '../components/PlayerDetailsCard'
import { PlayerPhotoUpload } from '../components/PlayerPhotoUpload'
import { PlayerDeleteDialog } from '../components/PlayerDeleteDialog'

export function PlayerDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: currentUser } = useCurrentUser()
  const { data: player, isLoading, error } = usePlayer(id)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const isAdmin = currentUser?.role === 'ADMIN'

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!player) {
    const notFound = isApiError(error) && error.status === 404
    return (
      <EmptyState
        title={notFound ? t('players.detail.notFound') : t('errors.generic')}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/players')}>
            <ArrowLeft className="h-4 w-4" />
            {t('players.detail.backToList')}
          </Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/players">
          <ArrowLeft className="h-4 w-4" />
          {t('players.detail.backToList')}
        </Link>
      </Button>

      <PlayerDetailsCard
        player={player}
        photoSlot={
          isAdmin ? (
            <PlayerPhotoUpload
              playerId={player.id}
              firstName={player.firstName}
              lastName={player.lastName}
              photoUrl={player.photoUrl}
            />
          ) : undefined
        }
      />

      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/players/${player.id}/edit`}>
              <Pencil className="h-4 w-4" />
              {t('common.edit')}
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            {t('common.delete')}
          </Button>
        </div>
      )}

      <PlayerDeleteDialog playerId={player.id} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
