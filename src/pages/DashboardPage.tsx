import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/features/auth/auth.store'

export function DashboardPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{t('pages.dashboard.title')}</h1>
      <p className="text-muted-foreground">
        {t('pages.dashboard.welcome', { name: user?.username ?? '' })}
      </p>
    </div>
  )
}
