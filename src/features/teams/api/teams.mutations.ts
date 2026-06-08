import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { handleMutationError } from '@/shared/api/mutation-error'
import { playerKeys } from '@/features/players/api/players.keys'
import {
  teamsApi,
  type ChangeCoachPayload,
  type CreateTeamPayload,
  type UpdateTeamPayload,
} from './teams.api'
import { teamKeys } from './teams.keys'

export function useCreateTeam() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamsApi.create(payload),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
      toast.success(t('teams.created', { name: team.name }))
    },
    onError: (err) => handleMutationError(err, t, 'teams.errors.create'),
  })
}

export function useUpdateTeam(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdateTeamPayload) => teamsApi.update(id, payload),
    onSuccess: (team) => {
      queryClient.setQueryData(teamKeys.detail(id), team)
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
      toast.success(t('teams.updated'))
    },
    onError: (err) => handleMutationError(err, t, 'teams.errors.update'),
  })
}

export function useChangeCoach(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: ChangeCoachPayload) => teamsApi.changeCoach(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
      toast.success(t('teams.coachChanged'))
    },
    onError: (err) => handleMutationError(err, t, 'teams.errors.changeCoach'),
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => teamsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
      queryClient.removeQueries({ queryKey: teamKeys.detail(id) })
      toast.success(t('teams.deleted'))
    },
    onError: (err) => handleMutationError(err, t, 'teams.errors.delete'),
  })
}

export function useAddPlayerToTeam(teamId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (playerId: string) => teamsApi.addPlayer(teamId, playerId),
    onSuccess: (_, playerId) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) })
      queryClient.invalidateQueries({ queryKey: playerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: playerKeys.detail(playerId) })
      toast.success(t('teams.playerAdded'))
    },
    onError: (err) => handleMutationError(err, t, 'teams.errors.addPlayer'),
  })
}

export function useRemovePlayerFromTeam(teamId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (playerId: string) => teamsApi.removePlayer(teamId, playerId),
    onSuccess: (_, playerId) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) })
      queryClient.invalidateQueries({ queryKey: playerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: playerKeys.detail(playerId) })
      toast.success(t('teams.playerRemoved'))
    },
    onError: (err) => handleMutationError(err, t, 'teams.errors.removePlayer'),
  })
}
