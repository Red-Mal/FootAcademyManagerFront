import { z } from 'zod'

export const coachFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Prénom requis').max(100),
  lastName: z.string().trim().min(1, 'Nom requis').max(100),
  diploma: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v))
    .nullable(),
})

export type CoachFormValues = z.infer<typeof coachFormSchema>
export type CoachFormInput = z.input<typeof coachFormSchema>
