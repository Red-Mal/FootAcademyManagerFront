import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addHours, addMinutes } from 'date-fns'
import { useCreateSession } from '../api/sessions.mutations'
import { SessionForm } from '../components/SessionForm'
import type { SessionFormValues } from '../schemas/session.schema'

const QUARTER_HOUR_MS = 15 * 60_000
const DEFAULT_DURATION_MINUTES = 90

function roundUpToQuarterHour(date: Date): Date {
  return new Date(Math.ceil(date.getTime() / QUARTER_HOUR_MS) * QUARTER_HOUR_MS)
}

export function SessionCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const createSession = useCreateSession()

  const teamIdParam = searchParams.get('teamId') ?? ''
  const startParam = searchParams.get('start')

  const defaultStart = useMemo(() => {
    if (startParam) {
      const parsed = new Date(startParam)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    return roundUpToQuarterHour(addHours(new Date(), 1))
  }, [startParam])

  const defaultValues: SessionFormValues = {
    teamId: teamIdParam,
    startDateTime: defaultStart,
    endDateTime: addMinutes(defaultStart, DEFAULT_DURATION_MINUTES),
    location: '',
    notes: null,
  }

  async function handleSubmit(values: SessionFormValues) {
    const session = await createSession.mutateAsync({
      teamId: values.teamId,
      startDateTime: values.startDateTime.toISOString(),
      endDateTime: values.endDateTime.toISOString(),
      location: values.location,
      notes: values.notes,
    })
    navigate(`/sessions/${session.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('sessions.form.createTitle')}</h1>
      <SessionForm
        mode="create"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel={t('sessions.form.submitCreate')}
        isPending={createSession.isPending}
      />
    </div>
  )
}
