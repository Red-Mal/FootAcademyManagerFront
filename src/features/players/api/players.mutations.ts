import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { handleMutationError } from '@/shared/api/mutation-error'
import { playersApi, type CreatePlayerPayload, type UpdatePlayerPayload } from './players.api'
import { playerKeys } from './players.keys'

export function useCreatePlayer() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreatePlayerPayload) => playersApi.create(payload),
    onSuccess: (player) => {
      queryClient.invalidateQueries({ queryKey: playerKeys.lists() })
      toast.success(t('players.created', { name: `${player.firstName} ${player.lastName}` }))
    },
    onError: (err) => handleMutationError(err, t, 'players.errors.create'),
  })
}

export function useUpdatePlayer(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdatePlayerPayload) => playersApi.update(id, payload),
    onSuccess: (player) => {
      queryClient.setQueryData(playerKeys.detail(id), player)
      queryClient.invalidateQueries({ queryKey: playerKeys.lists() })
      toast.success(t('players.updated'))
    },
    onError: (err) => handleMutationError(err, t, 'players.errors.update'),
  })
}

export function useDeletePlayer() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => playersApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: playerKeys.lists() })
      queryClient.removeQueries({ queryKey: playerKeys.detail(id) })
      toast.success(t('players.deleted'))
    },
    onError: (err) => handleMutationError(err, t, 'players.errors.delete'),
  })
}

export function useUploadPlayerPhoto(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (file: File) => playersApi.uploadPhoto(id, file),
    onSuccess: (player) => {
      queryClient.setQueryData(playerKeys.detail(id), player)
      queryClient.invalidateQueries({ queryKey: playerKeys.lists() })
      toast.success(t('players.photoUpdated'))
    },
    onError: (err) => handleMutationError(err, t, 'players.errors.photoUpload'),
  })
}
