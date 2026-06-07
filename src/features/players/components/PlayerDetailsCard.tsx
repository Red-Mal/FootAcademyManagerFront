import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatDateTime } from '@/shared/lib/date'
import { formatFullName } from '@/shared/lib/format'
import type { PlayerResponse } from '@/shared/types/domain'

interface PlayerDetailsCardProps {
  player: PlayerResponse
  photoSlot?: ReactNode
}

export function PlayerDetailsCard({ player, photoSlot }: PlayerDetailsCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="items-center text-center">
        {photoSlot ?? (
          <PersonAvatar
            firstName={player.firstName}
            lastName={player.lastName}
            photoUrl={player.photoUrl}
            size="lg"
          />
        )}
        <h1 className="text-xl font-semibold">{formatFullName(player.firstName, player.lastName)}</h1>
        <CategoryBadge category={player.category} />
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground">{t('players.fields.team')}</h2>
          {player.teamId ? (
            <Link to={`/teams/${player.teamId}`} className="text-sm font-medium text-primary hover:underline">
              {t('players.detail.viewTeam')}
            </Link>
          ) : (
            <p className="text-sm">{t('players.noTeam')}</p>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground">{t('players.detail.physicalInfo')}</h2>
          <dl className="mt-1 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">{t('players.detail.height')}</dt>
              <dd>{player.heightCm != null ? `${player.heightCm} cm` : t('players.detail.notProvided')}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('players.detail.weight')}</dt>
              <dd>{player.weightKg != null ? `${player.weightKg} kg` : t('players.detail.notProvided')}</dd>
            </div>
          </dl>
        </section>

        <section className="text-xs text-muted-foreground">
          <p>{t('players.detail.createdAt', { date: formatDateTime(player.createdAt) })}</p>
          <p>{t('players.detail.updatedAt', { date: formatDateTime(player.updatedAt) })}</p>
        </section>
      </CardContent>
    </Card>
  )
}
