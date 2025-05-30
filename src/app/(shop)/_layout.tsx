import React, { useEffect, useMemo } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { I18nManager, Platform, ViewStyle, TextStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@theme';
import CartIcon from '../../components/CartIcon';
import useCartStore from '../../store/cart-store';
import useAuthStore from '../../store/auth-store';
import useLanguageStore from '../../store/language-store';
import { useTranslation } from '../../utils/translations';
import { startDataPreloading } from '../../utils/preloader';
import { isRTL } from '../../utils/rtl';

export default function ShopLayout() {
  const { t } = useTranslation();
  const { getUniqueId } = useCartStore();
  const { user } = useAuthStore();
  const { currentLanguage, layoutVersion, initializeLanguage, verifyRTLState } = useLanguageStore();
  
  // Initialize app on startup
  useEffect(() => {
    let mounted = true;
    
    const initializeApp = async () => {
      try {
        // Initialize language settings and RTL
        await initializeLanguage();
        
        // Only proceed if component is still mounted
        if (!mounted) return;
        
        // Initialize cart unique ID
        const uniqueId = getUniqueId();
        console.log('🆔 App initialized with unique ID:', uniqueId);
        
        // Start preloading critical data
        const userId = user?.UserID || user?.id || '';
        startDataPreloading(userId);
        
        console.log('🚀 App initialization completed');
      } catch (error) {
        console.error('🚀 App initialization error:', error);
      }
    };
    
    initializeApp();
    
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [getUniqueId, user, initializeLanguage]);

  // Handle Android RTL navigation issues by verifying state on focus
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        // Verify and restore RTL state when screen comes into focus
        verifyRTLState();
      }
    }, [verifyRTLState])
  );

  // Force re-render when language changes by including layoutVersion in dependency
  useEffect(() => {
    console.log('🌐 Layout updated for language:', {
      language: currentLanguage.code,
      isRTL: isRTL(),
      I18nManagerRTL: I18nManager.isRTL,
      layoutVersion,
      platform: Platform.OS
    });
  }, [currentLanguage.code, layoutVersion]);
  
  // Memoize RTL-dependent values to ensure proper updates
  const layoutConfig = useMemo(() => {
    const currentIsRTL = isRTL();
    
    // Create tab screens in the correct order for RTL
    const tabScreens = [
      {
        name: "index",
        title: t('home'),
        icon: "home"
      },
      {
        name: "categories",
        title: t('categories'),
        icon: "th-large"
      },
      {
        name: "cart",
        title: t('cart'),
        icon: "cart"
      },
      {
        name: "account",
        title: t('account_tab'),
        icon: "user"
      }
    ];

    // Reverse tab order for RTL
    const orderedTabs = currentIsRTL ? [...tabScreens].reverse() : tabScreens;
    
    const tabBarStyle: ViewStyle = {
      backgroundColor: colors.white,
      // Apply RTL direction to tab bar
      flexDirection: currentIsRTL ? 'row-reverse' : 'row',
    };
    
    const tabBarLabelStyle: TextStyle = {
      textTransform: 'uppercase',
      fontSize: 10,
      textAlign: currentIsRTL ? 'right' : 'left',
    };
    
    const tabBarItemStyle: ViewStyle = {
      flexDirection: currentIsRTL ? 'row-reverse' : 'row',
    };
    
    return {
      isRTL: currentIsRTL,
      orderedTabs,
      tabBarStyle,
      tabBarLabelStyle,
      tabBarItemStyle,
    };
  }, [currentLanguage.code, layoutVersion, t]);
  
  return (
    <Tabs
      key={`tabs-${currentLanguage.code}-${layoutVersion}`} // Force re-render on language change
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: layoutConfig.tabBarStyle,
        tabBarLabelStyle: layoutConfig.tabBarLabelStyle,
        // Ensure tab bar respects RTL
        tabBarItemStyle: layoutConfig.tabBarItemStyle,
      }}
    >
      {layoutConfig.orderedTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => {
              if (tab.name === 'cart') {
                return <CartIcon size={size} color={color} />;
              }
              return <FontAwesome name={tab.icon as any} size={size} color={color} />;
            },
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  );
} 