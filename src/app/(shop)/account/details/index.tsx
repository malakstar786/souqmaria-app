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
  Linking,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../../store/auth-store'; // Path relative to src/app/(shop)/account/details/
import { colors, spacing, radii } from '../../../../theme';
import { useTranslation } from '../../../../utils/translations';
import { useRTL } from '../../../../utils/rtl';
import { updateUserDetailsAPI } from '../../../../utils/api-service';
import { getDeviceIP } from '../../../../utils/ip-utils';

export default function AccountDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
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
      Alert.alert(t('update_failed'), errorUpdate, [{ text: t('ok'), onPress: clearUpdateError }]);
    }
  }, [errorUpdate, clearUpdateError, t]);

  const validateForm = () => {
    let isValid = true;
    const errors = { fullName: '', newPassword: '' };

    if (!editableFullName.trim()) {
      errors.fullName = t('full_name_required_error');
      isValid = false;
    }
    if (newPassword && newPassword.length < 8) {
      errors.newPassword = t('password_min_8_chars_error');
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
      Alert.alert(t('error'), t('user_data_not_available'));
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
        IpAddress: await getDeviceIP(),
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
      IpAddress: await getDeviceIP(),
      CompanyId: 3044, 
    };

    console.log('Sending update payload:', payload); // Debug log
    const success = await updateUserAccount(payload);
    if (success) {
      Alert.alert(t('success'), t('details_updated_successfully'));
      setIsEditing(false);
      setNewPassword('');
    }
  };

  // Handle password prompt modal submission
  const handlePromptPasswordSubmit = async () => {
    if (!pendingPayload) return;
    if (!promptedPassword) {
      Alert.alert(t('password_required_for_update'), t('enter_current_password_message'));
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
      Alert.alert(t('success'), t('details_updated_successfully'));
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

  const handleDeleteProfile = async () => {
    try {
      const url = 'https://example.com/delete-profile';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('error'), 'Unable to open link');
      }
    } catch (error) {
      Alert.alert(t('error'), 'Unable to open link');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { flexDirection }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('my_details')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { textAlign }]}>{t('please_login_to_view_details')}</Text>
        </View>
      </View>
    );
  }
  
  const renderDisplayField = (label: string, value: string | undefined | null) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { textAlign }]}>{label}</Text>
      <Text style={[styles.fieldValue, { textAlign }]}>{value || t('na')}</Text>
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
      <Text style={[styles.inputLabel, { textAlign }]}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, { textAlign }]}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={label === 'Full Name' ? 'words' : 'none'}
        textContentType={textContentType}
        autoComplete={autoCompleteType}
      />
      {error ? <Text style={[styles.errorText, { textAlign }]}>{error}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('my_details')}</Text>
        <View style={styles.placeholder} />
      </View>
      
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
              {renderDisplayField(t('full_name'), user.fullName)}
              {renderDisplayField(t('email'), user.email)}
              {renderDisplayField(t('mobile_number'), user.mobile)}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
                disabled={isLoadingUpdate} 
              >
                <FontAwesome name="pencil" size={16} color={colors.white} style={[marginEnd(spacing.sm)]} />
                <Text style={styles.editButtonText}>{t('edit_details')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteProfile}
                disabled={isLoadingUpdate}
              >
                <FontAwesome name="trash" size={16} color={colors.red} style={[marginEnd(spacing.sm)]} />
                <Text style={styles.deleteButtonText}>{t('delete_profile')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {renderEditableField(t('full_name'), editableFullName, setEditableFullName, t('enter_full_name'), formErrors.fullName, false, 'default', 'name', 'name')}
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { textAlign }]}>{t('email')}</Text>
                <Text style={[styles.readOnlyText, { textAlign }]}>{user.email}</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { textAlign }]}>{t('mobile_number')}</Text>
                <Text style={[styles.readOnlyText, { textAlign }]}>{user.mobile || t('na')}</Text>
              </View>

              {renderEditableField(t('new_password_optional'), newPassword, setNewPassword, t('enter_new_password'), formErrors.newPassword, true, 'default', 'newPassword', 'new-password')}
              
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
                      <FontAwesome name="save" size={16} color={colors.white} style={[marginEnd(spacing.sm)]}/>
                      <Text style={styles.actionButtonText}>{t('save_changes')}</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  disabled={isLoadingUpdate}
                >
                   <FontAwesome name="times" size={16} color={colors.blue} style={[marginEnd(spacing.sm)]}/>
                  <Text style={[styles.actionButtonText, styles.cancelButtonText]}>{t('cancel')}</Text>
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
              <Text style={{ fontSize: 16, marginBottom: 12, textAlign }}>{t('enter_current_password_to_update')}</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16, textAlign }}
                value={promptedPassword}
                onChangeText={setPromptedPassword}
                placeholder={t('current_password')}
                secureTextEntry
                autoFocus
              />
              <View style={{ flexDirection: flexDirection, justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setPromptPasswordModal(false)} style={[marginEnd(16)]}>
                  <Text style={{ color: '#00AEEF', fontWeight: 'bold' }}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePromptPasswordSubmit}>
                  <Text style={{ color: '#00AEEF', fontWeight: 'bold' }}>{t('submit')}</Text>
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
    paddingVertical: Platform.OS === 'ios' ? (48 - 16 * 1.5) / 2 + 1: (48 - 16 * 1.5) / 2 + 1, 
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  deleteButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.red,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  deleteButtonText: {
    color: colors.red,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 