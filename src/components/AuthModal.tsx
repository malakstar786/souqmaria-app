import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth-store';
import { colors, spacing, radii } from '../theme';
import { authenticateWithGoogle } from '../utils/google-auth';

const { height: screenHeight } = Dimensions.get('window');
const googleIcon = require('../assets/google_icon.png');

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  onSuccess?: () => void;
}

export default function AuthModal({ 
  isVisible, 
  onClose, 
  initialTab = 'login',
  onSuccess 
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { login, register, googleLogin, isLoading, error, clearError } = useAuthStore();
  
  // Add forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    userName: '',
    password: '',
    passwordVisible: false,
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    passwordVisible: false,
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    userName: '',
    password: '',
    fullName: '',
    email: '',
    mobile: '',
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      setActiveTab(initialTab);
      clearError();
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
      setFormErrors({
        userName: '',
        password: '',
        fullName: '',
        email: '',
        mobile: '',
      });
    }
  }, [isVisible, initialTab, clearError]);

  // Handle login
  const handleLogin = async () => {
    clearError();
    
    // Validate
    let valid = true;
    const errors = { ...formErrors };
    
    if (!loginData.userName.trim()) {
      errors.userName = 'Email/Mobile is required';
      valid = false;
    } else {
      errors.userName = '';
    }
    
    if (!loginData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else {
      errors.password = '';
    }
    
    setFormErrors(errors);
    if (!valid) return;

    const success = await login({ 
      userName: loginData.userName, 
      password: loginData.password 
    });
    
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  // Handle signup
  const handleSignup = async () => {
    clearError();
    
    // Validate
    let valid = true;
    const errors = { ...formErrors };
    
    if (!signupData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      valid = false;
    } else {
      errors.fullName = '';
    }
    
    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(signupData.email)) {
      errors.email = 'Invalid email format';
      valid = false;
    } else {
      errors.email = '';
    }
    
    if (!signupData.mobile.trim()) {
      errors.mobile = 'Mobile is required';
      valid = false;
    } else {
      errors.mobile = '';
    }
    
    if (!signupData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (signupData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      valid = false;
    } else {
      errors.password = '';
    }
    
    setFormErrors(errors);
    if (!valid) return;

    const success = await register(
      signupData.fullName,
      signupData.email,
      signupData.mobile,
      signupData.password
    );
    
    if (success) {
      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [{ 
          text: 'OK', 
          onPress: () => {
            onSuccess?.();
            onClose();
          }
        }]
      );
    }
  };

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    console.log('🔵 AuthModal: Starting Google authentication...');
    console.log('🔵 AuthModal: Active tab:', activeTab);
    console.log('🔵 AuthModal: Calling authenticateWithGoogle...');
    
    try {
      const result = await authenticateWithGoogle();
      console.log('🔵 AuthModal: Google auth result:', result);
      
      if (result.success && result.userInfo) {
        console.log('🔵 AuthModal: Google authentication successful, proceeding with login/registration...');
        
        // Always use googleLogin - it handles both login and registration automatically
        const success = await googleLogin(result.userInfo);
        console.log('🔵 AuthModal: Google authentication result:', success);
        
        if (success) {
          const message = activeTab === 'login' 
            ? 'You have been logged in successfully with Google!' 
            : 'Your account has been created successfully with Google!';
            
          Alert.alert(
            'Success',
            message,
            [{ 
              text: 'OK', 
              onPress: () => {
                console.log('🔵 AuthModal: Google authentication successful, closing modal');
                onSuccess?.();
                onClose();
              }
            }]
          );
        }
      } else {
        console.error('🔴 AuthModal: Google auth failed:', result.error);
        Alert.alert('Error', result.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('🔴 AuthModal: Google auth error:', error);
      Alert.alert('Error', 'Google authentication failed. Please try again.');
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(forgotPasswordEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsSendingResetEmail(true);
    
    try {
      // Here you would call your forgot password API
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      Alert.alert(
        'Reset Email Sent',
        'We have sent a password reset link to your email address. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowForgotPassword(false);
              setForgotPasswordEmail('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <Text style={styles.autoSignText}>Auto SIGN-IN using Google Email</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth} disabled={isLoading}>
        <View style={styles.googleIcon}>
          <Image source={googleIcon} style={styles.googleIcon} />
        </View>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
      
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, formErrors.userName ? styles.inputError : null]}
          placeholder="Email/Mobile"
          value={loginData.userName}
          onChangeText={(text) => setLoginData(prev => ({ ...prev, userName: text }))}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {formErrors.userName ? <Text style={styles.errorText}>{formErrors.userName}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, formErrors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={loginData.password}
            onChangeText={(text) => setLoginData(prev => ({ ...prev, password: text }))}
            secureTextEntry={!loginData.passwordVisible}
          />
          <TouchableOpacity 
            onPress={() => setLoginData(prev => ({ ...prev, passwordVisible: !prev.passwordVisible }))}
            style={styles.eyeIcon}
          >
            <FontAwesome
              name={loginData.passwordVisible ? 'eye-slash' : 'eye'}
              size={20}
              color={colors.textGray}
            />
          </TouchableOpacity>
        </View>
        {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}
      </View>

      <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setShowForgotPassword(true)}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.actionButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchContainer} onPress={() => setActiveTab('signup')}>
        <Text style={styles.switchText}>Create Account?</Text>
      </TouchableOpacity>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setShowForgotPassword(false)}
      >
        <FontAwesome name="arrow-left" size={20} color={colors.blue} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.forgotPasswordTitle}>Reset Your Password</Text>
      <Text style={styles.forgotPasswordDescription}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={forgotPasswordEmail}
          onChangeText={setForgotPasswordEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={handleForgotPassword}
        disabled={isSendingResetEmail}
      >
        {isSendingResetEmail ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.actionButtonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderSignupForm = () => (
    <>
      <Text style={styles.autoSignText}>Auto SIGN-UP using Google Email</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth} disabled={isLoading}>
        <View style={styles.googleIcon}>
          <Image source={googleIcon} style={styles.googleIcon} />
        </View>
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
      
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, formErrors.fullName ? styles.inputError : null]}
          placeholder="Full Name"
          value={signupData.fullName}
          onChangeText={(text) => setSignupData(prev => ({ ...prev, fullName: text }))}
          autoCapitalize="words"
        />
        {formErrors.fullName ? <Text style={styles.errorText}>{formErrors.fullName}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, formErrors.email ? styles.inputError : null]}
          placeholder="Email"
          value={signupData.email}
          onChangeText={(text) => setSignupData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {formErrors.email ? <Text style={styles.errorText}>{formErrors.email}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, formErrors.mobile ? styles.inputError : null]}
          placeholder="Mobile"
          value={signupData.mobile}
          onChangeText={(text) => setSignupData(prev => ({ ...prev, mobile: text }))}
          keyboardType="phone-pad"
        />
        {formErrors.mobile ? <Text style={styles.errorText}>{formErrors.mobile}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, formErrors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={signupData.password}
            onChangeText={(text) => setSignupData(prev => ({ ...prev, password: text }))}
            secureTextEntry={!signupData.passwordVisible}
          />
          <TouchableOpacity 
            onPress={() => setSignupData(prev => ({ ...prev, passwordVisible: !prev.passwordVisible }))}
            style={styles.eyeIcon}
          >
            <FontAwesome
              name={signupData.passwordVisible ? 'eye-slash' : 'eye'}
              size={20}
              color={colors.textGray}
            />
          </TouchableOpacity>
        </View>
        {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}
      </View>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.actionButtonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchContainer} onPress={() => setActiveTab('login')}>
        <Text style={styles.switchText}>Already have account? </Text>
        <Text style={styles.switchLink}>Login</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.backdrop} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
              onPress={() => setActiveTab('signup')}
            >
              <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {showForgotPassword ? renderForgotPasswordForm() : activeTab === 'login' ? renderLoginForm() : renderSignupForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.75,
    paddingTop: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  closeButton: {
    padding: spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.blue,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textGray,
  },
  activeTabText: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  autoSignText: {
    fontSize: 14,
    color: colors.black,
    marginBottom: spacing.md,
    textAlign: 'center',
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
    marginBottom: spacing.lg,
  },
  googleIcon: {
    marginRight: spacing.sm,
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
    color: colors.textGray,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.backgroundLight,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundLight,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.black,
  },
  eyeIcon: {
    padding: spacing.md,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.blue,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: colors.blue,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  switchText: {
    fontSize: 14,
    color: colors.black,
  },
  switchLink: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  backText: {
    color: colors.blue,
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  forgotPasswordTitle: {
    fontSize: 18,
    color: colors.black,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  forgotPasswordDescription: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: spacing.lg,
  },
}); 