import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useCoach } from '../api/coaches.queries'
import { useUpdateCoach } from '../api/coaches.mutations'
import { CoachForm } from '../components/CoachForm'
import { CoachCategoriesEditor } from '../components/CoachCategoriesEditor'
import type { CoachFormValues } from '../schemas/coach.schema'

export function CoachEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: coach, isLoading } = useCoach(id)
  const updateCoach = useUpdateCoach(id ?? '')

  async function handleSubmit(values: CoachFormValues) {
    await updateCoach.mutateAsync(values)
    navigate(`/coaches/${id}`)
  }

  if (isLoading || !coach) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('coaches.form.editTitle')}</h1>

      <CoachForm
        defaultValues={{
          firstName: coach.firstName,
          lastName: coach.lastName,
          diploma: coach.diploma,
        }}
        onSubmit={handleSubmit}
        submitLabel={t('coaches.form.submitEdit')}
        isPending={updateCoach.isPending}
      />

      <CoachCategoriesEditor coachId={coach.id} categories={coach.categories} />
    </div>
  )
}
