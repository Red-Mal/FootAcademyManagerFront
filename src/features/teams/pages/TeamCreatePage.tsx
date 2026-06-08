import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCreateTeam } from '../api/teams.mutations'
import { TeamForm } from '../components/TeamForm'
import type { TeamCreateValues } from '../schemas/team.schema'

export function TeamCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createTeam = useCreateTeam()

  async function handleSubmit(values: TeamCreateValues) {
    const team = await createTeam.mutateAsync(values)
    navigate(`/teams/${team.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('teams.form.createTitle')}</h1>
      <TeamForm
        onSubmit={handleSubmit}
        submitLabel={t('teams.form.submitCreate')}
        isPending={createTeam.isPending}
      />
    </div>
  )
}
