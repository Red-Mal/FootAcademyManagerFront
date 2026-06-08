import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatFullName } from '@/shared/lib/format'
import type { CoachSummary, TeamResponse } from '@/shared/types/domain'

interface TeamCardProps {
  team: TeamResponse
  coach?: CoachSummary
}

export function TeamCard({ team, coach }: TeamCardProps) {
  return (
    <Link to={`/teams/${team.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
        <CardContent className="flex items-center gap-4 p-4 sm:flex-col sm:text-center">
          {coach ? (
            <PersonAvatar
              firstName={coach.firstName}
              lastName={coach.lastName}
              photoUrl={coach.photoUrl}
              size="md"
              className="h-14 w-14 sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground sm:h-20 sm:w-20">
              <Users className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1 sm:flex-initial">
            <p className="truncate font-medium">{team.name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:justify-center">
              <CategoryBadge category={team.category} variant="subtle" />
              {coach && (
                <Badge variant="outline">{formatFullName(coach.firstName, coach.lastName)}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
