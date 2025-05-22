import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
// Directly define theme constants since @theme import is not working correctly
const colors = {
  white: '#FFFFFF',
  lightBlue: '#E6F0FA',
  blue: '#0063B1',
  black: '#000000',
  lightGray: '#E0E0E0',
  veryLightGray: '#F5F5F5',
  gray: '#888888',
  red: '#FF0000',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};
import useCartStore from '../store/cart-store';
import useAuthStore from '../store/auth-store';
import useAddressStore, { Address } from '../store/address-store';
import usePromoStore from '../store/promo-store'; // Import the promo store
import CheckoutAddressModal from '../components/CheckoutAddressModal';
import CheckoutAddressFormModal from '../components/CheckoutAddressFormModal';

const { width, height } = Dimensions.get('window');

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartItems, totalAmount, isLoading: cartLoading, refreshCartItems } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { billingAddresses, shippingAddresses, fetchUserAddresses } = useAddressStore();
  const { 
    appliedPromoCode, 
    discountAmount, 
    isApplying, 
    isRemoving, 
    error: promoError, 
    success: promoSuccess,
    applyPromo,
    removePromo,
    clearError: clearPromoError
  } = usePromoStore();
  
  // State
  const [promoCode, setPromoCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address | null>(null);
  
  // State for address modals
  const [showBillingAddressModal, setShowBillingAddressModal] = useState(false);
  const [showShippingAddressModal, setShowShippingAddressModal] = useState(false);
  const [showAddBillingModal, setShowAddBillingModal] = useState(false);
  const [showAddShippingModal, setShowAddShippingModal] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  
  // Get uniqueId and BuyNow from local storage or params
  const uniqueId = params.uniqueId as string || useCartStore(state => state.uniqueId);
  const buyNow = ''; // Always empty since users can only checkout from cart now
  
  // Calculate correct total based on items in cart
  const correctTotalAmount = cartItems.reduce((total, item) => 
    total + (item.Price * item.Quantity), 0);
  
  // Constants for checkout calculations
  const shippingFee = 5.00;
  const discount = discountAmount || 0.00;
  const grandTotal = correctTotalAmount + shippingFee - discount;
  
  // Log for debugging
  useEffect(() => {
    console.log('Checkout - Cart Items:', cartItems.length);
    console.log('Checkout - CartStore totalAmount:', totalAmount);
    console.log('Checkout - Calculated correctTotalAmount:', correctTotalAmount);
    console.log('Checkout - Applied Promo Code:', appliedPromoCode);
    console.log('Checkout - Discount Amount:', discountAmount);
    console.log('Checkout - Grand Total:', grandTotal);
    
    // Refresh cart totals on mount to ensure they're correct
    refreshCartItems();
  }, [cartItems, appliedPromoCode, discountAmount]);
  
  // Fetch user addresses when component mounts
  useEffect(() => {
    if (isLoggedIn && user?.UserID) {
      fetchUserAddresses(user.UserID);
    }
  }, [isLoggedIn, user]);
  
  // Set default addresses when addresses are loaded
  useEffect(() => {
    if (billingAddresses.length > 0 && !selectedBillingAddress) {
      const defaultBillingAddress = billingAddresses.find(addr => addr.isDefault) || billingAddresses[0];
      setSelectedBillingAddress(defaultBillingAddress);
    }
    
    if (shippingAddresses.length > 0 && !selectedShippingAddress) {
      const defaultShippingAddress = shippingAddresses.find(addr => addr.isDefault) || shippingAddresses[0];
      setSelectedShippingAddress(defaultShippingAddress);
    }
  }, [billingAddresses, shippingAddresses]);
  
  // Close modal and cancel checkout
  const handleCloseModal = () => {
    setIsModalVisible(false);
    router.back();
  };
  
  // Apply promo code
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    
    const userId = user?.UserID || '';
    const result = await applyPromo(promoCode, userId, uniqueId, buyNow);
    
    if (result) {
      // Success - Promo code was applied
      // (No need for alert here as the UI will update to show the applied promo)
    } else if (promoError) {
      // Show error message
      Alert.alert('Error', promoError);
      clearPromoError();
    }
  };
  
  // Remove promo code
  const handleRemovePromoCode = async () => {
    if (!appliedPromoCode) return;
    
    const userId = user?.UserID || '';
    const result = await removePromo(appliedPromoCode, userId, uniqueId, buyNow);
    
    if (result) {
      // Success - Promo code was removed
      setPromoCode(''); // Clear the input field
    } else if (promoError) {
      // Show error message
      Alert.alert('Error', promoError);
      clearPromoError();
    }
  };
  
  // Navigate to see all promo codes
  const handleSeePromoCodes = () => {
    Alert.alert('Promo Codes', 'Promo codes feature coming soon');
  };
  
  // Show the billing address selection modal
  const handleSelectBillingAddress = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please login to add or select addresses',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: handleLogin }
        ]
      );
      return;
    }
    
    setShowBillingAddressModal(true);
  };
  
  // Show the shipping address selection modal
  const handleSelectShippingAddress = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please login to add or select addresses',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: handleLogin }
        ]
      );
      return;
    }
    
    setShowShippingAddressModal(true);
  };
  
  // Handle billing address selected from modal
  const handleBillingAddressSelected = (address: Address) => {
    setSelectedBillingAddress(address);
    setShowBillingAddressModal(false);
    
    // If shipping address is not yet selected, also use this as shipping
    if (!selectedShippingAddress && !useShippingAsBilling) {
      setSelectedShippingAddress(address);
    }
  };
  
  // Handle shipping address selected from modal
  const handleShippingAddressSelected = (address: Address) => {
    setSelectedShippingAddress(address);
    setShowShippingAddressModal(false);
  };
  
  // Show add new billing address modal
  const handleAddNewBillingAddress = () => {
    setShowBillingAddressModal(false);
    setShowAddBillingModal(true);
  };
  
  // Show add new shipping address modal
  const handleAddNewShippingAddress = () => {
    setShowShippingAddressModal(false);
    setShowAddShippingModal(true);
  };
  
  // Handle new billing address added
  const handleBillingAddressAdded = () => {
    if (user?.UserID) {
      fetchUserAddresses(user.UserID);
    }
    
    setShowAddBillingModal(false);
    
    // Will be handled in the parent component if Ship to Different Address was checked
  };
  
  // Handle new shipping address added
  const handleShippingAddressAdded = () => {
    if (user?.UserID) {
      fetchUserAddresses(user.UserID);
    }
    
    setShowAddShippingModal(false);
  };
  
  // Navigate to login screen
  const handleLogin = () => {
    setIsModalVisible(false);
    router.push('/auth');
  };
  
  // Format address for display
  const formatAddressForDisplay = (address: Address) => {
    if (!address) return '';
    
    // If there's a combined address field from the API, use it
    if (address.address) {
      return `${address.fullName}, ${address.mobile}, ${address.address}`;
    }
    
    // Otherwise build from individual fields
    return `${address.fullName}, ${address.mobile}, ${address.countryName}, ${address.stateName}, ${address.cityName}, ${address.block}, ${address.street}, ${address.house}${address.apartment ? `, ${address.apartment}` : ''}`;
  };
  
  // Place order
  const handlePlaceOrder = () => {
    if (!selectedBillingAddress) {
      Alert.alert('Error', 'Please add a billing address');
      return;
    }
    
    if (!selectedShippingAddress) {
      Alert.alert('Error', 'Please add a shipping address');
      return;
    }
    
    Alert.alert(
      'Place Order',
      'Your order will be placed. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', 'Order placed successfully!');
            router.replace('/(shop)');
          }
        }
      ]
    );
  };

  // Render cart items in horizontal scroll
  const renderCartItems = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cartItemsContainer}
    >
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItemCard}>
          <Image
            source={{ 
              uri: `https://erp.merpec.com/Upload/CompanyLogo/3044/${item.Image1 || 'placeholder.png'}` 
            }}
            style={styles.cartItemImage}
            resizeMode="contain"
          />
          <View style={styles.cartItemDetails}>
            <Text style={styles.cartItemName} numberOfLines={2}>{item.ProductName}</Text>
            <Text style={styles.cartItemQuantity}>x {item.Quantity} {item.Price.toFixed(2)} KD</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <>
      <ExpoStatusBar style="dark" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.container}>
          {/* Modal Content */}
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Checkout</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.scrollContent}>
              {/* Cart Items */}
              {renderCartItems()}
              
              {/* Address Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Address</Text>
                {isLoggedIn && selectedShippingAddress ? (
                  <TouchableOpacity 
                    style={styles.addressCard}
                    onPress={handleSelectShippingAddress}
                  >
                    <Text style={styles.addressText}>
                      {formatAddressForDisplay(selectedShippingAddress)}
                    </Text>
                    <FontAwesome name="angle-right" size={20} color={colors.gray} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.addAddressButton}
                    onPress={isLoggedIn ? handleSelectShippingAddress : handleLogin}
                  >
                    <Text style={styles.addAddressText}>
                      {isLoggedIn ? '+ Add Address' : 'Login to add address'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Promo Code Section */}
              <View style={styles.section}>
                <View style={styles.promoTitleRow}>
                  <Text style={styles.sectionTitle}>Have a Promo Code?</Text>
                  <TouchableOpacity onPress={handleSeePromoCodes}>
                    <Text style={styles.seePromoCodesText}>See Promo Codes</Text>
                  </TouchableOpacity>
                </View>
                
                {appliedPromoCode ? (
                  <View style={styles.appliedPromoContainer}>
                    <View style={styles.appliedPromoCode}>
                      <Text style={styles.appliedPromoText}>{appliedPromoCode}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.removePromoButton}
                      onPress={handleRemovePromoCode}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Text style={styles.removePromoText}>Remove</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.promoInputContainer}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Enter Promo Code"
                      value={promoCode}
                      onChangeText={setPromoCode}
                    />
                    <TouchableOpacity 
                      onPress={handleApplyPromoCode} 
                      style={styles.applyButton}
                      disabled={isApplying || !promoCode.trim()}
                    >
                      {isApplying ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Text style={styles.applyButtonText}>Apply</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              {/* Payment Type Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Payment Type</Text>
                <View style={styles.paymentTypeContainer}>
                  <Text style={styles.paymentOption}>CASH</Text>
                  <Image 
                    source={require('../assets/payment_methods.png')} 
                    style={styles.paymentMethodsImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              
              {/* Order Summary */}
              <View style={styles.section}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item Sub total</Text>
                  <Text style={styles.summaryValue}>{correctTotalAmount.toFixed(2)} KD</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={styles.summaryValue}>{discount.toFixed(2)} KD</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping Fee</Text>
                  <Text style={styles.summaryValue}>{shippingFee.toFixed(2)} KD</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.grandTotalLabel]}>Grand Total</Text>
                  <Text style={styles.grandTotalValue}>{grandTotal.toFixed(2)} KD</Text>
                </View>
              </View>
              
              {/* Create Account Checkbox (only for guest users) */}
              {!isLoggedIn && (
                <View style={styles.createAccountSection}>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.createAccountText}>Create an Account?</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Terms & Conditions */}
              <Text style={styles.termsText}>
                By proceeding, I've read and accept the terms & conditions.
              </Text>
              
              {/* Place Order Button */}
              <TouchableOpacity 
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
              >
                <Text style={styles.placeOrderButtonText}>Place Order</Text>
              </TouchableOpacity>
              
              {/* Login prompt for guest users */}
              {!isLoggedIn && (
                <View style={styles.loginPrompt}>
                  <Text style={styles.loginPromptText}>
                    Are you a returning customer? {' '}
                    <Text style={styles.loginPromptLink} onPress={handleLogin}>
                      Login Here
                    </Text>
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
        
        {/* Address selection modals */}
        <CheckoutAddressModal
          isVisible={showBillingAddressModal}
          onClose={() => setShowBillingAddressModal(false)}
          addressType="billing"
          onSelectAddress={handleBillingAddressSelected}
          onAddNewAddress={handleAddNewBillingAddress}
        />
        
        <CheckoutAddressModal
          isVisible={showShippingAddressModal}
          onClose={() => setShowShippingAddressModal(false)}
          addressType="shipping"
          onSelectAddress={handleShippingAddressSelected}
          onAddNewAddress={handleAddNewShippingAddress}
        />
        
        <CheckoutAddressFormModal
          isVisible={showAddBillingModal}
          onClose={() => setShowAddBillingModal(false)}
          addressType="billing"
          onSuccess={handleBillingAddressAdded}
        />
        
        <CheckoutAddressFormModal
          isVisible={showAddShippingModal}
          onClose={() => setShowAddShippingModal(false)}
          addressType="shipping"
          onSuccess={handleShippingAddressAdded}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
  },
  cartItemsContainer: {
    paddingVertical: spacing.md,
  },
  cartItemCard: {
    width: 120,
    marginRight: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
  },
  cartItemDetails: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  cartItemName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  cartItemQuantity: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.sm,
    color: colors.black,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
  },
  addAddressButton: {
    padding: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  addAddressText: {
    color: colors.blue,
    fontWeight: '500',
  },
  promoTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  seePromoCodesText: {
    color: colors.blue,
    fontSize: 14,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  applyButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  applyButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  appliedPromoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedPromoCode: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    justifyContent: 'center',
  },
  appliedPromoText: {
    color: colors.black,
  },
  removePromoButton: {
    backgroundColor: colors.red,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  removePromoText: {
    color: colors.white,
    fontWeight: '500',
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
  },
  paymentOption: {
    fontWeight: 'bold',
  },
  paymentMethodsImage: {
    height: 30,
    width: 150,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.black,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
  },
  grandTotalLabel: {
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: 'bold',
  },
  createAccountSection: {
    marginBottom: spacing.lg,
  },
  createAccountText: {
    color: colors.blue,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  placeOrderButton: {
    backgroundColor: colors.blue,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  placeOrderButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loginPromptText: {
    fontSize: 14,
    color: colors.black,
  },
  loginPromptLink: {
    color: colors.blue,
    fontWeight: '500',
  },
}); 