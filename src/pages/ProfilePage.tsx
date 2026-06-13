import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { formatFullName } from '@/shared/lib/format'
import type { CoachSummary, PlayerSummary } from '@/shared/types/domain'

function isPlayerProfile(profile: CoachSummary | PlayerSummary): profile is PlayerSummary {
  return 'category' in profile
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const { profile } = user

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">{t('profile.title')}</h1>

      <Card>
        <CardHeader className="items-center text-center">
          <PersonAvatar
            firstName={profile ? profile.firstName : user.username}
            lastName={profile ? profile.lastName : ''}
            photoUrl={profile?.photoUrl}
            size="lg"
          />
          <h2 className="text-xl font-semibold">
            {profile ? formatFullName(profile.firstName, profile.lastName) : user.username}
          </h2>
          <Badge>{t(`profile.roles.${user.role}`)}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="text-sm font-medium text-muted-foreground">{t('profile.username')}</h3>
            <p className="text-sm">{user.username}</p>
          </section>

          {profile && isPlayerProfile(profile) && (
            <section>
              <h3 className="text-sm font-medium text-muted-foreground">{t('players.fields.category')}</h3>
              <CategoryBadge category={profile.category} />
            </section>
          )}

          {user.role === 'PLAYER' && (
            <Link to="/me" className="text-sm font-medium text-primary hover:underline">
              {t('profile.viewFullProfile')}
            </Link>
          )}

          {user.role === 'COACH' && profile && (
            <Link to={`/coaches/${profile.id}`} className="text-sm font-medium text-primary hover:underline">
              {t('profile.viewFullProfile')}
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
