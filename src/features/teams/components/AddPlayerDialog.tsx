import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { formatFullName } from '@/shared/lib/format'
import type { Category } from '@/shared/types/domain'
import { usePlayersList } from '@/features/players/api/players.queries'
import { useAddPlayerToTeam } from '../api/teams.mutations'

interface AddPlayerDialogProps {
  teamId: string
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPlayerDialog({ teamId, category, open, onOpenChange }: AddPlayerDialogProps) {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const { data, isLoading } = usePlayersList({
    category,
    search: debouncedSearch || undefined,
    size: 100,
  })
  const addPlayer = useAddPlayerToTeam(teamId)

  const eligiblePlayers = (data?.content ?? []).filter((player) => player.teamId === null)

  function toggle(playerId: string, checked: boolean) {
    setSelectedIds((prev) => (checked ? [...prev, playerId] : prev.filter((id) => id !== playerId)))
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setSelectedIds([])
      setSearchInput('')
    }
    onOpenChange(next)
  }

  async function handleAdd() {
    setIsAdding(true)
    try {
      // Ajouts séquentiels : l'API n'a pas d'endpoint d'ajout en lot.
      for (const playerId of selectedIds) {
        await addPlayer.mutateAsync(playerId)
      }
      handleOpenChange(false)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('teams.addPlayer')}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('teams.addPlayerDialog.search')}
            className="pl-9"
            aria-label={t('teams.addPlayerDialog.search')}
          />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : eligiblePlayers.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t('teams.addPlayerDialog.empty')}
          </p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto">
            {eligiblePlayers.map((player) => {
              const checkboxId = `add-player-${player.id}`
              return (
                <li
                  key={player.id}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-accent/50"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={selectedIds.includes(player.id)}
                    onCheckedChange={(checked) => toggle(player.id, checked === true)}
                  />
                  <PersonAvatar
                    firstName={player.firstName}
                    lastName={player.lastName}
                    photoUrl={player.photoUrl}
                    size="sm"
                  />
                  <Label htmlFor={checkboxId} className="flex-1 cursor-pointer font-normal">
                    {formatFullName(player.firstName, player.lastName)}
                  </Label>
                </li>
              )
            })}
          </ul>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={() => void handleAdd()} disabled={selectedIds.length === 0 || isAdding}>
            {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('teams.addPlayer')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
