import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth-store';
import { colors, spacing, radii } from '@theme';
import SignupScreen from './signup';

// Login Form Component
const LoginFormComponent = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({ userName: '', password: '' });

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const validateForm = () => {
    let valid = true;
    const errors = { userName: '', password: '' };
    
    if (!userName.trim()) {
      errors.userName = 'Email or mobile number is required';
      valid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };

  const handleLogin = async () => {
    clearError();
    if (!validateForm()) return;

    console.log('Attempting login with:', { userName, password: '***' });
    const success = await login({ userName, password });
    console.log('Login result:', success);
    
    if (success) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(shop)/account');
      }
    }
  };

  useEffect(() => {
    if (error) {
      const message = typeof error === 'string' ? error : 'An unexpected error occurred.';
      Alert.alert('Login Failed', message, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  return (
    <ScrollView contentContainerStyle={styles.formScrollViewContainer}>
      <View style={styles.formContainer}>
        <View style={styles.googleSignUpContainer}>
          <Text style={styles.googleSignUpText}>Auto SIGN-IN using Google Email</Text>
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleIcon}>
              <FontAwesome name="google" size={20} color={colors.black} />
            </View>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, formErrors.userName ? styles.inputError : null]}
            placeholder="Email or Mobile Number"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {formErrors.userName ? <Text style={styles.errorText}>{formErrors.userName}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={[styles.passwordInputContainer, formErrors.password ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <View>
                <FontAwesome
                  name={passwordVisible ? 'eye-slash' : 'eye'}
                  size={20}
                  color={colors.lightGray}
                />
              </View>
            </TouchableOpacity>
          </View>
          {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.actionButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Main Auth Screen
const Auth = () => {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  
  const isLoginTab = tab === 'login';
  const isSignupTab = tab === 'signup';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{flex: 1}}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <View>
              <FontAwesome name="arrow-left" size={20} color={colors.black} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, isLoginTab && styles.activeTab]}
            onPress={() => setTab('login')}
          >
            <Text style={[styles.tabText, isLoginTab && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isSignupTab && styles.activeTab]}
            onPress={() => setTab('signup')}
          >
            <Text style={[styles.tabText, isSignupTab && styles.activeTabText]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {isLoginTab ? <LoginFormComponent /> : <SignupScreen onSwitchToLogin={() => setTab('login')} />}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.lightBlue,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
  },
  tabText: {
    fontSize: 16,
    color: colors.lightGray,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: colors.black,
  },
  tabContent: {
    flex: 1,
  },
  formScrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  googleSignUpContainer: {
    marginBottom: spacing.lg,
  },
  googleSignUpText: {
    fontSize: 16,
    color: colors.black,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    backgroundColor: colors.white,
  },
  googleIcon: {
    marginRight: spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    color: colors.black,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.lightGray,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    height: 48,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.md,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  eyeIcon: {
    padding: spacing.md,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.blue,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: colors.blue,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Auth; 