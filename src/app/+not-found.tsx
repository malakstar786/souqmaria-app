import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography, radii } from '@theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Page Not Found</Text>
      <Text style={styles.subtitle}>The page you are looking for does not exist.</Text>
      <Link href="/(shop)" style={styles.link}>
        <Text style={styles.linkText}>Go to Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  title: {
    // ...typography.h1, // Example: if h1 is defined in theme
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  subtitle: {
    // ...typography.body, // Example
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.blue,
    borderRadius: radii.md, // Assuming radii is defined in theme
  },
  linkText: {
    // ...typography.button, // Example
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
}); 