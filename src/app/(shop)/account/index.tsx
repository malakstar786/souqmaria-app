import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/auth-store';

// Define valid FontAwesome icon names
type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>['name'];

export default function AccountScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [currentLanguage, setCurrentLanguage] = React.useState('English'); // Default or from state

  // Handle language change
  const handleChangeLanguage = () => {
    router.push('/account/language');
  };

  // Handle login/register
  const handleLoginRegister = () => {
    router.push('/auth');
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            logout();
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Handle account options navigation
  const handleOptionPress = (path: string) => {
    router.push(path);
  };

  // Render account options when logged in
  const renderLoggedInView = () => (
    <>
      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={80} color={colors.lightGray} />
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Account Options */}
      <View style={styles.optionsContainer}>
        <AccountOption 
          icon="user" 
          label="My Details" 
          onPress={() => handleOptionPress('/account/details')} 
        />
        <AccountOption 
          icon="map-marker" 
          label="My Address" 
          onPress={() => handleOptionPress('/account/address')} 
        />
        <AccountOption 
          icon="shopping-basket" 
          label="My Orders" 
          onPress={() => handleOptionPress('/account/orders')} 
        />
        <AccountOption 
          icon="heart" 
          label="Wishlist" 
          onPress={() => handleOptionPress('/wishlist')} 
        />
        <AccountOption 
          icon="file-text" 
          label="Policies" 
          onPress={() => handleOptionPress('/policies')} 
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Social Links */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialTitle}>FOLLOW US</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="facebook" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="instagram" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="twitter" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // Render guest view
  const renderGuestView = () => (
    <>
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
    </>
  );

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

      {/* Account Content - Switch based on login state */}
      {isLoggedIn ? renderLoggedInView() : renderGuestView()}
    </ScrollView>
  );
}

// Account option component
function AccountOption({ 
  icon, 
  label, 
  onPress 
}: { 
  icon: FontAwesomeIconName, 
  label: string, 
  onPress: () => void 
}) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        <FontAwesome name={icon} size={20} color={colors.black} style={styles.optionIcon} />
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={colors.lightGray} />
    </TouchableOpacity>
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
  // Guest view styles
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
    marginTop: spacing.md,
  },
  loginButtonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  // Logged-in view styles
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textGray,
  },
  optionsContainer: {
    marginTop: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 24,
    textAlign: 'center',
    marginRight: spacing.md,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.black,
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  logoutButtonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    marginHorizontal: spacing.md,
  },
}); 