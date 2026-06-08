import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { handleMutationError } from '@/shared/api/mutation-error'
import {
  sessionsApi,
  type CreateSessionPayload,
  type UpdateSessionPayload,
} from './sessions.api'
import { sessionKeys } from './sessions.keys'

function invalidateTeamSchedule(
  queryClient: ReturnType<typeof useQueryClient>,
  teamId: string,
) {
  queryClient.invalidateQueries({ queryKey: [...sessionKeys.all, 'byTeam', teamId] })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => sessionsApi.create(payload),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      invalidateTeamSchedule(queryClient, session.teamId)
      toast.success(t('sessions.created'))
    },
    onError: (err) => handleMutationError(err, t, 'sessions.errors.create'),
  })
}

export function useUpdateSession(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) => sessionsApi.update(id, payload),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      invalidateTeamSchedule(queryClient, session.teamId)
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) })
      toast.success(t('sessions.updated'))
    },
    onError: (err) => handleMutationError(err, t, 'sessions.errors.update'),
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id }: { id: string; teamId: string }) => sessionsApi.delete(id),
    onSuccess: (_, { id, teamId }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      invalidateTeamSchedule(queryClient, teamId)
      queryClient.removeQueries({ queryKey: sessionKeys.detail(id) })
      toast.success(t('sessions.deleted'))
    },
    onError: (err) => handleMutationError(err, t, 'sessions.errors.delete'),
  })
}
