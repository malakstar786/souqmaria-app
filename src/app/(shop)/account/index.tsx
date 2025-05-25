import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/auth-store';
import useLanguageStore from '../../../store/language-store';
import AuthModal from '../../../components/AuthModal';
import { useTranslation } from '../../../utils/translations';
import { useRTL } from '../../../utils/rtl';
const preLoginAccountIcon = require('@assets/account_tab/pre_login.png');
const languageIcon = require('@assets/account_tab/language_icon.png');
const detailsIcon = require('@assets/account_tab/details_icon.png');
const addressIcon = require('@assets/account_tab/location_icon.png');
const ordersIcon = require('@assets/account_tab/orders_icon.png');
const wishlistIcon = require('@assets/account_tab/wishlist_icon.png');
const policiesIcon = require('@assets/account_tab/policies_icon.png');
const facebookIcon = require('@assets/account_tab/facebook_icon.png');
const tiktokIcon = require('@assets/account_tab/tiktok_icon.png');
const instagramIcon = require('@assets/account_tab/instagram_icon.png');
const whatsappIcon = require('@assets/account_tab/whatsapp_icon.png');


export default function AccountScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { currentLanguage } = useLanguageStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle language change
  const handleChangeLanguage = () => {
    router.push('/account/language');
  };

  // Handle login/register
  const handleLoginRegister = () => {
    setShowAuthModal(true);
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
      {/* Account Options */}
      <View style={styles.optionsContainer}>
        <AccountOption 
          label={t('my_details')} 
          onPress={() => handleOptionPress('/account/details')} 
          iconSource={detailsIcon} 
        />
        <AccountOption 
          label={t('my_address')} 
          onPress={() => handleOptionPress('/account/address')} 
          iconSource={addressIcon} 
        />
        <AccountOption 
          label={t('my_orders')} 
          onPress={() => handleOptionPress('/account/orders')} 
          iconSource={ordersIcon} 
        />
        <AccountOption 
          label={t('wishlist')} 
          onPress={() => handleOptionPress('/account/wishlist')} 
          iconSource={wishlistIcon} 
        />
        <AccountOption 
          label={t('policies')} 
          onPress={() => handleOptionPress('/account/policies')} 
          iconSource={policiesIcon} 
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('logout')}</Text>
      </TouchableOpacity>

      {/* Social Links */}
      <View style={styles.socialContainer}>
        <Text style={[styles.socialTitle, { textAlign: 'center' }]}>{t('follow_us')}</Text>
        <View style={[styles.socialIcons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61565804636382')}>
            <Image source={facebookIcon} style={styles.socialIconImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL('https://www.tiktok.com/@souqmaria2')}>
            <Image source={tiktokIcon} style={styles.socialIconImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL('https://www.instagram.com/souq.maria/?fbclid=IwZXh0bgNhZW0CMTEAAR1lDR7z4nWtp9V9GU04Oy0PmvIb2gYd2XtYwiA-S0JUpGnLtTheJs5QOF0_aem_fjNni9P5OS-AO52U4mgL8A')}>
            <Image source={instagramIcon} style={styles.socialIconImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL('https://wa.me/+96598900952')}>
            <Image source={whatsappIcon} style={styles.socialIconImage} />
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
          source={preLoginAccountIcon} 
          style={styles.illustrationImage} 
          resizeMode="contain" 
        />
        <Text style={styles.illustrationText}>
          {t('guest_shopping_experience')}
        </Text>
      </View>

      {/* Login/Register Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginRegister}>
        <Text style={styles.loginButtonText}>{t('login_register')}</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { textAlign }]}>{t('account_tab')}</Text>
      </View>

      {/* Language Selector */}
      <View style={[styles.languageRow, { flexDirection }]}>
        <View style={[styles.languageLeft, { flexDirection }]}>
          <Image source={languageIcon} style={[styles.languageIcon, isRTL && { marginLeft: 8, marginRight: 0 }]} />
          <Text style={[styles.languageLabel, { textAlign, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}>{t('language')}</Text>
          <Text style={[styles.tapToChange, { textAlign, marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }]} onPress={handleChangeLanguage}>
        {t('tap_to_change')}
          </Text>
        </View>
        <View style={[styles.languageRight, { flexDirection }]}>
          <TouchableOpacity style={[styles.languageRight, { flexDirection }]} onPress={handleChangeLanguage}>
            <Text style={[styles.currentLanguage, { textAlign, marginLeft: isRTL ? 4 : 0, marginRight: isRTL ? 0 : 4 }]}>{currentLanguage.name}</Text>
          </TouchableOpacity>  
        </View>
      </View>
      
      <View style={styles.divider} />

      {/* Account Content - Switch based on login state */}
      {isLoggedIn ? renderLoggedInView() : renderGuestView()}
      
      {/* Auth Modal */}
      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="login"
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    </ScrollView>
  );
}

// Account option component
function AccountOption({ label, onPress, iconSource }: { 
  label: string, 
  onPress: () => void,
  iconSource: any
}) {
  const { isRTL, flexDirection } = useRTL();
  
  return (
    <TouchableOpacity style={[styles.optionRow, { flexDirection }]} onPress={onPress}>
      <View style={[styles.optionLeft, { flexDirection }]}>
        <Image source={iconSource} style={[styles.optionIconImage, isRTL && { marginLeft: 16, marginRight: 0 }]} />
        <Text style={[styles.optionLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
      </View>
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
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  headerContainer: {
    paddingTop: 36,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'left',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: colors.white,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageLabel: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  languageRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguage: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  tapToChange: {
    color: colors.blue,
    fontSize: 13,
    marginLeft: 4,
    marginTop: 6.5,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 18,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 16,
  },
  illustrationImage: {
    width: 200,
    height: 200,
    marginBottom: 12,
    borderRadius: 0,
  },
  illustrationText: {
    color: colors.blue,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.black,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginBottom: 32,
    width: '80%',
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 0,
    marginBottom: 24,
    paddingVertical: 0,
    borderRadius: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    marginHorizontal: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 16,
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 32,
    width: '90%',
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  socialTitle: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    marginHorizontal: 12,
  },
  socialIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  languageIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 8,
  },
  optionIconImage: {
    width: 24,
    height: 24,
    marginRight: 16,
    resizeMode: 'contain',
  },
}); 