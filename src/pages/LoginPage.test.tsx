import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { LoginPage } from '@/pages/LoginPage'
import { useAuthStore } from '@/features/auth/auth.store'
import { apiClient } from '@/shared/api/client'
import { ApiError } from '@/shared/api/error'

vi.mock('@/shared/api/client', () => ({
  apiClient: { post: vi.fn() },
}))

const mockedPost = vi.mocked(apiClient.post)

afterEach(() => {
  useAuthStore.getState().clearSession()
  vi.clearAllMocks()
})

describe('LoginPage', () => {
  it('renders the username and password fields', () => {
    renderWithProviders(<LoginPage />, { route: '/login' })

    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(mockedPost).not.toHaveBeenCalled()
    })
  })

  it('stores the session and redirects after a successful login', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresInSeconds: 3600,
        user: { userId: 'u1', username: 'admin', role: 'ADMIN', profile: null },
      },
    })

    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'admin')
    await user.type(screen.getByLabelText(/mot de passe/i), 'admin')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().tokens?.accessToken).toBe('access-token')
    })
    expect(useAuthStore.getState().user?.username).toBe('admin')
  })

  it('displays an error message when the credentials are rejected', async () => {
    mockedPost.mockRejectedValueOnce(
      new ApiError('Identifiants invalides', { status: 401, code: 'BAD_CREDENTIALS' }),
    )

    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: '/login' })

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'admin')
    await user.type(screen.getByLabelText(/mot de passe/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    expect(await screen.findByText(/identifiants invalides/i)).toBeInTheDocument()
    expect(useAuthStore.getState().tokens).toBeNull()
  })
})
