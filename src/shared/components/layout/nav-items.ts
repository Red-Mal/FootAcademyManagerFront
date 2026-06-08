import { CalendarDays, LayoutDashboard, ShieldCheck, User, Users, UsersRound } from 'lucide-react'
import type { Role } from '@/shared/types/domain'

export interface NavItem {
  to: string
  labelKey: string
  icon: typeof LayoutDashboard
  roles?: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/teams', labelKey: 'nav.teams', icon: ShieldCheck, roles: ['ADMIN', 'COACH'] },
  { to: '/players', labelKey: 'nav.players', icon: Users, roles: ['ADMIN', 'COACH'] },
  { to: '/coaches', labelKey: 'nav.coaches', icon: UsersRound, roles: ['ADMIN'] },
  { to: '/sessions', labelKey: 'nav.sessions', icon: CalendarDays, roles: ['ADMIN', 'COACH'] },
  { to: '/me/schedule', labelKey: 'nav.mySchedule', icon: CalendarDays, roles: ['PLAYER'] },
  { to: '/profile', labelKey: 'nav.profile', icon: User },
]

export function navItemsForRole(role: Role | undefined): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)))
}
