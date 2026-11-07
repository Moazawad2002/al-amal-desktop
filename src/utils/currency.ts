/**
 * Egyptian Currency and Number formatting utilities
 */

export function formatEGP(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return locale === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
}

export function formatNumber(value: number, locale: 'ar' | 'en' = 'ar'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG').format(value);
}

export function formatPercentage(value: number, locale: 'ar' | 'en' = 'ar'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

  return `${formatted}%`;
}
