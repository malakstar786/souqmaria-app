import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme';

export default function CategoriesScreen() {
  // This screen is named search.tsx to align with the example file structure,
  // but it will function as the 'Categories' tab.
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Categories Screen</Text>
      {/* Content for Categories screen will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 20,
    color: colors.black,
  },
}); 