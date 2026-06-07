import { z } from 'zod'
import { CATEGORIES } from '@/shared/types/domain'

export const playerFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Prénom requis').max(100),
  lastName: z.string().trim().min(1, 'Nom requis').max(100),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  heightCm: z
    .union([z.coerce.number().int().min(100).max(220), z.literal('')])
    .transform((v) => (v === '' ? null : v))
    .nullable(),
  weightKg: z
    .union([z.coerce.number().min(20).max(150), z.literal('')])
    .transform((v) => (v === '' ? null : v))
    .nullable(),
})

export type PlayerFormValues = z.infer<typeof playerFormSchema>
export type PlayerFormInput = z.input<typeof playerFormSchema>
