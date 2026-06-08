import { z } from 'zod'

const MIN_DURATION_MINUTES = 15
const MAX_DURATION_HOURS = 6
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const sessionFieldsSchema = z.object({
  teamId: z.string(),
  startDateTime: z.date({ message: 'Date de début requise' }),
  endDateTime: z.date({ message: 'Date de fin requise' }),
  location: z.string().trim().min(1, 'Lieu requis').max(255),
  notes: z
    .string()
    .trim()
    .max(2000, 'Les notes ne peuvent pas dépasser 2000 caractères')
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v))
    .nullable(),
})

function checkSchedule(
  data: { startDateTime: Date; endDateTime: Date },
  ctx: z.RefinementCtx,
): void {
  if (data.endDateTime <= data.startDateTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La date de fin doit être postérieure à la date de début.',
      path: ['endDateTime'],
    })
    return
  }

  const durationMinutes = (data.endDateTime.getTime() - data.startDateTime.getTime()) / 60_000

  if (durationMinutes < MIN_DURATION_MINUTES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Une séance doit durer au minimum 15 minutes.',
      path: ['endDateTime'],
    })
  } else if (durationMinutes > MAX_DURATION_HOURS * 60) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Une séance ne peut pas durer plus de 6 heures.',
      path: ['endDateTime'],
    })
  }
}

// Les deux modes produisent le même type de sortie ({ teamId, startDateTime,
// endDateTime, location, notes }) : seules les règles de validation diffèrent
// (équipe + date future obligatoires uniquement à la création). teamId est
// donc toujours présent dans la valeur, mais en modification le champ est
// affiché en lecture seule et n'est jamais transmis à l'API (cf. SessionForm
// et SessionEditPage).
function buildSessionSchema(mode: 'create' | 'edit') {
  return sessionFieldsSchema.superRefine((data, ctx) => {
    if (mode === 'create' && !UUID_PATTERN.test(data.teamId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Équipe requise',
        path: ['teamId'],
      })
    }

    checkSchedule(data, ctx)

    if (mode === 'create' && data.startDateTime.getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La séance doit être planifiée dans le futur.',
        path: ['startDateTime'],
      })
    }
  })
}

// Schéma de modification : teamId est porté par le formulaire mais affiché en
// lecture seule (non modifiable, non revalidé, jamais envoyé au backend).
export const sessionFormSchema = buildSessionSchema('edit')
export type SessionFormValues = z.infer<typeof sessionFormSchema>
export type SessionFormInput = z.input<typeof sessionFormSchema>

// Schéma de création : ajoute la validation de l'équipe et interdit la
// planification dans le passé.
export const sessionCreateSchema = buildSessionSchema('create')
export type SessionCreateValues = z.infer<typeof sessionCreateSchema>
export type SessionCreateInput = z.input<typeof sessionCreateSchema>
