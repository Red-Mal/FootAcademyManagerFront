import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { navItemsForRole } from '@/shared/components/layout/nav-items'
import { useAuthStore } from '@/features/auth/auth.store'
import crnLogo from '@/assets/crn-logo.jpg'
import env from '@/env'

export function Sidebar() {
  const { t } = useTranslation()
  const role = useAuthStore((state) => state.user?.role)
  const items = navItemsForRole(role)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <img src={crnLogo} alt={env.APP_NAME} className="h-9 w-9 object-contain" />
        <span className="text-lg font-semibold">{env.APP_NAME}</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
