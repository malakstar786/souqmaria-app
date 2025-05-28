import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@theme';
import { useRouter, Link } from 'expo-router';
import useCartStore from '../../store/cart-store';
import useAuthStore from '../../store/auth-store';
import useWishlistStore from '../../store/wishlist-store';
import AuthModal from '../../components/AuthModal';
import { useTranslation } from '../../utils/translations';
import { useRTL } from '../../utils/rtl';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { user, isLoggedIn } = useAuthStore();
  const { 
    cartItems, 
    totalAmount, 
    isLoading, 
    error, 
    fetchCartItems,
    removeCartItem,
    updateCartItemQty,
    clearError
  } = useCartStore();

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, name: string} | null>(null);
  
  // State for auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch cart items when screen loads
  useEffect(() => {
    fetchCartItems(user?.UserID || '');
  }, []);

  // Handle quantity update
  const handleUpdateQuantity = async (cartId: number, newQty: number) => {
    if (newQty < 1) return; // Don't allow quantities below 1
    
    const result = await updateCartItemQty(cartId, newQty);
    
    // Check for stock availability error
    if (!result && error === 'Stock not available for requested quantity') {
      Alert.alert(t('stock_not_available'), t('requested_quantity_not_available'));
      clearError(); // Clear error after showing alert
    } else if (!result && error) {
      // Handle other errors
      Alert.alert(t('error'), error || t('failed_to_update_quantity'));
      clearError(); // Clear error after showing alert
    }
  };

  // Handle item removal
  const handleRemoveItem = (cartId: number, productName: string) => {
    setItemToDelete({ id: cartId, name: productName });
    setShowDeleteModal(true);
  };

  // Confirm item deletion
  const confirmDelete = async () => {
    if (itemToDelete) {
      await removeCartItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = async (productCode: string) => {
    if (!user?.UserID) {
      Alert.alert(
        t('login_required'), 
        t('please_login_to_add_wishlist'), 
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('login'), onPress: () => setShowAuthModal(true) }
        ]
      );
      return;
    }
    
    try {
      const success = await useWishlistStore.getState().addToWishlist(productCode, user.UserID);
      if (success) {
        Alert.alert(t('success'), t('item_added_to_wishlist'));
      } else {
        Alert.alert(t('error'), t('failed_to_add_to_wishlist'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('unexpected_error'));
    }
  };

  // Empty cart component
  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <View style={styles.emptyCartContent}>
        <View style={styles.emptyCartIcon}>
          <FontAwesome name="shopping-cart" size={50} color={colors.blue} />
          <View style={styles.cartBadge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </View>
        <Text style={[styles.emptyCartText, { textAlign: 'center' }]}>{t('your_cart_is_empty')}</Text>
        <TouchableOpacity style={styles.addItemsButton} onPress={() => router.push('/(shop)')}>
          <View style={[styles.addButtonContent, { flexDirection }]}>
            <View style={[styles.addIcon, isRTL && { marginLeft: 8, marginRight: 0 }]}>
              <FontAwesome name="plus-circle" size={16} color={colors.white} />
            </View>
            <Text style={[styles.addButtonText, { textAlign: 'center' }]}>{t('add_items')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Cart item component
  const renderCartItem = (item: any) => (
    <View key={item.CartID} style={styles.cartItemContainer}>
      <View style={[styles.cartItemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.productImage, isRTL && { marginLeft: 16, marginRight: 0 }]}>
          {item.Image1 && (
            <Image 
              source={{ 
                uri: `https://erp.merpec.com/Upload/CompanyLogo/3044/${item.Image1}` 
              }} 
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { textAlign }]} numberOfLines={1}>
            {item.ProductName}
          </Text>
          <View style={[styles.priceContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            {item.Price !== item.SubTotal / item.Quantity && (
              <Text style={[styles.oldPrice, { textAlign }]}>{(item.SubTotal / item.Quantity).toFixed(2)} KD</Text>
            )}
            <Text style={[styles.price, { textAlign }]}>{item.Price.toFixed(2)} KD</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.actionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={() => handleAddToWishlist(item.ProductCode)}
        >
          <Text style={[styles.wishlistButtonText, { textAlign }]}>{t('add_to_wishlist_caps')}</Text>
        </TouchableOpacity>
        
        <View style={[styles.quantityControls, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.CartID, item.Quantity + 1)}
          >
            <FontAwesome name="plus" size={18} color={colors.white} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.Quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.CartID, item.Quantity - 1)}
            disabled={item.Quantity <= 1}
          >
            <FontAwesome name="minus" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.CartID, item.ProductName)}
        >
          <Text style={[styles.removeButtonText, { textAlign }]}>{t('remove_caps')}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardDivider} />
    </View>
  );

  // Cart summary and checkout
  const renderCartSummary = () => (
    <View style={[styles.summaryBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.totalContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.totalText, { textAlign }]}>{t('total_caps')} :</Text>
        <Text style={[
          styles.totalAmount, 
          { 
            marginLeft: isRTL ? 0 : 8, 
            marginRight: isRTL ? 8 : 0,
            textAlign 
          }
        ]}>
          {totalAmount.toFixed(2)} KD
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.checkoutButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} 
        onPress={() => router.push('/checkout')}
        disabled={!cartItems.length}
      >
        <Text style={[
          styles.checkoutButtonText, 
          { 
            marginLeft: isRTL ? 8 : 0, 
            marginRight: isRTL ? 0 : 8,
            textAlign 
          }
        ]}>
          {t('checkout_caps')}
        </Text>
        <FontAwesome 
          name={isRTL ? "arrow-circle-left" : "arrow-circle-right"} 
          size={20} 
          color={colors.white} 
        />
      </TouchableOpacity>
    </View>
  );

  // Loading indicator
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={[styles.header, { flexDirection }]}>
          <Text style={[styles.headerTitle, { textAlign }]}>{t('my_cart_title')}</Text>
        </View>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <Text style={[styles.headerTitle, { textAlign }]}>{t('my_cart_title')}</Text>
      </View>
      
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map(renderCartItem)}
          </ScrollView>
          {renderCartSummary()}
        </>
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
            <Text style={[styles.modalTitle, { textAlign: 'center' }]}>{t('remove_item_from_cart')}</Text>
            <Text style={[styles.modalSubtitle, { textAlign: 'center' }]} numberOfLines={2}>
              {itemToDelete?.name}
            </Text>
            
            <View style={[styles.modalButtons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('cancel').toUpperCase()}</Text>
              </TouchableOpacity>
              
              <View style={styles.modalDivider} />
              
              <TouchableOpacity 
                style={styles.modalConfirmButton} 
                onPress={confirmDelete}
              >
                <Text style={styles.modalConfirmText}>{t('yes_remove')}</Text>
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
    backgroundColor: colors.veryLightGray,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: Platform.OS === 'ios' ? 100 : 80,
  },
  emptyCartContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartIcon: {
    position: 'relative',
    marginBottom: 16,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.blue,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: 18,
    color: colors.black,
    marginBottom: 20,
  },
  addItemsButton: {
    backgroundColor: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    width: width * 0.8,
    maxWidth: 300,
  },
  addButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 10,
  },
  scrollContent: {
    paddingBottom: 20, // Space for checkout bar
  },
  cartItemContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 0,
    padding: 0,
  },
  cartItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    maxWidth: '100%',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  oldPrice: {
    fontSize: 12,
    color: colors.textGray,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.veryLightGray,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  wishlistButton: {
    padding: 4,
  },
  wishlistButtonText: {
    fontSize: 13,
    color: colors.black,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: colors.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    backgroundColor: colors.black,
    borderWidth: 0,
    borderColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 13,
    color: colors.red,
    fontWeight: 'bold',
  },
  cardDivider: {
    height: 0,
    backgroundColor: 'transparent',
  },
  summaryBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.blue,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  totalText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  checkoutButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'uppercase',
    marginRight: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: width * 0.85,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: colors.lightGray,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  modalConfirmText: {
    fontSize: 14,
    color: colors.red,
    fontWeight: 'bold',
  },
  modalDivider: {
    width: 1,
    backgroundColor: colors.lightGray,
  },
}); 