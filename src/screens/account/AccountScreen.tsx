import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TopBar from '@src/components/common/TopBar';
import colors from '@src/constants/colors';

// This is a mock implementation of the Account Tab (Guest / Pre-Login) as described in instructions.md
const AccountScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <TopBar title="Account" />
      
      {/* Language Selector */}
      <View style={styles.languageContainer}>
        <View style={styles.languageRow}>
          <Text style={styles.languageIcon}>🌐</Text>
          <Text style={styles.languageLabel}>Language</Text>
          <Text style={styles.languageValue}>English</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeLanguage}>Tap to change</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
      
      {/* Illustration + Text */}
      <View style={styles.illustrationContainer}>
        {/* Placeholder for illustration - in a real app, use an actual image */}
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationIcon}>🛍️</Text>
        </View>
        <Text style={styles.illustrationText}>
          To get the best experience of shopping you can
        </Text>
      </View>
      
      {/* Login/Register Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login / Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  languageContainer: {
    padding: 16,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    fontSize: 20,
    color: colors.black,
    marginRight: 8,
  },
  languageLabel: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },
  languageValue: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: '500',
  },
  changeLanguage: {
    fontSize: 14,
    color: colors.blue,
    textAlign: 'right',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginTop: 16,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  illustrationPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  illustrationIcon: {
    fontSize: 60,
  },
  illustrationText: {
    fontSize: 16,
    color: colors.blue,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.black,
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 80, // Extra space for the bottom tab navigator
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AccountScreen; 