export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

export function formatInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('fr-FR', options).format(value)
}

const CATEGORY_LABELS: Record<string, string> = {
  U12: 'U12 · Benjamins',
  U13: 'U13 · Benjamins',
  U14: 'U14 · Minimes',
  U15: 'U15 · Minimes',
  U16: 'U16 · Cadets',
  U17: 'U17 · Cadets',
}

export function formatCategory(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}

