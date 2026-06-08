import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { coachesApi } from '@/features/coaches/api/coaches.api'
import type { CoachResponse, PageResponse } from '@/shared/types/domain'
import { ChangeCoachDialog } from './ChangeCoachDialog'

vi.mock('@/features/coaches/api/coaches.api', () => ({
  coachesApi: { list: vi.fn() },
}))

vi.mock('../api/teams.api', () => ({
  teamsApi: { changeCoach: vi.fn() },
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

describe('ChangeCoachDialog', () => {
  it('only lists coaches eligible for the team category', async () => {
    mockedList.mockResolvedValue(
      coachesPage([
        buildCoach({ id: 'c1', firstName: 'Zinedine', lastName: 'Zidane', categories: ['U12'] }),
        buildCoach({ id: 'c2', firstName: 'Didier', lastName: 'Deschamps', categories: ['U16'] }),
        buildCoach({ id: 'c3', firstName: 'Laurent', lastName: 'Blanc', categories: ['U12', 'U16'] }),
      ]),
    )
    const user = userEvent.setup()
    renderWithProviders(
      <ChangeCoachDialog teamId="t1" category="U12" currentCoachId="c1" open onOpenChange={vi.fn()} />,
    )

    await user.click(await screen.findByLabelText(/^coach$/i))
    expect(await screen.findByRole('option', { name: /zidane/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /blanc/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /deschamps/i })).not.toBeInTheDocument()
  })

  it('shows a message instead of the form when no coach is eligible for the category', async () => {
    mockedList.mockResolvedValue(
      coachesPage([
        buildCoach({ id: 'c2', firstName: 'Didier', lastName: 'Deschamps', categories: ['U16'] }),
      ]),
    )
    renderWithProviders(
      <ChangeCoachDialog teamId="t1" category="U12" currentCoachId="c1" open onOpenChange={vi.fn()} />,
    )

    expect(
      await screen.findByText("Aucun coach n'est habilité pour la catégorie de cette équipe."),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/^coach$/i)).not.toBeInTheDocument()
  })
})
