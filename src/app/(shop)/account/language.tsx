import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { useRouter } from 'expo-router';
import useLanguageStore from '../../../store/language-store';
import useCategoryStore from '../../../store/category-store';
import useAllCategoryStore from '../../../store/all-category-store';
import useBannerStore from '../../../store/banner-store';
import useAdvertisementStore from '../../../store/advertisement-store';
import useMenuStore from '../../../store/menu-store';
import { apiCache } from '../../../utils/api-cache';
import { useTranslation, useRTL } from '../../../hooks';

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { currentLanguage, setLanguage } = useLanguageStore();
  
  // Get store actions to refresh data when language changes
  const { fetchCategories } = useCategoryStore();
  const { fetchAllCategories } = useAllCategoryStore();
  const { fetchBanners } = useBannerStore();
  const { fetchAdvertisements } = useAdvertisementStore();
  const { fetchMenuStructure } = useMenuStore();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  const handleLanguageChange = async (languageCode: 'en' | 'ar') => {
    if (languageCode === currentLanguage.code) {
      // Same language selected, just go back
      router.back();
      return;
    }

    // Get language details for alert
    const selectedLanguage = languages.find(l => l.code === languageCode);
    const currentIsRTL = currentLanguage.code === 'ar';
    const newIsRTL = languageCode === 'ar';
    const isRTLChanging = currentIsRTL !== newIsRTL;
      
    Alert.alert(
      t('change_language'),
      isRTLChanging 
        ? `${t('change_language_confirmation')} ${selectedLanguage?.name}?`
        : `${t('change_language_confirmation')} ${selectedLanguage?.name}?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('change'),
          onPress: async () => {
            try {
              // Before changing language, clear API cache
              apiCache.clearAll();
              
              if (isRTLChanging) {
                // Show loading alert for RTL changes
                Alert.alert(
                  t('please_wait'),
                  t('app_reloading_message'),
                  [],
                  { cancelable: false }
                );
              }
              
              // Set the language (this will reload the app if RTL changes)
              await setLanguage(languageCode);
              
              // If no reload happened (no RTL change), refresh data and navigate back
              if (!isRTLChanging) {
                // Refresh all data with new language
                await Promise.all([
                  fetchCategories(),
                  fetchAllCategories(),
                  fetchBanners(),
                  fetchAdvertisements(),
                  fetchMenuStructure(),
                ]);
                
                router.back();
              }
            } catch (error) {
              console.error('🌐 Error changing language:', error);
              Alert.alert(t('error'), t('failed_to_change_language'));
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('language')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Language Options */}
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { textAlign }]}>{t('select_language')}</Text>
        
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              currentLanguage.code === lang.code && styles.selectedLanguageOption,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}
            onPress={() => handleLanguageChange(lang.code as 'en' | 'ar')}
          >
            <View style={styles.languageInfo}>
              <Text style={[
                styles.languageName,
                currentLanguage.code === lang.code && styles.selectedLanguageName,
                { textAlign }
              ]}>
                {lang.name}
              </Text>
              <Text style={[
                styles.languageNativeName,
                currentLanguage.code === lang.code && styles.selectedLanguageNativeName,
                { textAlign }
              ]}>
                {lang.nativeName}
              </Text>
            </View>
            
            {currentLanguage.code === lang.code && (
              <FontAwesome 
                name="check" 
                size={20} 
                color={colors.blue} 
              />
            )}
          </TouchableOpacity>
        ))}
        
        <Text style={[styles.note, { textAlign }]}>
          {t('language_change_note')}
        </Text>
      </View>
    </SafeAreaView>
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
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 56 : 56,
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
    width: 40, // Same width as back button for centering
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: colors.blue,
  },
  languageNativeName: {
    fontSize: 14,
    color: colors.textGray,
  },
  selectedLanguageNativeName: {
    color: colors.blue,
  },
  note: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
}); 