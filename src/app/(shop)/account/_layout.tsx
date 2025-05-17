import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@theme';

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for nested screens by default, each screen can override this
      }}
    >
      <Stack.Screen
        name="index" // This is the main account screen 
        options={{
          headerShown: false,
        }}
      />
      {/* Details route will be automatically handled by the nested directory */}
    </Stack>
  );
} 