import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { usePlayer } from '../api/players.queries'
import { useUpdatePlayer } from '../api/players.mutations'
import { PlayerForm } from '../components/PlayerForm'
import type { PlayerFormValues } from '../schemas/player.schema'

export function PlayerEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: player, isLoading } = usePlayer(id)
  const updatePlayer = useUpdatePlayer(id ?? '')

  async function handleSubmit(values: PlayerFormValues) {
    await updatePlayer.mutateAsync(values)
    navigate(`/players/${id}`)
  }

  if (isLoading || !player) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('players.form.editTitle')}</h1>
      <PlayerForm
        defaultValues={{
          firstName: player.firstName,
          lastName: player.lastName,
          category: player.category,
          heightCm: player.heightCm,
          weightKg: player.weightKg,
        }}
        onSubmit={handleSubmit}
        submitLabel={t('players.form.submitEdit')}
        isPending={updatePlayer.isPending}
      />
    </div>
  )
}
