import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatFullName } from '@/shared/lib/format'
import type { TeamDetailResponse } from '@/shared/types/domain'
import { TeamRosterSection } from './TeamRosterSection'
import { ChangeCoachDialog } from './ChangeCoachDialog'
import { TeamDeleteDialog } from './TeamDeleteDialog'

interface TeamDetailViewProps {
  team: TeamDetailResponse
  isAdmin: boolean
}

export function TeamDetailView({ team, isAdmin }: TeamDetailViewProps) {
  const { t } = useTranslation()
  const [changeCoachOpen, setChangeCoachOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="items-center text-center">
          <PersonAvatar
            firstName={team.coach.firstName}
            lastName={team.coach.lastName}
            photoUrl={team.coach.photoUrl}
            size="lg"
          />
          <h1 className="text-xl font-semibold">{team.name}</h1>
          <CategoryBadge category={team.category} />
        </CardHeader>
        <CardContent>
          <section>
            <h2 className="text-sm font-medium text-muted-foreground">{t('teams.fields.coach')}</h2>
            <div className="mt-1 flex items-center justify-between gap-2">
              <Link
                to={`/coaches/${team.coach.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {formatFullName(team.coach.firstName, team.coach.lastName)}
              </Link>
              {isAdmin && (
                <Button type="button" variant="outline" size="sm" onClick={() => setChangeCoachOpen(true)}>
                  {t('teams.changeCoach')}
                </Button>
              )}
            </div>
          </section>
        </CardContent>
      </Card>

      <TeamRosterSection team={team} isAdmin={isAdmin} />

      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/teams/${team.id}/edit`}>
              <Pencil className="h-4 w-4" />
              {t('common.edit')}
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            {t('common.delete')}
          </Button>
        </div>
      )}

      {isAdmin && (
        <>
          <ChangeCoachDialog
            teamId={team.id}
            category={team.category}
            currentCoachId={team.coachId}
            open={changeCoachOpen}
            onOpenChange={setChangeCoachOpen}
          />
          <TeamDeleteDialog
            teamId={team.id}
            playerCount={team.players.length}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </div>
  )
}
