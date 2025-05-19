import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth-store';
import { colors, spacing, radii } from '../theme'; // Assuming your theme file is at src/theme.ts

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setFormError('');

    const result = await forgotPassword(email);
    if (result.success) {
      Alert.alert('Check Your Email', result.message, [{ text: 'OK', onPress: () => router.push('/auth') }]);
    } else {
      Alert.alert('Error', result.message || 'Failed to send password reset email.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={{ width: 24 }} /> {/*  Placeholder for centering title */}
      </View>

      <View style={styles.content}>
        <Text style={styles.instructions}>
          Enter your email address below and we'll send you a link to reset your password.
        </Text>
        <TextInput
          style={[styles.input, formError ? styles.inputError : null]}
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (formError) setFormError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          placeholderTextColor={colors.lightGray}
        />
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
        {error && !formError ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.submitButton} onPress={handleForgotPassword} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue, // Or your preferred header color
    paddingTop: Platform.OS === 'ios' ? 56 : 24, // Adjust for status bar
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue, // Or your preferred title color
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  instructions: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm, // Adjust padding for Android
    fontSize: 16,
    color: colors.black,
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: colors.blue, // Primary button color
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 