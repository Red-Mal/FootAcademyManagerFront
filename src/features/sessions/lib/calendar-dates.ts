import { endOfDay, format, parse, parseISO } from 'date-fns'

// Format de date-heure attendu par Schedule-X (toujours en heure locale du navigateur,
// donc en heure de l'académie).
const SCHEDULE_X_DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm'
const SCHEDULE_X_DATE_FORMAT = 'yyyy-MM-dd'

// Convertit un Instant ISO (UTC) du backend en chaîne locale 'yyyy-MM-dd HH:mm' pour Schedule-X.
export function toScheduleXString(iso: string): string {
  return format(parseISO(iso), SCHEDULE_X_DATE_TIME_FORMAT)
}

// Convertit une chaîne Schedule-X ('yyyy-MM-dd HH:mm' ou 'yyyy-MM-dd') en Instant ISO (UTC)
// pour le backend, en interprétant la chaîne comme une heure locale.
export function fromScheduleXString(value: string): string {
  if (value.includes(' ')) {
    return parse(value, SCHEDULE_X_DATE_TIME_FORMAT, new Date()).toISOString()
  }
  return parse(value, SCHEDULE_X_DATE_FORMAT, new Date()).toISOString()
}

// Convertit la borne de début d'un range Schedule-X (date ou date-heure) en Date locale.
export function parseRangeStart(value: string): Date {
  return value.includes(' ')
    ? parse(value, SCHEDULE_X_DATE_TIME_FORMAT, new Date())
    : parse(value, SCHEDULE_X_DATE_FORMAT, new Date())
}

// Convertit la borne de fin d'un range Schedule-X en Date locale, en couvrant la journée
// entière lorsque seule la date est fournie (pas d'heure de fin explicite).
export function parseRangeEnd(value: string): Date {
  return value.includes(' ')
    ? parse(value, SCHEDULE_X_DATE_TIME_FORMAT, new Date())
    : endOfDay(parse(value, SCHEDULE_X_DATE_FORMAT, new Date()))
}
