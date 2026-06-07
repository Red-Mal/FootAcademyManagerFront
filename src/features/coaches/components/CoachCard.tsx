import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatFullName } from '@/shared/lib/format'
import type { CoachResponse } from '@/shared/types/domain'

interface CoachCardProps {
  coach: CoachResponse
}

export function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link to={`/coaches/${coach.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
        <CardContent className="flex items-center gap-4 p-4 sm:flex-col sm:text-center">
          <PersonAvatar
            firstName={coach.firstName}
            lastName={coach.lastName}
            photoUrl={coach.photoUrl}
            size="md"
            className="h-14 w-14 sm:h-20 sm:w-20"
          />
          <div className="min-w-0 flex-1 sm:flex-initial">
            <p className="truncate font-medium">
              {formatFullName(coach.firstName, coach.lastName)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:justify-center">
              {coach.categories.map((category) => (
                <CategoryBadge key={category} category={category} variant="subtle" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
