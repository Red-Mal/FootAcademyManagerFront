import { afterEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute'
import { useAuthStore } from '@/features/auth/auth.store'

function TestRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<div>Page de connexion</div>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<div>Contenu protégé</div>} />
      </Route>
    </Routes>
  )
}

afterEach(() => {
  useAuthStore.getState().clearSession()
})

describe('ProtectedRoute', () => {
  it('redirects to /login when the user is not authenticated', () => {
    renderWithProviders(<TestRoutes />, { route: '/' })

    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
  })

  it('renders the nested route when the user is authenticated', () => {
    useAuthStore
      .getState()
      .setSession(
        { accessToken: 'access-token', refreshToken: 'refresh-token' },
        { userId: 'u1', username: 'admin', role: 'ADMIN', profile: null },
      )

    renderWithProviders(<TestRoutes />, { route: '/' })

    expect(screen.getByText('Contenu protégé')).toBeInTheDocument()
    expect(screen.queryByText('Page de connexion')).not.toBeInTheDocument()
  })
})
