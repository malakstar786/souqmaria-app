import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Or any other icon library you prefer
import { colors } from '@theme';

export default function ShopLayout() {
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
            <FontAwesome name="shopping-cart" size={size} color={color} />
          ),
          headerTitle: 'My Cart', // As per PRD for Cart Page Top Bar
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: colors.veryLightGray }, // Cart page has veryLightGray bg
          headerTintColor: colors.blue, // Title text in blue
          headerTitleStyle: { fontWeight: 'bold', color: colors.blue },
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