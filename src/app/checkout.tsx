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
import CheckoutAddressModal from '../components/CheckoutAddressModal';
import CheckoutAddressFormModal from '../components/CheckoutAddressFormModal';

const { width } = Dimensions.get('window');

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartItems, totalAmount, isLoading: cartLoading, refreshCartItems } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { billingAddresses, shippingAddresses, fetchUserAddresses } = useAddressStore();
  
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
  
  // Calculate correct total based on items in cart
  const correctTotalAmount = cartItems.reduce((total, item) => 
    total + (item.Price * item.Quantity), 0);
  
  // Constants for checkout calculations
  const shippingFee = 5.00;
  const discount = 0.00;
  const grandTotal = correctTotalAmount + shippingFee - discount;
  
  // Log for debugging
  useEffect(() => {
    console.log('Checkout - Cart Items:', cartItems.length);
    console.log('Checkout - CartStore totalAmount:', totalAmount);
    console.log('Checkout - Calculated correctTotalAmount:', correctTotalAmount);
    console.log('Checkout - Grand Total:', grandTotal);
    
    // Refresh cart totals on mount to ensure they're correct
    refreshCartItems();
  }, [cartItems]);
  
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
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    Alert.alert('Promo Code', `Promo code ${promoCode} applied!`);
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
    return `${address.fullName}\n${address.block}, ${address.street}, ${address.house}${address.apartment ? `, ${address.apartment}` : ''}\n${address.cityName}, ${address.stateName}, ${address.countryName}`;
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
  
  // Render cart items horizontally
  const renderCartItems = () => (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cartItemsContainer}
    >
      {cartItems.map((item) => (
        <View key={item.CartID} style={styles.cartItemCard}>
          <Image
            source={{ uri: `https://erp.merpec.com/Upload/CompanyLogo/3044/${item.Image1}` }}
            style={styles.cartItemImage}
            resizeMode="contain"
          />
          <View style={styles.cartItemDetails}>
            <Text style={styles.cartItemName} numberOfLines={2}>{item.ProductName}</Text>
            <Text style={styles.cartItemPrice}>{item.Price.toFixed(2)} KD</Text>
            <Text style={styles.cartItemQuantity}>x {item.Quantity}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleCloseModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Checkout</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Cart Items */}
            {cartLoading ? (
              <View style={styles.loadingContainer}>
                <Text>Loading cart items...</Text>
              </View>
            ) : cartItems.length > 0 ? (
              renderCartItems()
            ) : (
              <View style={styles.emptyCartContainer}>
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
              </View>
            )}
            
            {/* Billing Address Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionIconContainer}>
                <FontAwesome name="credit-card" size={20} color={colors.blue} />
                <Text style={styles.sectionTitle}>Billing Address</Text>
              </View>
              
              {isLoggedIn && selectedBillingAddress ? (
                <TouchableOpacity 
                  onPress={handleSelectBillingAddress} 
                  style={styles.addressDisplayContainer}
                >
                  <Text style={styles.addressText}>
                    {formatAddressForDisplay(selectedBillingAddress)}
                  </Text>
                  <FontAwesome name="angle-right" size={20} color={colors.black} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  onPress={handleSelectBillingAddress}
                  style={styles.addAddressButton}
                >
                  <Text style={styles.addAddressText}>+ Add Billing Address</Text>
                  <FontAwesome name="angle-right" size={20} color={colors.black} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Shipping Address Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionIconContainer}>
                <FontAwesome name="truck" size={20} color={colors.blue} />
                <Text style={styles.sectionTitle}>Shipping Address</Text>
              </View>
              
              {isLoggedIn && selectedShippingAddress ? (
                <TouchableOpacity 
                  onPress={handleSelectShippingAddress} 
                  style={styles.addressDisplayContainer}
                >
                  <Text style={styles.addressText}>
                    {formatAddressForDisplay(selectedShippingAddress)}
                  </Text>
                  <FontAwesome name="angle-right" size={20} color={colors.black} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  onPress={handleSelectShippingAddress}
                  style={styles.addAddressButton}
                >
                  <Text style={styles.addAddressText}>+ Add Shipping Address</Text>
                  <FontAwesome name="angle-right" size={20} color={colors.black} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Promo Code Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.promoHeaderContainer}>
                <View style={styles.sectionIconContainer}>
                  <FontAwesome name="tag" size={20} color={colors.blue} />
                  <Text style={styles.sectionTitle}>Have a Promo Code?</Text>
                </View>
                <TouchableOpacity onPress={handleSeePromoCodes}>
                  <Text style={styles.seePromoCodesText}>See Promo Codes</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.promoInputContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter Promo Code"
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <TouchableOpacity onPress={handleApplyPromoCode} style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Payment Type Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionIconContainer}>
                <FontAwesome name="credit-card" size={20} color={colors.blue} />
                <Text style={styles.sectionTitle}>Select Payment Type</Text>
              </View>
              
              <View style={styles.paymentTypeContainer}>
                <Text style={styles.paymentTypeText}>CASH</Text>
              </View>
            </View>
            
            {/* Order Summary */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionIconContainer}>
                <FontAwesome name="list-alt" size={20} color={colors.blue} />
                <Text style={styles.sectionTitle}>Order Summary</Text>
              </View>
              
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item Sub total</Text>
                  <Text style={styles.summaryValue}>{correctTotalAmount.toFixed(2)} KD</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping Fee</Text>
                  <Text style={styles.summaryValue}>{shippingFee.toFixed(2)} KD</Text>
                </View>
                
                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discountText]}>
                      -{discount.toFixed(2)} KD
                    </Text>
                  </View>
                )}
                
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>{grandTotal.toFixed(3)} KD</Text>
                </View>
              </View>
            </View>
            
            {/* Place Order Button */}
            <TouchableOpacity 
              style={styles.placeOrderButton} 
              onPress={handlePlaceOrder}
              disabled={cartItems.length === 0}
            >
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </TouchableOpacity>
            
            {/* Login Prompt for Guest Users */}
            {!isLoggedIn && (
              <View style={styles.loginPromptContainer}>
                <Text style={styles.loginPromptText}>Already have an account?</Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      
      {/* Billing Address Selection Modal */}
      <CheckoutAddressModal
        isVisible={showBillingAddressModal}
        onClose={() => setShowBillingAddressModal(false)}
        addressType="billing"
        onSelectAddress={handleBillingAddressSelected}
        onAddNewAddress={handleAddNewBillingAddress}
      />
      
      {/* Shipping Address Selection Modal */}
      <CheckoutAddressModal
        isVisible={showShippingAddressModal}
        onClose={() => setShowShippingAddressModal(false)}
        addressType="shipping"
        onSelectAddress={handleShippingAddressSelected}
        onAddNewAddress={handleAddNewShippingAddress}
      />
      
      {/* Add Billing Address Modal */}
      <CheckoutAddressFormModal
        isVisible={showAddBillingModal}
        onClose={() => setShowAddBillingModal(false)}
        addressType="billing"
        onSuccess={handleBillingAddressAdded}
      />
      
      {/* Add Shipping Address Modal */}
      <CheckoutAddressFormModal
        isVisible={showAddShippingModal}
        onClose={() => setShowAddShippingModal(false)}
        addressType="shipping"
        onSuccess={handleShippingAddressAdded}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: colors.lightBlue,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  cartItemsContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  cartItemCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    width: width / 2 - spacing.md * 1.5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  cartItemImage: {
    width: '100%',
    height: 120,
    marginBottom: spacing.sm,
    borderRadius: radii.sm,
  },
  cartItemDetails: {
    alignItems: 'center',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: spacing.xs,
  },
  cartItemQuantity: {
    fontSize: 12,
    color: colors.gray,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyCartContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: colors.gray,
  },
  sectionContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  sectionIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: spacing.sm,
  },
  addressDisplayContainer: {
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  addAddressButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  addAddressText: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: 'bold',
  },
  promoHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seePromoCodesText: {
    fontSize: 14,
    color: colors.blue,
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
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
  },
  applyButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  applyButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  paymentTypeContainer: {
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  paymentTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  summaryContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    padding: spacing.md,
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
  },
  discountText: {
    color: colors.red,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
  },
  placeOrderButton: {
    backgroundColor: colors.blue,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: radii.md,
    margin: spacing.md,
  },
  placeOrderButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  loginPromptText: {
    fontSize: 14,
    color: colors.black,
    marginRight: spacing.xs,
  },
  loginButtonText: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 