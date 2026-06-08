import { Link } from 'react-router-dom'
import { differenceInMinutes, parseISO } from 'date-fns'
import { Clock, MapPin, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { formatDateTime, formatTime } from '@/shared/lib/date'
import { formatDurationMinutes } from '@/shared/lib/format'
import type { SessionResponse, TeamResponse } from '@/shared/types/domain'

interface SessionListItemProps {
  session: SessionResponse
  team?: TeamResponse
}

export function SessionListItem({ session, team }: SessionListItemProps) {
  const start = parseISO(session.startDateTime)
  const end = parseISO(session.endDateTime)
  const duration = formatDurationMinutes(differenceInMinutes(end, start))

  return (
    <Link to={`/sessions/${session.id}`} className="block">
      <Card className="transition-colors hover:border-primary/50 hover:bg-accent/40">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="font-medium">
              {formatDateTime(start)} – {formatTime(end)}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {team && (
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  {team.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {session.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {duration}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
