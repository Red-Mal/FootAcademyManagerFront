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
import { useDeleteSession } from '../api/sessions.mutations'

interface SessionDeleteDialogProps {
  sessionId: string
  teamId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SessionDeleteDialog({ sessionId, teamId, open, onOpenChange }: SessionDeleteDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deleteSession = useDeleteSession()

  function handleConfirm() {
    deleteSession.mutate(
      { id: sessionId, teamId },
      {
        onSuccess: () => {
          onOpenChange(false)
          navigate('/sessions')
        },
      },
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('sessions.deleteConfirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('sessions.deleteConfirm.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSession.isPending}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={deleteSession.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
