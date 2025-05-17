import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cart Screen</Text>
      {/* Content for Cart screen will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white, // Default white, will be veryLightGray for empty cart as per PRD
  },
  text: {
    fontSize: 20,
    color: colors.black,
  },
}); 