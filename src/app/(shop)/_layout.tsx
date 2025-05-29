import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { I18nManager } from 'react-native';
import { colors } from '@theme';
import CartIcon from '../../components/CartIcon';
import useCartStore from '../../store/cart-store';
import useAuthStore from '../../store/auth-store';
import useLanguageStore from '../../store/language-store';
import { useTranslation } from '../../utils/translations';
import { startDataPreloading } from '../../utils/preloader';

export default function ShopLayout() {
  const { t } = useTranslation();
  const { getUniqueId } = useCartStore();
  const { user } = useAuthStore();
  const { currentLanguage, layoutVersion } = useLanguageStore();
  
  // Initialize unique ID and start preloading when app starts
  useEffect(() => {
    const uniqueId = getUniqueId();
    console.log('🆔 App initialized with unique ID:', uniqueId);
    
    // Start preloading critical data
    const userId = user?.UserID || user?.id || '';
    startDataPreloading(userId);
  }, [getUniqueId, user]);

  // Force re-render when language changes by including layoutVersion in dependency
  useEffect(() => {
    console.log('🌐 Layout updated for language:', currentLanguage.code, 'RTL:', currentLanguage.isRTL);
  }, [currentLanguage.code, currentLanguage.isRTL, layoutVersion]);
  
  // Determine tab order based on RTL
  const isRTL = currentLanguage.isRTL;
  
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
  const orderedTabs = isRTL ? [...tabScreens].reverse() : tabScreens;
  
  return (
    <Tabs
      key={`tabs-${currentLanguage.code}-${layoutVersion}`} // Force re-render on language change
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: { 
          backgroundColor: colors.white,
          // Apply RTL direction to tab bar
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
        tabBarLabelStyle: { 
          textTransform: 'uppercase', 
          fontSize: 10,
          textAlign: isRTL ? 'right' : 'left',
        },
        // Ensure tab bar respects RTL
        tabBarItemStyle: {
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      }}
    >
      {orderedTabs.map((tab) => (
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