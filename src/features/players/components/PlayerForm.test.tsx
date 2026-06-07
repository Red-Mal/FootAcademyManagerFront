import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { PlayerForm } from './PlayerForm'

afterEach(() => {
  vi.clearAllMocks()
})

describe('PlayerForm', () => {
  it('shows validation errors when submitting an empty form', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<PlayerForm onSubmit={onSubmit} submitLabel="Créer le joueur" isPending={false} />)

    await user.click(screen.getByRole('button', { name: /créer le joueur/i }))

    expect(await screen.findByText('Prénom requis')).toBeInTheDocument()
    expect(screen.getByText('Nom requis')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits with the entered values and null for empty optional numeric fields', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderWithProviders(<PlayerForm onSubmit={onSubmit} submitLabel="Créer le joueur" isPending={false} />)

    await user.type(screen.getByLabelText(/prénom/i), 'Karim')
    await user.type(screen.getByLabelText(/^nom$/i), 'Benzema')
    await user.click(screen.getByRole('button', { name: /créer le joueur/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'Karim',
        lastName: 'Benzema',
        category: 'U12',
        heightCm: null,
        weightKg: null,
      })
    })
  })

  it('shows a validation error when the height is out of range', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<PlayerForm onSubmit={onSubmit} submitLabel="Créer le joueur" isPending={false} />)

    await user.type(screen.getByLabelText(/prénom/i), 'Karim')
    await user.type(screen.getByLabelText(/^nom$/i), 'Benzema')
    await user.type(screen.getByLabelText(/taille/i), '50')
    await user.click(screen.getByRole('button', { name: /créer le joueur/i }))

    expect(await screen.findByText(/100|220/)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pre-fills the fields from defaultValues when editing', () => {
    renderWithProviders(
      <PlayerForm
        defaultValues={{
          firstName: 'Karim',
          lastName: 'Benzema',
          category: 'U14',
          heightCm: 170,
          weightKg: 60,
        }}
        onSubmit={vi.fn()}
        submitLabel="Enregistrer"
        isPending={false}
      />,
    )

    expect(screen.getByLabelText(/prénom/i)).toHaveValue('Karim')
    expect(screen.getByLabelText(/^nom$/i)).toHaveValue('Benzema')
    expect(screen.getByLabelText(/taille/i)).toHaveValue(170)
    expect(screen.getByLabelText(/poids/i)).toHaveValue(60)
  })
})
