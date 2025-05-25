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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useLanguageStore, { LANGUAGES, Language } from '../store/language-store';
import { colors, spacing, radii } from '@theme';

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
  
  const [showModal, setShowModal] = useState(false);

  const handleLanguageSelect = async (languageCode: 'en' | 'ar') => {
    try {
      await setLanguage(languageCode);
      setShowModal(false);
      
      // Show success message
      Alert.alert(
        'Language Changed',
        `Language changed to ${LANGUAGES[languageCode].name}. The app will now display content in the selected language.`,
        [{ text: 'OK' }]
      );
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
        style={[styles.languageOption, isSelected && styles.selectedLanguageOption]}
        onPress={() => handleLanguageSelect(language.code)}
        disabled={isLoading}
      >
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, isSelected && styles.selectedLanguageName]}>
            {language.name}
          </Text>
          <Text style={[styles.languageCode, isSelected && styles.selectedLanguageCode]}>
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
        style={[styles.container, style]}
        onPress={() => setShowModal(true)}
        disabled={isLoading}
      >
        <View style={styles.header}>
          <FontAwesome name="globe" size={20} color={colors.blue} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Language</Text>
            <Text style={styles.subtitle}>{currentLanguage.name}</Text>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={16} color={colors.textGray} />
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
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
            
            <Text style={styles.note}>
              Changing the language will update all content in the app to the selected language.
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