import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { renderWithProviders } from '@/test/utils'
import { ApiError } from '@/shared/api/error'
import type { CoachResponse } from '@/shared/types/domain'
import { coachesApi } from '../api/coaches.api'
import { CoachCategoriesEditor } from './CoachCategoriesEditor'

vi.mock('../api/coaches.api', () => ({
  coachesApi: { updateCategories: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockedUpdateCategories = vi.mocked(coachesApi.updateCategories)

const UPDATED_COACH: CoachResponse = {
  id: 'c1',
  firstName: 'Zinedine',
  lastName: 'Zidane',
  diploma: null,
  photoUrl: null,
  categories: ['U12', 'U14'],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('CoachCategoriesEditor', () => {
  it('toggles categories in local state when checkboxes are clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CoachCategoriesEditor coachId="c1" categories={['U12']} />)

    const u12 = screen.getByRole('checkbox', { name: /u12/i })
    const u14 = screen.getByRole('checkbox', { name: /u14/i })
    expect(u12).toBeChecked()
    expect(u14).not.toBeChecked()

    await user.click(u14)
    expect(u14).toBeChecked()

    await user.click(u12)
    expect(u12).not.toBeChecked()
  })

  it('submits the selected categories via the dedicated mutation', async () => {
    mockedUpdateCategories.mockResolvedValueOnce(UPDATED_COACH)
    const user = userEvent.setup()
    renderWithProviders(<CoachCategoriesEditor coachId="c1" categories={['U12']} />)

    await user.click(screen.getByRole('checkbox', { name: /u14/i }))
    await user.click(screen.getByRole('button', { name: /enregistrer les catégories/i }))

    await waitFor(() => {
      expect(mockedUpdateCategories).toHaveBeenCalledWith('c1', { categories: ['U12', 'U14'] })
    })
  })

  it('shows the backend detail message when COACH_CATEGORY_IN_USE is returned', async () => {
    mockedUpdateCategories.mockRejectedValueOnce(
      new ApiError('Conflict', {
        status: 409,
        code: 'COACH_CATEGORY_IN_USE',
        problem: { detail: 'La catégorie U12 est utilisée par une équipe existante.' },
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<CoachCategoriesEditor coachId="c1" categories={['U12', 'U14']} />)

    await user.click(screen.getByRole('button', { name: /enregistrer les catégories/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('La catégorie U12 est utilisée par une équipe existante.')
    })
  })
})
