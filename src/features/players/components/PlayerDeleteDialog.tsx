import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { useDeletePlayer } from '../api/players.mutations'

interface PlayerDeleteDialogProps {
  playerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlayerDeleteDialog({ playerId, open, onOpenChange }: PlayerDeleteDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deletePlayer = useDeletePlayer()

  function handleConfirm() {
    deletePlayer.mutate(playerId, {
      onSuccess: () => {
        onOpenChange(false)
        navigate('/players')
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('players.deleteConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('players.deleteConfirm.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePlayer.isPending}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={deletePlayer.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
