// RTL (Right-to-Left) language support utilities
import { I18nManager, TextStyle, ViewStyle, ImageStyle, FlexStyle } from 'react-native';
import useLanguageStore from '../store/language-store';

// RTL languages list
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Check if current language should use RTL
export function isRTL(): boolean {
  const { currentLanguage } = useLanguageStore.getState();
  return currentLanguage.code === 'ar';
}

// Get text alignment based on language direction
export function getTextAlign(): 'left' | 'right' | 'center' {
  return isRTL() ? 'right' : 'left';
}

// Get flex direction for RTL support
export function getFlexDirection(baseDirection: 'row' | 'column' = 'row'): ViewStyle['flexDirection'] {
  if (baseDirection === 'row') {
    return isRTL() ? 'row-reverse' : 'row';
  }
  return isRTL() ? 'column-reverse' : 'column';
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

// Helper for flipping values based on RTL
export function getFlippedValue<T>(ltrValue: T, rtlValue: T): T {
  return isRTL() ? rtlValue : ltrValue;
}

// Helper for conditional styling based on RTL
export function getConditionalStyle<T>(ltrStyle: T, rtlStyle: T): T {
  return isRTL() ? rtlStyle : ltrStyle;
}

// Helper for flipping directional icons
export function getIconFlipStyle(): ImageStyle {
  return isRTL() ? { transform: [{ scaleX: -1 }] } : {};
}

// Helper to determine if an icon needs flipping
export function shouldFlipIcon(iconName: string): boolean {
  // Common directional icon names that need flipping in RTL
  const directionalIcons = [
    'arrow-back',
    'arrow-forward',
    'arrow-left',
    'arrow-right',
    'chevron-left',
    'chevron-right',
    'arrow-back-ios',
    'arrow-forward-ios',
    'keyboard-arrow-left',
    'keyboard-arrow-right',
    'navigate-before',
    'navigate-next',
    'back',
    'forward',
    'caret-left',
    'caret-right',
    // Add more as needed for your icon library
  ];
  
  return directionalIcons.some(name => iconName.includes(name));
}

// Helper for icon flipping based on icon name
export function getIconStyle(iconName: string): ImageStyle {
  return shouldFlipIcon(iconName) ? getIconFlipStyle() : {};
}

// Apply RTL styles to a style object
export function applyRTL(styles: any) {
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

// Simple hook for RTL-aware styling
export function useRTL() {
  // Use I18nManager.isRTL directly after reload, as it will be accurate.
  // Combining with store to ensure consistency throughout the app
  const { currentLanguage } = useLanguageStore();
  const currentIsRTL = I18nManager.isRTL;
  
  // Helper for getting text alignment based on direction
  const getTextAlign = (): TextStyle['textAlign'] => {
    return currentIsRTL ? 'right' : 'left';
  };
  
  // Helper for getting flexDirection based on base direction
  const getFlexDirection = (baseDirection: 'row' | 'column' = 'row'): ViewStyle['flexDirection'] => {
    if (baseDirection === 'row') {
      return currentIsRTL ? 'row-reverse' : 'row';
    }
    return currentIsRTL ? 'column-reverse' : 'column';
  };
  
  // Helper for positioning elements
  const getPositionalStyle = (value: number) => {
    return { [currentIsRTL ? 'right' : 'left']: value };
  };
  
  // Helper for end positioning elements
  const getEndPositionalStyle = (value: number) => {
    return { [currentIsRTL ? 'left' : 'right']: value };
  };
  
  // Helper for flipping values
  const getFlippedValue = <T>(ltrValue: T, rtlValue: T): T => {
    return currentIsRTL ? rtlValue : ltrValue;
  };
  
  // Helper for conditional styling
  const getConditionalStyle = <T>(ltrStyle: T, rtlStyle: T): T => {
    return currentIsRTL ? rtlStyle : ltrStyle;
  };
  
  return {
    isRTL: currentIsRTL,
    textAlign: currentIsRTL ? 'right' : 'left' as 'left' | 'right',
    flexDirection: currentIsRTL ? 'row-reverse' : 'row' as 'row' | 'row-reverse',
    direction: currentIsRTL ? 'rtl' : 'ltr' as 'ltr' | 'rtl',
    
    // Helper functions
    getTextAlign,
    getFlexDirection,
    getPositionalStyle,
    getEndPositionalStyle,
    getFlippedValue,
    getConditionalStyle,
    
    // Margin helpers
    marginStart: (value: number) => currentIsRTL ? { marginRight: value } : { marginLeft: value },
    marginEnd: (value: number) => currentIsRTL ? { marginLeft: value } : { marginRight: value },
    paddingStart: (value: number) => currentIsRTL ? { paddingRight: value } : { paddingLeft: value },
    paddingEnd: (value: number) => currentIsRTL ? { paddingLeft: value } : { paddingRight: value },
    positionStart: (value: number) => currentIsRTL ? { right: value } : { left: value },
    positionEnd: (value: number) => currentIsRTL ? { left: value } : { right: value },
    
    // Icon flipping helper
    iconFlip: currentIsRTL ? { transform: [{ scaleX: -1 }] } : {},
    
    // Apply RTL with current state
    applyRTL: (styles: any) => {
      if (!currentIsRTL) return styles;
      
      const rtlStyles = { ...styles };
      
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
}

// Check if device supports RTL
export function isRTLSupported(): boolean {
  return I18nManager.isRTL;
}

// Simple background cache preload hook (keeping for compatibility)
export const useBackgroundCachePreload = () => {
  // This was used for cache preloading but can be simplified or removed
  return {};
}; 