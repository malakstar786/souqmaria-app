import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography } from '@theme';
import { useTranslation, useRTL } from '../../../hooks';

// Policy links
const POLICIES = [
  {
    id: 'about-us',
    titleKey: 'about_us',
    url: 'https://souqmaria.com/AboutUs'
  },
  {
    id: 'contact-us',
    titleKey: 'contact_us',
    url: 'https://souqmaria.com/ContactUs'
  },
  {
    id: 'terms-conditions',
    titleKey: 'terms_and_conditions',
    url: 'https://souqmaria.com/Terms-and-Conditions'
  },
  {
    id: 'privacy-return',
    titleKey: 'privacy_return_policy',
    url: 'https://souqmaria.com/Privacy-Return-Policy'
  }
];

export default function PoliciesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();

  // Navigate back to the account screen
  const handleBack = () => {
    router.back();
  };

  // Open link in browser
  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening URL: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign }]}>{t('policies_title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Policies list */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {POLICIES.map((policy) => (
          <TouchableOpacity
            key={policy.id}
            style={[styles.policyItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => handleOpenLink(policy.url)}
          >
            <Text style={[styles.policyTitle, { textAlign }]}>{t(policy.titleKey as any)}</Text>
            <FontAwesome name="external-link" size={18} color={colors.black} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 66 : 66,
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
    paddingLeft: 10,
  },
  placeholder: {
    width: 40, // Same width as backButton for balance
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  policyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.veryLightGray,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
}); 