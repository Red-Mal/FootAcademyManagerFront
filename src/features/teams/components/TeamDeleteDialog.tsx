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
import { useDeleteTeam } from '../api/teams.mutations'

interface TeamDeleteDialogProps {
  teamId: string
  playerCount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamDeleteDialog({ teamId, playerCount, open, onOpenChange }: TeamDeleteDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deleteTeam = useDeleteTeam()

  function handleConfirm() {
    deleteTeam.mutate(teamId, {
      onSuccess: () => {
        onOpenChange(false)
        navigate('/teams')
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('teams.deleteConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('teams.deleteConfirm.description')}
            {playerCount > 0 && (
              <>
                {' '}
                {t('teams.deleteConfirm.playersDetached', { count: playerCount })}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTeam.isPending}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={deleteTeam.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
