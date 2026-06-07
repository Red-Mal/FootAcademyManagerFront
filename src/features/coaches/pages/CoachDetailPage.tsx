import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { isApiError } from '@/shared/api/error'
import { useCoach } from '../api/coaches.queries'
import { CoachDetailsCard } from '../components/CoachDetailsCard'
import { CoachPhotoUpload } from '../components/CoachPhotoUpload'
import { CoachDeleteDialog } from '../components/CoachDeleteDialog'

export function CoachDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: currentUser } = useCurrentUser()
  const { data: coach, isLoading, error } = useCoach(id)
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

  if (!coach) {
    const notFound = isApiError(error) && error.status === 404
    return (
      <EmptyState
        title={notFound ? t('coaches.detail.notFound') : t('errors.generic')}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/coaches')}>
            <ArrowLeft className="h-4 w-4" />
            {t('coaches.detail.backToList')}
          </Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/coaches">
          <ArrowLeft className="h-4 w-4" />
          {t('coaches.detail.backToList')}
        </Link>
      </Button>

      <CoachDetailsCard
        coach={coach}
        photoSlot={
          isAdmin ? (
            <CoachPhotoUpload
              coachId={coach.id}
              firstName={coach.firstName}
              lastName={coach.lastName}
              photoUrl={coach.photoUrl}
            />
          ) : undefined
        }
      />

      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/coaches/${coach.id}/edit`}>
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

      <CoachDeleteDialog coachId={coach.id} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
