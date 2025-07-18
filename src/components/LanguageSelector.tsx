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
import { useRTL } from '../hooks';
import { useTranslation } from '../hooks';

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
  
  const { t } = useTranslation();
  const { isRTL, flexDirection, textAlign } = useRTL();
  const [showModal, setShowModal] = useState(false);

  const handleLanguageSelect = async (languageCode: 'en' | 'ar') => {
    try {
      // If it's the same language, just close the modal
      if (languageCode === currentLanguage.code) {
        setShowModal(false);
        return;
      }

      // Get language details for alert
      const selectedLanguage = LANGUAGES[languageCode];
      const currentIsRTL = currentLanguage.isRTL;
      const newIsRTL = selectedLanguage.isRTL;
      const isRTLChanging = currentIsRTL !== newIsRTL;
      
      // Show confirmation dialog
      Alert.alert(
        t('change_language'),
        isRTLChanging 
          ? `${t('change_language_confirmation')} ${selectedLanguage.name}? ${t('layout_will_change_immediately')}`
          : `${t('change_language_confirmation')} ${selectedLanguage.name}?`,
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('change'),
            onPress: async () => {
              // Close modal first
              setShowModal(false);
              
              if (isRTLChanging) {
                // Show loading alert for RTL changes
                Alert.alert(
                  t('please_wait'),
                  t('app_reloading_message'),
                  [],
                  { cancelable: false }
                );
              }
              
              // Change language (will trigger reload if RTL changes)
              await setLanguage(languageCode);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        t('error'),
        t('failed_to_change_language'),
        [{ text: t('ok'), onPress: clearError }]
      );
      setShowModal(false);
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
            <Text style={[styles.title, { textAlign }]}>{t('language')}</Text>
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
              <Text style={[styles.modalTitle, { textAlign }]}>{t('select_language')}</Text>
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
              {t('language_change_note')}
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
    marginVertical: spacing.xs,
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
  },
  selectedLanguageOption: {
    backgroundColor: colors.lightBlue,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedLanguageName: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  languageCode: {
    fontSize: 12,
    color: colors.textGray,
  },
  selectedLanguageCode: {
    color: colors.blue,
  },
  note: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 18,
  },
}); 