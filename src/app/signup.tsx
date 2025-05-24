import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth-store';
import { colors, spacing, radii } from '@theme';

interface SignupScreenProps {
  onSwitchToLogin?: () => void;
}

export default function SignupScreen({ onSwitchToLogin }: SignupScreenProps) {
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
  });
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  // Validate form fields
  const validateForm = () => {
    let valid = true;
    const errors = {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
    };
    
    // Name validation
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
      valid = false;
    }
    
    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Invalid email format';
      valid = false;
    }
    
    // Mobile validation
    if (!mobile.trim()) {
      errors.mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{8,16}$/.test(mobile.replace(/\D/g, ''))) {
      errors.mobile = 'Mobile number should be 8-16 digits';
      valid = false;
    }
    
    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };
  
  // Handle registration
  const handleSignup = async () => {
    // Clear previous errors
    clearError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Attempt registration
    const success = await register(fullName, email, mobile, password);
    
    if (success) {
      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [{ 
          text: 'OK', 
          onPress: () => {
            if (onSwitchToLogin) {
              // Used within auth modal, switch to login
              onSwitchToLogin();
            } else {
              // Used as standalone page, navigate back to checkout
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/checkout');
              }
            }
          }
        }]
      );
    }
  };
  
  // Show error from auth store if exists
  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Header for standalone usage */}
        {!onSwitchToLogin && (
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.canGoBack() ? router.back() : router.replace('/checkout')} 
              style={styles.backButton}
            >
              <FontAwesome name="arrow-left" size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign Up</Text>
            <View style={{ width: 20 }} />
          </View>
        )}
        
        <ScrollView style={styles.scrollContainer}>
        <View style={styles.googleSignUpContainer}>
          <Text style={styles.googleSignUpText}>Auto SIGN-UP using Google Email</Text>
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleIcon}>
              <FontAwesome name="google" size={20} color={colors.black} />
            </View>
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                formErrors.fullName ? styles.inputError : null
              ]}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            {formErrors.fullName ? (
              <Text style={styles.errorText}>{formErrors.fullName}</Text>
            ) : null}
          </View>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                formErrors.email ? styles.inputError : null
              ]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {formErrors.email ? (
              <Text style={styles.errorText}>{formErrors.email}</Text>
            ) : null}
          </View>
          
          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                formErrors.mobile ? styles.inputError : null
              ]}
              placeholder="Mobile"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            {formErrors.mobile ? (
              <Text style={styles.errorText}>{formErrors.mobile}</Text>
            ) : null}
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={[
              styles.passwordContainer,
              formErrors.password ? styles.inputError : null
            ]}>
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
            {formErrors.password ? (
              <Text style={styles.errorText}>{formErrors.password}</Text>
            ) : null}
          </View>
          
          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.signupButtonText}>Sign up</Text>
            )}
          </TouchableOpacity>
          
          {/* Login Link */}
          <TouchableOpacity 
            style={styles.loginContainer}
            onPress={onSwitchToLogin}
          >
            <Text style={styles.loginText}>Already have account? </Text>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  scrollContainer: {
    flex: 1,
  },
  googleSignUpContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  googleSignUpText: {
    fontSize: 16,
    color: colors.black,
    marginBottom: spacing.md,
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
    paddingHorizontal: spacing.lg,
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
  formContainer: {
    paddingHorizontal: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.md,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
  },
  eyeIcon: {
    padding: spacing.md,
  },
  signupButton: {
    backgroundColor: colors.blue,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signupButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  loginText: {
    fontSize: 16,
    color: colors.black,
  },
  loginLink: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: 'bold',
  },
}); 