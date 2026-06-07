import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/auth.store'
import type { Role } from '@/shared/types/domain'

interface RoleRouteProps {
  roles: Role[]
}

export function RoleRoute({ roles }: RoleRouteProps) {
  const role = useAuthStore((state) => state.user?.role)

  if (!role || !roles.includes(role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}
