import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatFullName } from '@/shared/lib/format'
import type { PlayerResponse } from '@/shared/types/domain'

interface PlayerCardProps {
  player: PlayerResponse
}

export function PlayerCard({ player }: PlayerCardProps) {
  const { t } = useTranslation()

  return (
    <Link to={`/players/${player.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
        <CardContent className="flex items-center gap-4 p-4 sm:flex-col sm:text-center">
          <PersonAvatar
            firstName={player.firstName}
            lastName={player.lastName}
            photoUrl={player.photoUrl}
            size="md"
            className="h-14 w-14 sm:h-20 sm:w-20"
          />
          <div className="min-w-0 flex-1 sm:flex-initial">
            <p className="truncate font-medium">
              {formatFullName(player.firstName, player.lastName)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:justify-center">
              <CategoryBadge category={player.category} variant="subtle" />
              {player.teamId ? (
                <Badge variant="outline">{t('players.fields.team')}</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  {t('players.noTeam')}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
