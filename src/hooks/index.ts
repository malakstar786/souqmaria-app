/**
 * Centralized exports for all hooks
 * 
 * This file exports all custom hooks to provide a single import point.
 * Import from this file like: import { useTranslation, useRTL } from '../hooks';
 */

// Re-export translation hooks
export { useTranslation, getTranslation } from './useTranslation';
export type { TranslationKey } from './useTranslation';

// Re-export RTL hooks
export { useRTL } from '../utils/rtl';

// Re-export language store hooks
export { default as useLanguageStore } from '../store/language-store'; 