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
import { useDeleteCoach } from '../api/coaches.mutations'

interface CoachDeleteDialogProps {
  coachId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoachDeleteDialog({ coachId, open, onOpenChange }: CoachDeleteDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deleteCoach = useDeleteCoach()

  function handleConfirm() {
    deleteCoach.mutate(coachId, {
      onSuccess: () => {
        onOpenChange(false)
        navigate('/coaches')
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('coaches.deleteConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('coaches.deleteConfirm.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCoach.isPending}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={deleteCoach.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
