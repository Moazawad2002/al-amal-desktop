/**
 * Date formatting utilities for Arabic and English
 */

export function formatDate(dateString: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(dateString: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getDaysBetween(date1: string | Date, date2: string | Date = new Date()): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  const diffTime = d2 - d1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
