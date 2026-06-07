import { afterEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { RoleRoute } from '@/shared/routes/RoleRoute'
import { useAuthStore } from '@/features/auth/auth.store'

function TestRoutes() {
  return (
    <Routes>
      <Route path="/forbidden" element={<div>Accès refusé</div>} />
      <Route element={<RoleRoute roles={['ADMIN']} />}>
        <Route path="/" element={<div>Contenu réservé aux admins</div>} />
      </Route>
    </Routes>
  )
}

afterEach(() => {
  useAuthStore.getState().clearSession()
})

describe('RoleRoute', () => {
  it('redirects to /forbidden when the user role is not allowed', () => {
    useAuthStore
      .getState()
      .setSession(
        { accessToken: 'access-token', refreshToken: 'refresh-token' },
        { userId: 'u1', username: 'coach', role: 'COACH', profile: null },
      )

    renderWithProviders(<TestRoutes />, { route: '/' })

    expect(screen.getByText('Accès refusé')).toBeInTheDocument()
    expect(screen.queryByText('Contenu réservé aux admins')).not.toBeInTheDocument()
  })

  it('renders the nested route when the user role is allowed', () => {
    useAuthStore
      .getState()
      .setSession(
        { accessToken: 'access-token', refreshToken: 'refresh-token' },
        { userId: 'u1', username: 'admin', role: 'ADMIN', profile: null },
      )

    renderWithProviders(<TestRoutes />, { route: '/' })

    expect(screen.getByText('Contenu réservé aux admins')).toBeInTheDocument()
    expect(screen.queryByText('Accès refusé')).not.toBeInTheDocument()
  })
})
