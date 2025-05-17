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
        headerStyle: { backgroundColor: colors.lightBlue },
        headerTintColor: colors.black,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerTitle: 'Souq Maria', // As per PRD for Homepage Top Bar
          headerTitleAlign: 'center', // As per PRD for Homepage Logo centered
        }}
      />
      <Tabs.Screen
        name="search" // This will be our "Categories" tab as per PRD structure discussion
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="th-large" size={size} color={color} />
          ),
          headerTitle: 'Categories', // As per PRD for Categories Page Top Bar
          headerTitleAlign: 'left',
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
        }}
      />
    </Tabs>
  );
} 