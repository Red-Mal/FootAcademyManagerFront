import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCreatePlayer } from '../api/players.mutations'
import { PlayerForm } from '../components/PlayerForm'
import type { PlayerFormValues } from '../schemas/player.schema'

export function PlayerCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createPlayer = useCreatePlayer()

  async function handleSubmit(values: PlayerFormValues) {
    const player = await createPlayer.mutateAsync(values)
    navigate(`/players/${player.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('players.form.createTitle')}</h1>
      <PlayerForm
        onSubmit={handleSubmit}
        submitLabel={t('players.form.submitCreate')}
        isPending={createPlayer.isPending}
      />
    </div>
  )
}
