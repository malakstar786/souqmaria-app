import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useLanguageStore from '../store/language-store';
import { I18nManager, Text, View } from 'react-native';
import * as Updates from 'expo-updates';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { initializeLanguage, currentLanguage } = useLanguageStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize language from AsyncStorage
        await initializeLanguage();
        
        // Get fresh reference to current language after initialization
        const { currentLanguage } = useLanguageStore.getState();
        
        // Explicit RTL check as early as possible
        const shouldBeRTL = currentLanguage.code === 'ar';
        if (I18nManager.isRTL !== shouldBeRTL) {
          // Only force RTL if the current state doesn't match what it should be
          console.log(`🌐 Initial RTL mismatch: ${I18nManager.isRTL} vs expected ${shouldBeRTL}. Fixing...`);
          I18nManager.forceRTL(shouldBeRTL);
          
          // In development, log a message instead of forcing reload
          if (__DEV__) {
            console.log('Initial RTL setup: I18nManager state changed. Consider reloading if UI issues occur.');
          } else {
            // In production, reload to ensure layout is correct
            await Updates.reloadAsync();
            // Code after this won't execute due to reload
          }
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Still allow app to load
      }
    };

    initialize();
  }, [initializeLanguage]); // Only depends on initializeLanguage function

  // Show loading indicator while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
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
        <Stack.Screen name="products" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
} 