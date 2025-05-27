import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../../store/auth-store'; // Path relative to src/app/(shop)/account/details/
import { colors, spacing, radii } from '@theme'; 

export default function AccountDetailsScreen() {
  const router = useRouter();
  const { 
    user, 
    isLoadingUpdate, 
    errorUpdate,     
    updateUserAccount, 
    clearUpdateError 
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editableFullName, setEditableFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [promptPasswordModal, setPromptPasswordModal] = useState(false);
  const [promptedPassword, setPromptedPassword] = useState('');
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user?.fullName) {
      console.log('Setting fullName from user:', user.fullName); // Debug log
      setEditableFullName(user.fullName);
    } else {
      console.log('No fullName found in user data:', user); // Debug log
      setEditableFullName(''); 
    }
  }, [user?.fullName]);

  useEffect(() => {
    if (errorUpdate) {
      Alert.alert('Update Failed', errorUpdate, [{ text: 'OK', onPress: clearUpdateError }]);
    }
  }, [errorUpdate, clearUpdateError]);

  const validateForm = () => {
    let isValid = true;
    const errors = { fullName: '', newPassword: '' };

    if (!editableFullName.trim()) {
      errors.fullName = 'Full name is required.';
      isValid = false;
    }
    if (newPassword && newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters.';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSaveChanges = async () => {
    if (isLoadingUpdate) return;
    clearUpdateError();
    if (!validateForm()) {
      return;
    }

    if (!user || !user.UserID) { 
      console.log('Missing user data:', user); // Debug log
      Alert.alert('Error', 'User data is not available. Please log in again.');
      router.replace('/(shop)/account');
      return;
    }

    // Determine which password to use
    let passwordToSend = newPassword || user.password;
    if (!passwordToSend) {
      // Prompt user for their current password
      setPendingPayload({
        FullName: editableFullName.trim(),
        Email: user.email,
        Mobile: user.mobile || '',
        UserId: user.UserID,
        IpAddress: '127.0.0.1',
        CompanyId: 3044,
      });
      setPromptPasswordModal(true);
      return;
    }

    const payload = {
      FullName: editableFullName.trim(),
      Email: user.email, 
      Mobile: user.mobile || '', 
      Password: passwordToSend,
      UserId: user.UserID, 
      IpAddress: '127.0.0.1',
      CompanyId: 3044, 
    };

    console.log('Sending update payload:', payload); // Debug log
    const success = await updateUserAccount(payload);
    if (success) {
      Alert.alert('Success', 'Your details have been updated successfully!');
      setIsEditing(false);
      setNewPassword('');
    }
  };

  // Handle password prompt modal submission
  const handlePromptPasswordSubmit = async () => {
    if (!pendingPayload) return;
    if (!promptedPassword) {
      Alert.alert('Password Required', 'Please enter your current password.');
      return;
    }
    const payload = {
      ...pendingPayload,
      Password: promptedPassword,
    };
    setPromptPasswordModal(false);
    setPromptedPassword('');
    setPendingPayload(null);
    const success = await updateUserAccount(payload);
    if (success) {
      Alert.alert('Success', 'Your details have been updated successfully!');
      setIsEditing(false);
      setNewPassword('');
    }
  };

  const handleCancelEdit = () => {
    if (user?.fullName) {
      setEditableFullName(user.fullName);
    }
    setNewPassword('');
    setFormErrors({ fullName: '', newPassword: '' });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ 
          title: "My Details",
          headerStyle: { backgroundColor: '#D9F4FF' },
          headerTintColor: '#00AEEF',
          headerTitleStyle: { fontWeight: 'bold' }
        }} />
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Please login to view your details</Text>
        </View>
      </View>
    );
  }
  
  const renderDisplayField = (label: string, value: string | undefined | null) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || 'N/A'}</Text>
    </View>
  );

  const renderEditableField = (
    label: string, 
    value: string, 
    setter: (text: string) => void, 
    placeholder: string, 
    error: string | undefined,
    secureTextEntry = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
    textContentType?: 'name' | 'newPassword',
    autoCompleteType?: 'name' | 'new-password'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={label === 'Full Name' ? 'words' : 'none'}
        textContentType={textContentType}
        autoComplete={autoCompleteType}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ 
        title: "My Details",
        headerStyle: { backgroundColor: '#D9F4FF' },
        headerTintColor: '#00AEEF',
        headerTitleStyle: { fontWeight: 'bold' }
      }} />
      
      {isLoadingUpdate && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00AEEF" />
        </View>
      )}
      
      {errorUpdate && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorUpdate}</Text>
        </View>
      )}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.contentContainer}>
          {!isEditing ? (
            <>
              {renderDisplayField('Full Name', user.fullName)}
              {renderDisplayField('Email', user.email)}
              {renderDisplayField('Mobile Number', user.mobile)}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
                disabled={isLoadingUpdate} 
              >
                <FontAwesome name="pencil" size={16} color={colors.white} style={{marginRight: spacing.sm}} />
                <Text style={styles.editButtonText}>Edit Details</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {renderEditableField('Full Name', editableFullName, setEditableFullName, 'Enter your full name', formErrors.fullName, false, 'default', 'name', 'name')}
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <Text style={styles.readOnlyText}>{user.email}</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <Text style={styles.readOnlyText}>{user.mobile || 'N/A'}</Text>
              </View>

              {renderEditableField('New Password (optional)', newPassword, setNewPassword, 'Enter new password (min. 8 chars)', formErrors.newPassword, true, 'default', 'newPassword', 'new-password')}
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveChanges}
                  disabled={isLoadingUpdate}
                >
                  {isLoadingUpdate ? (
                    <ActivityIndicator color={colors.white} size="small"/>
                  ) : (
                    <>
                      <FontAwesome name="save" size={16} color={colors.white} style={{marginRight: spacing.sm}}/>
                      <Text style={styles.actionButtonText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  disabled={isLoadingUpdate}
                >
                   <FontAwesome name="times" size={16} color={colors.blue} style={{marginRight: spacing.sm}}/>
                  <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {/* Password Prompt Modal */}
      {promptPasswordModal && (
        <Modal
          visible={promptPasswordModal}
          transparent
          animationType="fade"
          onRequestClose={() => setPromptPasswordModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: '80%' }}>
              <Text style={{ fontSize: 16, marginBottom: 12 }}>Enter your current password to update your details:</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }}
                value={promptedPassword}
                onChangeText={setPromptedPassword}
                placeholder="Current Password"
                secureTextEntry
                autoFocus
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setPromptPasswordModal(false)} style={{ marginRight: 16 }}>
                  <Text style={{ color: '#00AEEF', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePromptPasswordSubmit}>
                  <Text style={{ color: '#00AEEF', fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  contentContainer: {
    padding: spacing.lg,
    // Add padding for status bar/header area if custom header is removed and navigator header is also hidden
    // This might need adjustment based on final header setup
    paddingTop: spacing.lg, 
  },
  fieldContainer: {
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightGray, 
    paddingBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textGray, 
    marginBottom: spacing.xs,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.black,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textGray, 
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray, 
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.white,
    height: 48,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.textGray, 
    paddingVertical: Platform.OS === 'ios' ? (48 - 16 * 1.5) / 2 + 1: (48 - 16) / 2, 
    paddingHorizontal: spacing.md,
    backgroundColor: colors.veryLightGray, 
    borderRadius: radii.md,
    height: 48,
    textAlignVertical: 'center',
  },
  editButton: {
    backgroundColor: colors.blue,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    marginTop: spacing.lg,
  },
  actionButton: {
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 48,
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.blue,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: colors.blue,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  errorContainer: {
    backgroundColor: '#FFEEEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666666',
  },
}); 