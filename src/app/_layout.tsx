import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useLanguageStore from '../store/language-store';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { initializeLanguage } = useLanguageStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeLanguage();
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Still allow app to load
      }
    };

    initialize();
  }, [initializeLanguage]);

  // Don't render anything until language is initialized
  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(shop)" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="thank-you" />
        <Stack.Screen name="product" />
        <Stack.Screen name="products" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
} 