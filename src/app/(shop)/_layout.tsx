import React, { useEffect, useMemo } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ViewStyle, TextStyle } from 'react-native';
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
  const { currentLanguage } = useLanguageStore();
  
  // Initialize app on startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize cart unique ID
        const uniqueId = getUniqueId();
        
        // Start preloading critical data
        const userId = user?.UserID || user?.id || '';
        startDataPreloading(userId);
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };
    
    initializeApp();
  }, [getUniqueId, user]);
  
  // Memoize RTL-dependent values
  const layoutConfig = useMemo(() => {
    const currentIsRTL = isRTL();
    
    // Create tab screens
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
      orderedTabs,
      tabBarStyle,
      tabBarLabelStyle,
      tabBarItemStyle,
    };
  }, [currentLanguage.code, t]);
  
  return (
    <Tabs
      key={`tabs-${currentLanguage.code}`}
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: layoutConfig.tabBarStyle,
        tabBarLabelStyle: layoutConfig.tabBarLabelStyle,
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