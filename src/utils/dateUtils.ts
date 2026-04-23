import { format, parseISO } from 'date-fns'

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}

export function formatDateDisplay(date: string): string {
  const dateObj = parseISO(date)
  return format(dateObj, 'd MMM yyyy')
}
