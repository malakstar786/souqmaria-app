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

// Policy links
const POLICIES = [
  {
    id: 'about-us',
    title: 'About Us',
    url: 'https://souqmaria.com/AboutUs'
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    url: 'https://souqmaria.com/ContactUs'
  },
  {
    id: 'terms-conditions',
    title: 'Terms & Conditions',
    url: 'https://souqmaria.com/Terms-and-Conditions'
  },
  {
    id: 'privacy-return',
    title: 'Privacy & Return Policy',
    url: 'https://souqmaria.com/Privacy-Return-Policy'
  }
];

export default function PoliciesScreen() {
  const router = useRouter();

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="chevron-left" size={18} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Policies</Text>
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
            style={styles.policyItem}
            onPress={() => handleOpenLink(policy.url)}
          >
            <Text style={styles.policyTitle}>{policy.title}</Text>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.lightBlue,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
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