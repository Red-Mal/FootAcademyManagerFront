import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { navItemsForRole } from '@/shared/components/layout/nav-items'
import { useAuthStore } from '@/features/auth/auth.store'

export function MobileNav() {
  const { t } = useTranslation()
  const role = useAuthStore((state) => state.user?.role)
  const items = navItemsForRole(role)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-card">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="truncate">{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
