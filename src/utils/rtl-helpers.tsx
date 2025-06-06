import { I18nManager, Platform } from 'react-native';
import useLanguageStore from '../store/language-store';

/**
 * Check if current language is RTL
 */
export const isRTL = (): boolean => {
  const { currentLanguage } = useLanguageStore.getState();
  return currentLanguage.code === 'ar';
};

/**
 * Get text alignment based on RTL state
 */
export const getTextAlign = (override?: 'left' | 'right' | 'center'): 'left' | 'right' | 'center' => {
  if (override) return override;
  return isRTL() ? 'right' : 'left';
};

/**
 * Get flex direction for RTL
 */
export const getFlexDirection = (reverse = false): 'row' | 'row-reverse' => {
  const rtl = isRTL();
  const shouldReverse = reverse ? !rtl : rtl;
  return shouldReverse ? 'row-reverse' : 'row';
};

/**
 * Get directional icon name
 */
export const getDirectionalIcon = (leftIcon: string, rightIcon: string): string => {
  return isRTL() ? rightIcon : leftIcon;
};

/**
 * RTL-aware margin/padding helpers
 */
export const getMarginStart = (value: number) => ({
  [isRTL() ? 'marginRight' : 'marginLeft']: value,
});

export const getMarginEnd = (value: number) => ({
  [isRTL() ? 'marginLeft' : 'marginRight']: value,
});

export const getPaddingStart = (value: number) => ({
  [isRTL() ? 'paddingRight' : 'paddingLeft']: value,
});

export const getPaddingEnd = (value: number) => ({
  [isRTL() ? 'paddingLeft' : 'paddingRight']: value,
});

/**
 * Transform styles for RTL
 */
export const transformForRTL = (styles: any) => {
  if (!isRTL()) return styles;
  
  const transformed = { ...styles };
  
  // Transform specific properties for RTL
  if (transformed.textAlign === 'left') {
    transformed.textAlign = 'right';
  } else if (transformed.textAlign === 'right') {
    transformed.textAlign = 'left';
  }
  
  if (transformed.flexDirection === 'row') {
    transformed.flexDirection = 'row-reverse';
  }
  
  return transformed;
}; 