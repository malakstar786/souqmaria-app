// RTL (Right-to-Left) language support utilities
import { I18nManager } from 'react-native';
import useLanguageStore from '../store/language-store';
import { useEffect } from 'react';

// RTL languages list
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Check if current language is RTL
export function isRTL(): boolean {
  const { currentLanguage } = useLanguageStore.getState();
  return currentLanguage.isRTL;
}

// Get text alignment based on language direction
export function getTextAlign(): 'left' | 'right' | 'center' {
  return isRTL() ? 'right' : 'left';
}

// Get flex direction for RTL support
export function getFlexDirection(): 'row' | 'row-reverse' {
  return isRTL() ? 'row-reverse' : 'row';
}

// Get margin/padding direction helpers
export function getMarginStart(value: number) {
  return isRTL() ? { marginRight: value } : { marginLeft: value };
}

export function getMarginEnd(value: number) {
  return isRTL() ? { marginLeft: value } : { marginRight: value };
}

export function getPaddingStart(value: number) {
  return isRTL() ? { paddingRight: value } : { paddingLeft: value };
}

export function getPaddingEnd(value: number) {
  return isRTL() ? { paddingLeft: value } : { paddingRight: value };
}

// Get position direction helpers
export function getPositionStart(value: number) {
  return isRTL() ? { right: value } : { left: value };
}

export function getPositionEnd(value: number) {
  return isRTL() ? { left: value } : { right: value };
}

// Apply RTL styles to a style object
export function applyRTL(styles: any) {
  if (!isRTL()) return styles;
  
  const rtlStyles = { ...styles };
  
  // Convert flexDirection
  if (rtlStyles.flexDirection === 'row') {
    rtlStyles.flexDirection = 'row-reverse';
  }
  
  // Convert text alignment
  if (rtlStyles.textAlign === 'left') {
    rtlStyles.textAlign = 'right';
  } else if (rtlStyles.textAlign === 'right') {
    rtlStyles.textAlign = 'left';
  }
  
  // Convert margins
  if (rtlStyles.marginLeft !== undefined) {
    const temp = rtlStyles.marginLeft;
    rtlStyles.marginLeft = rtlStyles.marginRight;
    rtlStyles.marginRight = temp;
  }
  
  // Convert paddings
  if (rtlStyles.paddingLeft !== undefined) {
    const temp = rtlStyles.paddingLeft;
    rtlStyles.paddingLeft = rtlStyles.paddingRight;
    rtlStyles.paddingRight = temp;
  }
  
  // Convert positions
  if (rtlStyles.left !== undefined) {
    const temp = rtlStyles.left;
    rtlStyles.left = rtlStyles.right;
    rtlStyles.right = temp;
  }
  
  return rtlStyles;
}

// Hook for RTL-aware styling - now includes layoutVersion for immediate updates
export function useRTL() {
  const { currentLanguage, layoutVersion } = useLanguageStore();
  
  // Include layoutVersion to force re-render when language changes
  const isRTL = currentLanguage.isRTL;
  const textAlign = isRTL ? 'right' : 'left';
  const flexDirection = isRTL ? 'row-reverse' : 'row';
  
  return {
    isRTL,
    textAlign: textAlign as 'left' | 'right',
    flexDirection: flexDirection as 'row' | 'row-reverse',
    layoutVersion, // Include for components that need to force re-render
    marginStart: (value: number) => getMarginStart(value),
    marginEnd: (value: number) => getMarginEnd(value),
    paddingStart: (value: number) => getPaddingStart(value),
    paddingEnd: (value: number) => getPaddingEnd(value),
    positionStart: (value: number) => getPositionStart(value),
    positionEnd: (value: number) => getPositionEnd(value),
    applyRTL: (styles: any) => applyRTL(styles)
  };
}

// Force RTL layout update (call when language changes)
export function forceRTL(enable: boolean) {
  I18nManager.forceRTL(enable);
  // Note: This requires app restart to take effect in React Native
  // For immediate changes, use the useRTL hook and layoutVersion
}

// Check if device supports RTL
export function isRTLSupported(): boolean {
  return I18nManager.isRTL;
}

// Hook to preload cache for the opposite language in the background
export const useBackgroundCachePreload = () => {
  const { currentLanguage, preloadLanguageCache } = useLanguageStore();
  
  useEffect(() => {
    // Preload cache for the opposite language after a short delay
    const timer = setTimeout(() => {
      const oppositeLanguage = currentLanguage.code === 'en' ? 'ar' : 'en';
      preloadLanguageCache(oppositeLanguage);
    }, 3000); // Wait 3 seconds after component mount
    
    return () => clearTimeout(timer);
  }, [currentLanguage.code, preloadLanguageCache]);
}; 