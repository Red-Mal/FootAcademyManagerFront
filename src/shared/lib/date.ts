import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDate(value: string | Date, pattern = 'dd/MM/yyyy'): string {
  const date = typeof value === 'string' ? parseISO(value) : value
  return format(date, pattern, { locale: fr })
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, "dd/MM/yyyy 'à' HH:mm")
}

export function formatTime(value: string | Date): string {
  return formatDate(value, 'HH:mm')
}

export function formatRelative(value: string | Date): string {
  const date = typeof value === 'string' ? parseISO(value) : value
  return formatDistanceToNow(date, { locale: fr, addSuffix: true })
}
