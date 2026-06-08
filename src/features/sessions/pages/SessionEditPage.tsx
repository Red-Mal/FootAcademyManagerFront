import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { parseISO } from 'date-fns'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useSession } from '../api/sessions.queries'
import { useUpdateSession } from '../api/sessions.mutations'
import { SessionForm } from '../components/SessionForm'
import type { SessionFormValues } from '../schemas/session.schema'

export function SessionEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: session, isLoading } = useSession(id)
  const updateSession = useUpdateSession(id ?? '')

  async function handleSubmit(values: SessionFormValues) {
    await updateSession.mutateAsync({
      startDateTime: values.startDateTime.toISOString(),
      endDateTime: values.endDateTime.toISOString(),
      location: values.location,
      notes: values.notes,
    })
    navigate(`/sessions/${id}`)
  }

  if (isLoading || !session) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const defaultValues: SessionFormValues = {
    teamId: session.teamId,
    startDateTime: parseISO(session.startDateTime),
    endDateTime: parseISO(session.endDateTime),
    location: session.location,
    notes: session.notes,
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('sessions.form.editTitle')}</h1>
      <SessionForm
        mode="edit"
        team={session.team}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel={t('sessions.form.submitEdit')}
        isPending={updateSession.isPending}
      />
    </div>
  )
}
