import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import type { CoachResponse, PageResponse } from '@/shared/types/domain'
import { coachesApi } from '@/features/coaches/api/coaches.api'
import { TeamForm } from './TeamForm'

vi.mock('@/features/coaches/api/coaches.api', () => ({
  coachesApi: { list: vi.fn() },
}))

const mockedList = vi.mocked(coachesApi.list)

function buildCoach(overrides: Partial<CoachResponse>): CoachResponse {
  return {
    id: 'c1',
    firstName: 'Zinedine',
    lastName: 'Zidane',
    diploma: null,
    photoUrl: null,
    categories: ['U12'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function coachesPage(content: CoachResponse[]): PageResponse<CoachResponse> {
  return { content, page: 0, size: 100, totalElements: content.length, totalPages: 1 }
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('TeamForm', () => {
  it('shows validation errors when submitting an empty form', async () => {
    mockedList.mockResolvedValue(coachesPage([]))
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<TeamForm onSubmit={onSubmit} submitLabel="Créer l'équipe" isPending={false} />)

    await user.clear(screen.getByLabelText(/^nom$/i))
    await user.click(screen.getByRole('button', { name: /créer l'équipe/i }))

    expect(await screen.findByText('Nom requis')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('only lists coaches whose categories include the currently selected category', async () => {
    mockedList.mockResolvedValue(
      coachesPage([
        buildCoach({ id: 'c1', firstName: 'Zinedine', lastName: 'Zidane', categories: ['U12'] }),
        buildCoach({ id: 'c2', firstName: 'Didier', lastName: 'Deschamps', categories: ['U16'] }),
      ]),
    )
    const user = userEvent.setup()
    renderWithProviders(<TeamForm onSubmit={vi.fn()} submitLabel="Créer l'équipe" isPending={false} />)

    await user.click(screen.getByLabelText(/^coach$/i))
    expect(await screen.findByRole('option', { name: /zidane/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /deschamps/i })).not.toBeInTheDocument()
  })

  it('resets the selected coach when the category changes and they are no longer eligible', async () => {
    mockedList.mockResolvedValue(
      coachesPage([
        buildCoach({ id: 'c1', firstName: 'Zinedine', lastName: 'Zidane', categories: ['U12'] }),
        buildCoach({ id: 'c2', firstName: 'Didier', lastName: 'Deschamps', categories: ['U16'] }),
      ]),
    )
    const user = userEvent.setup()
    renderWithProviders(<TeamForm onSubmit={vi.fn()} submitLabel="Créer l'équipe" isPending={false} />)

    await user.click(screen.getByLabelText(/^coach$/i))
    await user.click(await screen.findByRole('option', { name: /zidane/i }))
    expect(screen.getByLabelText(/^coach$/i)).toHaveTextContent('Zinedine Zidane')

    await user.click(screen.getByLabelText(/^catégorie$/i))
    await user.click(await screen.findByRole('option', { name: /u16/i }))

    expect(screen.getByLabelText(/^coach$/i)).not.toHaveTextContent('Zinedine Zidane')

    await user.click(screen.getByLabelText(/^coach$/i))
    expect(await screen.findByRole('option', { name: /deschamps/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /zidane/i })).not.toBeInTheDocument()
  })
})
