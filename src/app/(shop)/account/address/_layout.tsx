import { Stack } from 'expo-router';

export default function AddressLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "My Addresses",
          headerStyle: { backgroundColor: '#D9F4FF' },
          headerTintColor: '#00AEEF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false
        }}
      />
      <Stack.Screen
        name="add-shipping"
        options={{
          title: "Add Shipping Address",
          headerStyle: { backgroundColor: '#D9F4FF' },
          headerTintColor: '#00AEEF',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="add-billing"
        options={{
          title: "Add Billing Address",
          headerStyle: { backgroundColor: '#D9F4FF' },
          headerTintColor: '#00AEEF',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="edit-billing"
        options={{
          title: "Edit Billing Address",
          headerStyle: { backgroundColor: '#D9F4FF' },
          headerTintColor: '#00AEEF',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="edit-shipping"
        options={{
          title: "Edit Shipping Address",
          headerStyle: { backgroundColor: '#D9F4FF' },
          headerTintColor: '#00AEEF',
          headerShown: false
        }}
      />
    </Stack>
  );
} 