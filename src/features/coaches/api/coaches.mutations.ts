import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isApiError } from '@/shared/api/error'
import { handleMutationError } from '@/shared/api/mutation-error'
import {
  coachesApi,
  type CreateCoachPayload,
  type UpdateCoachCategoriesPayload,
  type UpdateCoachPayload,
} from './coaches.api'
import { coachKeys } from './coaches.keys'

export function useCreateCoach() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateCoachPayload) => coachesApi.create(payload),
    onSuccess: (coach) => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() })
      toast.success(t('coaches.created', { name: `${coach.firstName} ${coach.lastName}` }))
    },
    onError: (err) => handleMutationError(err, t, 'coaches.errors.create'),
  })
}

export function useUpdateCoach(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdateCoachPayload) => coachesApi.update(id, payload),
    onSuccess: (coach) => {
      queryClient.setQueryData(coachKeys.detail(id), coach)
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() })
      toast.success(t('coaches.updated'))
    },
    onError: (err) => handleMutationError(err, t, 'coaches.errors.update'),
  })
}

export function useUpdateCoachCategories(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdateCoachCategoriesPayload) => coachesApi.updateCategories(id, payload),
    onSuccess: (coach) => {
      queryClient.setQueryData(coachKeys.detail(id), coach)
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() })
      toast.success(t('coaches.categoriesUpdated'))
    },
    onError: (err) => {
      if (isApiError(err) && err.code === 'COACH_CATEGORY_IN_USE') {
        toast.error(err.problem?.detail || t('coaches.errors.categoryInUse'))
        return
      }
      handleMutationError(err, t, 'coaches.errors.categoriesUpdate')
    },
  })
}

export function useDeleteCoach() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => coachesApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() })
      queryClient.removeQueries({ queryKey: coachKeys.detail(id) })
      toast.success(t('coaches.deleted'))
    },
    onError: (err, id) => {
      if (isApiError(err) && err.code === 'COACH_HAS_TEAMS') {
        toast.error(t('coaches.errors.hasTeams'), {
          action: {
            label: t('coaches.deleteConfirm.viewTeams'),
            onClick: () => navigate(`/teams?coachId=${id}`),
          },
        })
        return
      }
      handleMutationError(err, t, 'coaches.errors.delete')
    },
  })
}

export function useUploadCoachPhoto(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (file: File) => coachesApi.uploadPhoto(id, file),
    onSuccess: (coach) => {
      queryClient.setQueryData(coachKeys.detail(id), coach)
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() })
      toast.success(t('coaches.photoUpdated'))
    },
    onError: (err) => handleMutationError(err, t, 'coaches.errors.photoUpload'),
  })
}
