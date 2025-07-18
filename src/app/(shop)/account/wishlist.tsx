import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  I18nManager,
  Image
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@theme';
import { useRouter } from 'expo-router';
import useAuthStore from '../../../store/auth-store';
import useWishlistStore from '../../../store/wishlist-store';
import AuthModal from '../../../components/AuthModal';
import { PRODUCT_IMAGE_BASE_URL } from '../../../utils/api-config';
import { useTranslation, useRTL } from '../../../hooks';

const { width } = Dimensions.get('window');

export default function WishlistScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { user, isLoggedIn } = useAuthStore();
  const { 
    items, 
    isLoading, 
    isRemoving,
    error, 
    fetchWishlistItems,
    removeFromWishlist 
  } = useWishlistStore();

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{itemCode: string, name: string} | null>(null);
  
  // State for auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch wishlist items when screen loads or login state changes
  useEffect(() => {
    if (isLoggedIn && user?.UserID) {
      fetchWishlistItems(user.UserID);
    }
  }, [isLoggedIn, user]);

  // Handle item removal
  const handleRemoveItem = (itemCode: string, itemName: string) => {
    setItemToDelete({ itemCode, name: itemName });
    setShowDeleteModal(true);
  };

  // Confirm item deletion
  const confirmDelete = async () => {
    if (itemToDelete && user?.UserID) {
      const success = await removeFromWishlist(itemToDelete.itemCode, user.UserID);
      if (success) {
        // Clear modal state
        setShowDeleteModal(false);
        setItemToDelete(null);
      } else {
        // Don't close modal if there was an error
        Alert.alert(t('error'), t('failed_to_remove_from_wishlist'));
      }
    }
  };

  // Handle product item press
  const handleProductPress = (productCode: string) => {
    router.push(`/product/${productCode}`);
  };

  // Render a wishlist item
  const renderWishlistItem = (item: any) => (
    <View style={styles.productCard} key={item.ItemCode}>
      <TouchableOpacity 
        style={styles.productContent}
        onPress={() => handleProductPress(item.ItemCode)}
        activeOpacity={0.7}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {item.ItemName}
          </Text>
          
          <View style={styles.priceContainer}>
            {item.OldPrice > 0 && item.OldPrice !== item.OnlineActualPrice && (
              <Text style={styles.oldPrice}>{item.OldPrice.toFixed(3)} KD</Text>
            )}
            <Text style={styles.price}>{item.OnlineActualPrice.toFixed(3)} KD</Text>
          </View>
        </View>
        
        <View style={styles.productImageContainer}>
          <Image
            source={{ 
              uri: item.ItemImage ? 
                `${PRODUCT_IMAGE_BASE_URL}${item.ItemImage}` : 
                'https://via.placeholder.com/100'
            }}
            style={styles.productImage}
            resizeMode="contain"
            defaultSource={require('@assets/empty_wishlist.png')}
          />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.ItemCode, item.ItemName)}
        disabled={isRemoving}
      >
        <Text style={styles.removeButtonText}>{t('remove_caps')}</Text>
      </TouchableOpacity>
    </View>
  );

  // Customize the error message for empty wishlist vs actual errors
  let errorMessage = error;
  if (error === 'Data not found.') {
    errorMessage = 'Your wishlist is empty';
  }

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { flexDirection }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('wishlist_title')}</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.emptyContainer}>
          <FontAwesome name="heart-o" size={60} color={colors.lightGray} />
          <Text style={[styles.emptyText, { textAlign }]}>{t('please_login_to_view_wishlist')}</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setShowAuthModal(true)}
          >
            <Text style={styles.loginButtonText}>{t('login_caps')}</Text>
          </TouchableOpacity>
        </View>

        {/* Auth Modal */}
        <AuthModal
          isVisible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialTab="login"
          onSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('wishlist_title')}</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )}
      
      {/* Error Message */}
      {!isLoading && error && error !== 'Data not found.' && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { textAlign }]}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => user?.UserID && fetchWishlistItems(user.UserID)}
          >
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Empty Wishlist - handles both success=0 and the specific "Data not found" error */}
      {!isLoading && (items.length === 0 || error === 'Data not found.') && (
        <View style={styles.emptyContainer}>
          <FontAwesome name="heart-o" size={60} color={colors.lightGray} />
          <Text style={[styles.emptyText, { textAlign }]}>{t('your_wishlist_is_empty')}</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.continueShoppingButtonText}>{t('continue_shopping_caps')}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Wishlist Items */}
      {!isLoading && !error && items.length > 0 && (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {items.map(item => renderWishlistItem(item))}
        </ScrollView>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { textAlign }]}>{t('remove_item')}</Text>
            <Text style={[styles.modalMessage, { textAlign }]}>
              {t('remove_item_confirmation')}{'\n'}
              <Text style={styles.modalItemName}>{itemToDelete?.name}</Text>{'\n'}
              {t('from_your_wishlist')}
            </Text>
            
            <View style={[styles.modalButtons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>{t('cancel').toUpperCase()}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>{t('remove_caps')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="login"
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />
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
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: colors.red,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  loginButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: radii.md,
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: radii.md,
  },
  continueShoppingButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  oldPrice: {
    fontSize: 14,
    color: colors.textGray,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.veryLightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    marginTop: spacing.sm,
  },
  removeButtonText: {
    color: colors.red,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: width * 0.85,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  modalItemName: {
    fontWeight: 'bold',
    color: colors.black,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: radii.md,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  cancelButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: colors.red,
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
}); 