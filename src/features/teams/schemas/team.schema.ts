import { z } from 'zod'
import { CATEGORIES } from '@/shared/types/domain'

export const teamCreateSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis').max(150),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  coachId: z.string().uuid('Coach requis'),
})

export type TeamCreateValues = z.infer<typeof teamCreateSchema>
export type TeamCreateInput = z.input<typeof teamCreateSchema>

export const teamUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis').max(150),
})

export type TeamUpdateValues = z.infer<typeof teamUpdateSchema>
export type TeamUpdateInput = z.input<typeof teamUpdateSchema>

export const changeCoachSchema = z.object({
  newCoachId: z.string().uuid('Coach requis'),
})

export type ChangeCoachValues = z.infer<typeof changeCoachSchema>
export type ChangeCoachInput = z.input<typeof changeCoachSchema>
