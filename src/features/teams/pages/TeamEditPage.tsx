import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useTeam } from '../api/teams.queries'
import { useUpdateTeam } from '../api/teams.mutations'
import { TeamUpdateForm } from '../components/TeamUpdateForm'
import type { TeamUpdateValues } from '../schemas/team.schema'

export function TeamEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: team, isLoading } = useTeam(id)
  const updateTeam = useUpdateTeam(id ?? '')

  async function handleSubmit(values: TeamUpdateValues) {
    await updateTeam.mutateAsync(values)
    navigate(`/teams/${id}`)
  }

  if (isLoading || !team) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('teams.form.editTitle')}</h1>
      <TeamUpdateForm
        defaultValues={{ name: team.name }}
        onSubmit={handleSubmit}
        submitLabel={t('teams.form.submitEdit')}
        isPending={updateTeam.isPending}
      />
    </div>
  )
}
