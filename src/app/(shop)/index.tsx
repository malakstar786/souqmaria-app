import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      {/* Content for Home screen will go here */}
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