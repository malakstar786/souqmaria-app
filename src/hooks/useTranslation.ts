import { TranslationKey, useTranslation as useAppTranslation, getTranslation as getAppTranslation } from '../utils/translations';
import useLanguageStore from '../store/language-store';
import { isRTL } from '../utils/rtl';

/**
 * Enhanced translation hook that combines language translation with RTL utilities
 * 
 * @example
 * const { t, tf, isRTL, currentLanguage } = useTranslation();
 * return <Text style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('greeting')}</Text>;
 */
export const useTranslation = () => {
  const { t, tf } = useAppTranslation();
  const { currentLanguage } = useLanguageStore();
  
  // Helper for numeric formatting based on language
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(
      currentLanguage.code === 'ar' ? 'ar-EG' : 'en-US'
    ).format(num);
  };
  
  // Helper for date formatting based on language
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return new Intl.DateTimeFormat(
      currentLanguage.code === 'ar' ? 'ar-EG' : 'en-US',
      options
    ).format(date);
  };
  
  // Helper for currency formatting based on language
  const formatCurrency = (amount: number, currencyCode = 'KWD'): string => {
    return new Intl.NumberFormat(
      currentLanguage.code === 'ar' ? 'ar-EG' : 'en-US',
      { 
        style: 'currency', 
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ).format(amount);
  };

  return {
    t,               // Basic translation function
    tf,              // Translation with formatting
    formatNumber,    // Number formatter
    formatDate,      // Date formatter
    formatCurrency,  // Currency formatter
    isRTL: isRTL(),  // Current RTL state
    currentLanguage  // Current language object
  };
};

/**
 * Re-export the direct translation function for use outside of React components
 * 
 * @example
 * const greeting = getTranslation('greeting', 'en');
 */
export const getTranslation = getAppTranslation;

/**
 * Export the TranslationKey type for convenient imports
 */
export type { TranslationKey }; 