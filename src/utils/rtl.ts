// RTL (Right-to-Left) language support utilities
import { I18nManager, Platform } from 'react-native';
import useLanguageStore from '../store/language-store';
import { useEffect } from 'react';

// RTL languages list
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Check if current language should use RTL
export function isRTL(): boolean {
  const { currentLanguage } = useLanguageStore.getState();
  
  // For Android: only apply RTL if language is Arabic
  if (Platform.OS === 'android') {
    return currentLanguage.code === 'ar';
  }
  
  // For iOS: use the language's natural RTL property
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

// Apply RTL styles to a style object with immediate updates
export function applyRTL(styles: any) {
  // Use the platform-specific RTL check
  const shouldApplyRTL = isRTL();
  
  if (!shouldApplyRTL) return styles;
  
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
  if (rtlStyles.marginLeft !== undefined && rtlStyles.marginRight !== undefined) {
    const temp = rtlStyles.marginLeft;
    rtlStyles.marginLeft = rtlStyles.marginRight;
    rtlStyles.marginRight = temp;
  } else if (rtlStyles.marginLeft !== undefined) {
    rtlStyles.marginRight = rtlStyles.marginLeft;
    delete rtlStyles.marginLeft;
  } else if (rtlStyles.marginRight !== undefined) {
    rtlStyles.marginLeft = rtlStyles.marginRight;
    delete rtlStyles.marginRight;
  }
  
  // Convert paddings
  if (rtlStyles.paddingLeft !== undefined && rtlStyles.paddingRight !== undefined) {
    const temp = rtlStyles.paddingLeft;
    rtlStyles.paddingLeft = rtlStyles.paddingRight;
    rtlStyles.paddingRight = temp;
  } else if (rtlStyles.paddingLeft !== undefined) {
    rtlStyles.paddingRight = rtlStyles.paddingLeft;
    delete rtlStyles.paddingLeft;
  } else if (rtlStyles.paddingRight !== undefined) {
    rtlStyles.paddingLeft = rtlStyles.paddingRight;
    delete rtlStyles.paddingRight;
  }
  
  // Convert positions
  if (rtlStyles.left !== undefined && rtlStyles.right !== undefined) {
    const temp = rtlStyles.left;
    rtlStyles.left = rtlStyles.right;
    rtlStyles.right = temp;
  } else if (rtlStyles.left !== undefined) {
    rtlStyles.right = rtlStyles.left;
    delete rtlStyles.left;
  } else if (rtlStyles.right !== undefined) {
    rtlStyles.left = rtlStyles.right;
    delete rtlStyles.right;
  }
  
  return rtlStyles;
}

// Enhanced hook for RTL-aware styling - includes immediate updates
export function useRTL() {
  const { currentLanguage, layoutVersion } = useLanguageStore();
  
  // Use platform-specific RTL logic
  const currentIsRTL = isRTL();
  const textAlign = currentIsRTL ? 'right' : 'left';
  const flexDirection = currentIsRTL ? 'row-reverse' : 'row';
  
  // Log RTL changes for debugging
  useEffect(() => {
    console.log('🔄 RTL state updated:', {
      language: currentLanguage.code,
      isRTL: currentIsRTL,
      I18nManagerRTL: I18nManager.isRTL,
      layoutVersion,
      platform: Platform.OS
    });
  }, [currentLanguage.code, currentIsRTL, layoutVersion]);
  
  return {
    isRTL: currentIsRTL,
    textAlign: textAlign as 'left' | 'right',
    flexDirection: flexDirection as 'row' | 'row-reverse',
    layoutVersion, // Include for components that need to force re-render
    
    // Helper functions that use current state
    marginStart: (value: number) => currentIsRTL ? { marginRight: value } : { marginLeft: value },
    marginEnd: (value: number) => currentIsRTL ? { marginLeft: value } : { marginRight: value },
    paddingStart: (value: number) => currentIsRTL ? { paddingRight: value } : { paddingLeft: value },
    paddingEnd: (value: number) => currentIsRTL ? { paddingLeft: value } : { paddingRight: value },
    positionStart: (value: number) => currentIsRTL ? { right: value } : { left: value },
    positionEnd: (value: number) => currentIsRTL ? { left: value } : { right: value },
    
    // Apply RTL with current state
    applyRTL: (styles: any) => {
      if (!currentIsRTL) return styles;
      
      const rtlStyles = { ...styles };
      
      // Apply RTL transformations immediately
      if (rtlStyles.flexDirection === 'row') {
        rtlStyles.flexDirection = 'row-reverse';
      }
      
      if (rtlStyles.textAlign === 'left') {
        rtlStyles.textAlign = 'right';
      } else if (rtlStyles.textAlign === 'right') {
        rtlStyles.textAlign = 'left';
      }
      
      return rtlStyles;
    }
  };
}

// Force RTL layout update (call when language changes)
export function forceRTL(enable: boolean) {
  I18nManager.forceRTL(enable);
  console.log('🔄 I18nManager.forceRTL called with:', enable);
  
  // On Android, this typically requires app restart to take full effect
  if (Platform.OS === 'android') {
    console.log('🤖 Android detected: RTL change may require app restart for full effect');
  }
}

// Check if device supports RTL
export function isRTLSupported(): boolean {
  return I18nManager.isRTL;
}

// Get current I18nManager state for debugging
export function getI18nManagerState() {
  return {
    isRTL: I18nManager.isRTL,
    platform: Platform.OS,
    allowRTL: I18nManager.allowRTL,
  };
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