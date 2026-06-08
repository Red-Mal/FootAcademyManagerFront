import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, UserMinus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatFullName } from '@/shared/lib/format'
import type { TeamDetailResponse } from '@/shared/types/domain'
import { useRemovePlayerFromTeam } from '../api/teams.mutations'
import { AddPlayerDialog } from './AddPlayerDialog'

interface TeamRosterSectionProps {
  team: TeamDetailResponse
  isAdmin: boolean
}

export function TeamRosterSection({ team, isAdmin }: TeamRosterSectionProps) {
  const { t } = useTranslation()
  const [addOpen, setAddOpen] = useState(false)
  const removePlayer = useRemovePlayerFromTeam(team.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>{t('teams.roster')}</CardTitle>
        {isAdmin && (
          <Button type="button" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('teams.addPlayer')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {team.players.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('teams.rosterEmpty')}</p>
        ) : (
          <ul className="space-y-1">
            {team.players.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent/40"
              >
                <Link to={`/players/${player.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <PersonAvatar
                    firstName={player.firstName}
                    lastName={player.lastName}
                    photoUrl={player.photoUrl}
                    size="sm"
                  />
                  <span className="truncate text-sm font-medium">
                    {formatFullName(player.firstName, player.lastName)}
                  </span>
                </Link>
                {isAdmin && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlayer.mutate(player.id)}
                    disabled={removePlayer.isPending}
                  >
                    <UserMinus className="h-4 w-4" />
                    {t('teams.removePlayer')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {isAdmin && (
        <AddPlayerDialog
          teamId={team.id}
          category={team.category}
          open={addOpen}
          onOpenChange={setAddOpen}
        />
      )}
    </Card>
  )
}
