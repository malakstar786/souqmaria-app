import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Or any other icon library you prefer
import { colors } from '@theme';
import CartIcon from '../../components/CartIcon';
import useCartStore from '../../store/cart-store';

export default function ShopLayout() {
  const { getUniqueId } = useCartStore();
  
  // Initialize unique ID when app starts
  useEffect(() => {
    const uniqueId = getUniqueId();
    console.log('🆔 App initialized with unique ID:', uniqueId);
  }, [getUniqueId]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: { backgroundColor: colors.white },
        tabBarLabelStyle: { 
          textTransform: 'uppercase', 
          fontSize: 10, // Small font as per PRD
          // fontWeight: '500', // Adjust if needed for visual consistency
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown: false, // Hide default header for custom implementation
        }}
      />
      <Tabs.Screen
        name="categories" 
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="th-large" size={size} color={color} />
          ),
          headerShown: false, // Custom header is in categories.tsx (CategoriesScreen)
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <CartIcon size={size} color={color} />
          ),
          headerTitle: 'My Cart', // As per PRD for Cart Page Top Bar
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: colors.veryLightGray }, // Cart page has veryLightGray bg
          headerTintColor: colors.blue, // Title text in blue
          headerTitleStyle: { fontWeight: 'bold', color: colors.blue },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          headerTitle: 'Account', // As per PRD for Account Page Top Bar
          headerTitleAlign: 'left',
          headerShown: false,
        }}
      />
    </Tabs>
  );
} 