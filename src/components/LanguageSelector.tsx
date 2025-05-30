import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useLanguageStore, { LANGUAGES, Language } from '../store/language-store';
import { colors, spacing, radii } from '@theme';
import { useRTL } from '../utils/rtl';

interface LanguageSelectorProps {
  style?: any;
}

export default function LanguageSelector({ style }: LanguageSelectorProps) {
  const { 
    currentLanguage, 
    isLoading, 
    error, 
    setLanguage, 
    clearError 
  } = useLanguageStore();
  
  const { isRTL, flexDirection, textAlign } = useRTL();
  const [showModal, setShowModal] = useState(false);

  const handleLanguageSelect = async (languageCode: 'en' | 'ar') => {
    try {
      const selectedLanguage = LANGUAGES[languageCode];
      const currentIsRTL = currentLanguage.isRTL;
      const newIsRTL = selectedLanguage.isRTL;
      const isRTLChanging = currentIsRTL !== newIsRTL;
      
      // Close modal immediately
      setShowModal(false);
      
      // Handle Android RTL changes differently
      if (Platform.OS === 'android' && isRTLChanging) {
        Alert.alert(
          'Language Change',
          `You are switching to ${selectedLanguage.name}. This will change the app layout direction and requires the app to restart to apply properly.`,
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Continue',
              onPress: async () => {
                await setLanguage(languageCode);
                // The language store will handle the restart prompt
              }
            }
          ]
        );
      } else {
        // For iOS or when no RTL change needed
        await setLanguage(languageCode);
        
        Alert.alert(
          'Language Changed',
          `Language changed to ${selectedLanguage.name}. The app content will now display in the selected language.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        'Error',
        'Failed to change language. Please try again.',
        [{ text: 'OK', onPress: clearError }]
      );
    }
  };

  const renderLanguageOption = (language: Language) => {
    const isSelected = currentLanguage.code === language.code;
    
    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageOption, 
          isSelected && styles.selectedLanguageOption,
          { flexDirection }
        ]}
        onPress={() => handleLanguageSelect(language.code)}
        disabled={isLoading}
      >
        <View style={[styles.languageInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[
            styles.languageName, 
            isSelected && styles.selectedLanguageName,
            { textAlign }
          ]}>
            {language.name}
          </Text>
          <Text style={[
            styles.languageCode, 
            isSelected && styles.selectedLanguageCode,
            { textAlign }
          ]}>
            {language.code.toUpperCase()}
          </Text>
        </View>
        
        {isSelected && (
          <FontAwesome name="check" size={16} color={colors.blue} />
        )}
        
        {isLoading && currentLanguage.code === language.code && (
          <ActivityIndicator size="small" color={colors.blue} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style, { flexDirection }]}
        onPress={() => setShowModal(true)}
        disabled={isLoading}
      >
        <View style={[styles.header, { flexDirection }]}>
          <FontAwesome 
            name="globe" 
            size={20} 
            color={colors.blue} 
            style={[styles.icon, isRTL ? { marginLeft: spacing.md } : { marginRight: spacing.md }]} 
          />
          <View style={[styles.textContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.title, { textAlign }]}>Language</Text>
            <Text style={[styles.subtitle, { textAlign }]}>{currentLanguage.name}</Text>
          </View>
        </View>
        <FontAwesome 
          name={isRTL ? "chevron-left" : "chevron-right"} 
          size={16} 
          color={colors.textGray} 
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.backdrop} />
          
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { flexDirection }]}>
              <Text style={[styles.modalTitle, { textAlign }]}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <FontAwesome name="times" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.languageList}>
              {Object.values(LANGUAGES).map(renderLanguageOption)}
            </View>
            
            <Text style={[styles.note, { textAlign }]}>
              Changing the language will update all content in the app to the selected language.
              {Platform.OS === 'android' && ' On Android, changing language direction may require an app restart.'}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textGray,
  },
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
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: spacing.sm,
  },
  languageList: {
    marginBottom: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  selectedLanguageOption: {
    borderColor: colors.blue,
    backgroundColor: colors.lightBlue,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selectedLanguageName: {
    color: colors.blue,
    fontWeight: '600',
  },
  languageCode: {
    fontSize: 12,
    color: colors.textGray,
    textTransform: 'uppercase',
  },
  selectedLanguageCode: {
    color: colors.blue,
  },
  note: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 16,
  },
}); 