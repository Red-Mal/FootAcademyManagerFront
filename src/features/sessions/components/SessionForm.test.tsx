import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { teamsApi } from '@/features/teams/api/teams.api'
import type { PageResponse, TeamResponse } from '@/shared/types/domain'
import { SessionForm } from './SessionForm'
import type { SessionFormValues } from '../schemas/session.schema'

vi.mock('@/features/teams/api/teams.api', () => ({
  teamsApi: { list: vi.fn() },
}))

const mockedList = vi.mocked(teamsApi.list)

function teamsPage(content: TeamResponse[]): PageResponse<TeamResponse> {
  return { content, page: 0, size: 100, totalElements: content.length, totalPages: 1 }
}

const defaultValues: SessionFormValues = {
  teamId: 't1',
  startDateTime: new Date('2026-07-01T10:00:00'),
  endDateTime: new Date('2026-07-01T11:30:00'),
  location: 'Terrain principal',
  notes: null,
}

afterEach(() => {
  vi.clearAllMocks()
})

async function renderForm() {
  mockedList.mockResolvedValue(teamsPage([]))
  const user = userEvent.setup()
  renderWithProviders(
    <SessionForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={vi.fn()}
      submitLabel="Enregistrer"
      isPending={false}
    />,
  )

  const startInput = screen.getByLabelText(/^début$/i)
  const endInput = screen.getByLabelText(/^fin$/i)
  const submitButton = screen.getByRole('button', { name: /enregistrer/i })

  return { user, startInput, endInput, submitButton }
}

describe('SessionForm', () => {
  it('rejects an end date that is not after the start date', async () => {
    const { user, startInput, endInput, submitButton } = await renderForm()

    fireEvent.change(startInput, { target: { value: '2026-07-01T10:00' } })
    fireEvent.change(endInput, { target: { value: '2026-07-01T09:00' } })
    await user.click(submitButton)

    expect(
      await screen.findByText('La date de fin doit être postérieure à la date de début.'),
    ).toBeInTheDocument()
  })

  it('rejects a session shorter than 15 minutes', async () => {
    const { user, startInput, endInput, submitButton } = await renderForm()

    fireEvent.change(startInput, { target: { value: '2026-07-01T10:00' } })
    fireEvent.change(endInput, { target: { value: '2026-07-01T10:10' } })
    await user.click(submitButton)

    expect(await screen.findByText('Une séance doit durer au minimum 15 minutes.')).toBeInTheDocument()
  })

  it('rejects a session longer than 6 hours', async () => {
    const { user, startInput, endInput, submitButton } = await renderForm()

    fireEvent.change(startInput, { target: { value: '2026-07-01T08:00' } })
    fireEvent.change(endInput, { target: { value: '2026-07-01T15:00' } })
    await user.click(submitButton)

    expect(
      await screen.findByText('Une séance ne peut pas durer plus de 6 heures.'),
    ).toBeInTheDocument()
  })
})
