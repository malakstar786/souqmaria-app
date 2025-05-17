import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = React.useState('English'); // Default or from state

  // Placeholder function, will navigate to language selection screen later
  const handleChangeLanguage = () => {
    // router.push('/account/language'); // Or modal
    console.log('Navigate to language selection');
  };

  // Placeholder function, will navigate to auth screen later
  const handleLoginRegister = () => {
    router.push('/auth'); // Assuming an auth screen at /auth
    console.log('Navigate to Login/Register');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Language Selector */}
      <TouchableOpacity style={styles.languageSelectorRow} onPress={handleChangeLanguage}>
        <View style={styles.languageSelectorContent}>
          <FontAwesome name="language" size={24} color={colors.black} />
          <Text style={styles.languageLabel}>Language</Text>
        </View>
        <View style={styles.languageSelectorContent}>
          <Text style={styles.currentLanguage}>{currentLanguage}</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.lightGray} />
        </View>
      </TouchableOpacity>
      <Text style={styles.tapToChange} onPress={handleChangeLanguage}>
        Tap to change
      </Text>
      <View style={styles.divider} />

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('@assets/pre_login_account.png')} 
          style={styles.illustrationImage} 
          resizeMode="contain" 
        />
        <Text style={styles.illustrationText}>
          To get the best experience of shopping you can
        </Text>
      </View>

      {/* Login/Register Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginRegister}>
        <Text style={styles.loginButtonText}>Login / Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  languageSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  languageSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 16,
    color: colors.black,
    marginLeft: spacing.md,
  },
  currentLanguage: {
    fontSize: 16,
    color: colors.blue,
    marginRight: spacing.sm,
  },
  tapToChange: {
    fontSize: 14,
    color: colors.blue,
    alignSelf: 'flex-start',
    marginLeft: spacing.md + 24 + spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.md,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  illustrationImage: {
    width: 200,
    height: 200,
    marginBottom: spacing.md,
  },
  illustrationText: {
    fontSize: 16,
    color: colors.blue,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: spacing.lg, 
  },
  loginButtonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
}); 