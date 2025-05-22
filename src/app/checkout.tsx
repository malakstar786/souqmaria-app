import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
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
import usePromoStore from '../store/promo-store';
import useCheckoutStore, { CheckoutAddress } from '../store/checkout-store';
import CheckoutAddressModal from '../components/CheckoutAddressModal';
import CheckoutAddressFormModal from '../components/CheckoutAddressFormModal';
import GuestCheckoutAddressForm from '../components/GuestCheckoutAddressForm';
import GuestCheckoutShippingForm from '../components/GuestCheckoutShippingForm';
import { 
  getPaymentModes, 
  saveCheckout,
  PaymentModeItem,
  SaveCheckoutParams,
  getDefaultBillingAddressByUserId, 
  getDefaultShippingAddressByUserId,
  getAllBillingAddressesByUserId,
  getAllShippingAddressesByUserId,
  ApiAddress
} from '../utils/api-service';
import { Address as StoreAddress } from '../store/address-store';
import PromoCodeModal from '../components/PromoCodeModal';
import ChangeAddressModal from '../components/ChangeAddressModal';

const { width, height } = Dimensions.get('window');

// Interfaces and types
interface PaymentMethod {
  PaymentModeCode: string;
  PaymentModeName: string;
}

// Add conversion helpers at the top
function addressToApiAddress(address: any): ApiAddress {
  return {
    BillingAddressId: address.id,
    ShippingAddressId: address.id,
    FullName: address.fullName,
    Email: address.email,
    Mobile: address.mobile,
    Address: address.address || '',
    Address2: address.address2 || '',
    Country: address.country || '',
    State: address.state || '',
    City: address.city || '',
    Block: address.block || '',
    Street: address.street || '',
    House: address.house || '',
    Apartment: address.apartment || '',
    IsDefault: address.isDefault ?? false,
  };
}

function apiAddressToAddress(api: ApiAddress): any {
  return {
    id: api.BillingAddressId || api.ShippingAddressId || 0,
    fullName: api.FullName,
    email: api.Email,
    mobile: api.Mobile,
    address2: api.Address2 || '',
    address: api.Address || '',
    country: api.Country || '',
    state: api.State || '',
    city: api.City || '',
    block: api.Block || '',
    street: api.Street || '',
    house: api.House || '',
    apartment: api.Apartment || '',
    isDefault: typeof api.IsDefault === 'boolean' ? api.IsDefault : !!api.IsDefault,
  };
}

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartItems, totalAmount, isLoading: cartLoading, refreshCartItems } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { billingAddresses, shippingAddresses, fetchUserAddresses } = useAddressStore();
  const promoStore = usePromoStore();
  const {
    billingAddress: guestBillingAddress,
    shippingAddress: guestShippingAddress,
    guestTrackId,
    currentStep,
    setCurrentStep,
    billingAddressId: guestBillingAddressId,
    shippingAddressId: guestShippingAddressId,
    isLoading: checkoutLoading,
    fetchDefaultAddresses: fetchCheckoutDefaultAddresses,
    fetchAllAddresses: fetchCheckoutAllAddresses,
    billingAddresses: checkoutBillingAddresses,
    shippingAddresses: checkoutShippingAddresses,
    selectedBillingAddressId,
    selectedShippingAddressId,
    setSelectedBillingAddressId,
    setSelectedShippingAddressId,
  } = useCheckoutStore();
  
  // State
  const [promoCode, setPromoCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<ApiAddress | null>(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<ApiAddress | null>(null);
  
  // State for address modals
  const [showBillingAddressModal, setShowBillingAddressModal] = useState(false);
  const [showShippingAddressModal, setShowShippingAddressModal] = useState(false);
  const [showAddBillingModal, setShowAddBillingModal] = useState(false);
  const [showAddShippingModal, setShowAddShippingModal] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  
  // State for guest checkout flow
  const [showGuestBillingForm, setShowGuestBillingForm] = useState(false);
  const [showGuestShippingForm, setShowGuestShippingForm] = useState(false);
  
  // Add state for "Create an Account" checkbox
  const [createAccount, setCreateAccount] = useState(false);
  
  // Add state for terms and conditions
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Add state for PromoCodeModal
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  
  // Add state for applying promo codes
  const [isPromoApplying, setIsPromoApplying] = useState(false);
  const [isPromoRemoving, setIsPromoRemoving] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // Get uniqueId and BuyNow from local storage or params
  const uniqueId = params.uniqueId as string || useCartStore(state => state.uniqueId);
  const buyNow = ''; // Always empty since users can only checkout from cart now
  
  // Calculate correct total based on items in cart
  const correctTotalAmount = cartItems.reduce((total, item) => 
    total + (item.Price * (item.Quantity || 1)), 0);
  
  // Constants for checkout calculations
  const shippingFee = 5.00;
  const discount = promoDiscount || 0.00;
  const grandTotal = correctTotalAmount + shippingFee - discount;
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentModeItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentModeItem | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlacedTrackId, setOrderPlacedTrackId] = useState<string | null>(null);
  
  // State for address management
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState<ApiAddress | null>(null);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState<ApiAddress | null>(null);
  const [loggedInUserBillingAddresses, setLoggedInUserBillingAddresses] = useState<ApiAddress[]>([]);
  const [loggedInUserShippingAddresses, setLoggedInUserShippingAddresses] = useState<ApiAddress[]>([]);
  const [showChangeBillingModal, setShowChangeBillingModal] = useState(false);
  const [showChangeShippingModal, setShowChangeShippingModal] = useState(false);
  
  // Add useEffect to fetch addresses for logged-in users
  useEffect(() => {
    if (isLoggedIn && user && user.UserID) {
      // Fetch default addresses first for immediate display
      fetchCheckoutDefaultAddresses(user.UserID);
      
      // Fetch all addresses for the selection modals
      fetchCheckoutAllAddresses(user.UserID);
    }
  }, [isLoggedIn, user]);
  
  // Determine if we need to show the guest checkout form initially
  useEffect(() => {
    if (!isLoggedIn && cartItems.length > 0) {
      // Don't immediately show the guest checkout form
      // Let the user see the main checkout page first, as per guest_checkout.png
      setShowGuestBillingForm(false);
    }
  }, [isLoggedIn, cartItems.length]);
  
  // Log for debugging
  useEffect(() => {
    console.log('Checkout - Cart Items:', cartItems.length);
    console.log('Checkout - CartStore totalAmount:', totalAmount);
    console.log('Checkout - Calculated correctTotalAmount:', correctTotalAmount);
    console.log('Checkout - Applied Promo Code:', appliedPromo);
    console.log('Checkout - Discount Amount:', promoDiscount);
    console.log('Checkout - Grand Total:', grandTotal);
    console.log('Checkout - Is Logged In:', isLoggedIn);
    console.log('Checkout - Guest Track ID:', guestTrackId);
    
    // Refresh cart totals on mount to ensure they're correct
    refreshCartItems();
  }, [cartItems, appliedPromo, promoDiscount, isLoggedIn, guestTrackId]);
  
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
      setSelectedBillingAddress(addressToApiAddress(defaultBillingAddress));
    }
    
    if (shippingAddresses.length > 0 && !selectedShippingAddress) {
      const defaultShippingAddress = shippingAddresses.find(addr => addr.isDefault) || shippingAddresses[0];
      setSelectedShippingAddress(addressToApiAddress(defaultShippingAddress));
    }
  }, [billingAddresses, shippingAddresses]);
  
  // Fetch payment methods when the component mounts
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  
  // Function to fetch payment methods
  const fetchPaymentMethods = async () => {
    setIsLoadingPaymentMethods(true);
    try {
      const response = await getPaymentModes();
      if (response.Data?.success === 1 && response.Data.row) {
        setPaymentMethods(response.Data.row);
        if (response.Data.row.length > 0) {
          setSelectedPaymentMethod(response.Data.row[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };
  
  // Close modal and cancel checkout
  const handleCloseModal = () => {
    setIsModalVisible(false);
    router.back();
  };
  
  // Update handleApplyPromoCode function to correctly use the selected promo code
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    
    // Get the user ID if logged in, empty string if guest
    const userId = user?.UserID || '';
    
    try {
      setIsPromoApplying(true);
      const result = await promoStore.applyPromo(promoCode, userId, uniqueId, buyNow);
      
      if (result) {
        // Success - Promo code was applied
        setAppliedPromo(promoCode);
        // Update the discount in the UI based on the response
        setPromoDiscount(promoStore.discountAmount);
        Alert.alert('Success', 'Promo code applied successfully');
      } else if (promoStore.promoError) {
        // Show error message
        Alert.alert('Error', promoStore.promoError);
        promoStore.clearPromoError();
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'Failed to apply promo code. Please try again.');
    } finally {
      setIsPromoApplying(false);
    }
  };
  
  // Remove promo code
  const handleRemovePromoCode = async () => {
    if (!appliedPromo) return;
    
    const userId = user?.UserID || '';
    setIsPromoRemoving(true);
    
    try {
      const result = await promoStore.removePromo(userId, uniqueId, buyNow);
      
      if (result) {
        // Success - Promo code was removed
        setPromoCode(''); // Clear the input field
        setAppliedPromo(null);
        setPromoDiscount(0);
      } else if (promoStore.promoError) {
        // Show error message
        Alert.alert('Error', promoStore.promoError);
        promoStore.clearPromoError();
      }
    } catch (error) {
      console.error('Error removing promo code:', error);
      Alert.alert('Error', 'Failed to remove promo code. Please try again.');
    } finally {
      setIsPromoRemoving(false);
    }
  };
  
  // Navigate to see all promo codes
  const handleSeePromoCodes = () => {
    setShowPromoCodeModal(true);
  };
  
  // Add function to handle promo code selection from modal
  const handleSelectPromoCode = (code: string) => {
    setPromoCode(code);
    handleApplyPromoCode(); // Auto apply the selected code
  };
  
  // Handle guest billing address submission
  const handleGuestBillingComplete = (shipToDifferentAddress: boolean) => {
    setShowGuestBillingForm(false);
    
    if (shipToDifferentAddress) {
      // Show shipping address form
      setShowGuestShippingForm(true);
    } else {
      // Continue to payment
      setCurrentStep('payment');
    }
  };
  
  // Handle guest shipping address submission
  const handleGuestShippingComplete = () => {
    setShowGuestShippingForm(false);
    // Continue to payment
    setCurrentStep('payment');
  };
  
  // Show the billing address selection modal for logged-in users
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
  
  // Show the shipping address selection modal for logged-in users
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
  const handleBillingAddressSelected = (address: any) => {
    setSelectedBillingAddress(addressToApiAddress(address));
    setShowBillingAddressModal(false);
  };
  
  // Handle shipping address selected from modal
  const handleShippingAddressSelected = (address: any) => {
    setSelectedShippingAddress(addressToApiAddress(address));
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
    router.push('/auth');
  };
  
  // Format address for display
  const formatAddressForDisplay = (address: Address) => {
    return `${address.fullName}, ${address.mobile}\n${address.block}, ${address.street}, ${address.house}${address.apartment ? ', ' + address.apartment : ''}\n${address.city}, ${address.state}, ${address.country}`;
  };
  
  // Function to handle address selection callbacks
  const handleChangeBillingAddress = (address: ApiAddress) => {
    setDefaultBillingAddress(address);
    setShowChangeBillingModal(false);
  };

  const handleChangeShippingAddress = (address: ApiAddress) => {
    setDefaultShippingAddress(address);
    setShowChangeShippingModal(false);
  };

  // Update handlePlaceOrder function to correctly use the API for guest users
  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method to continue');
      return;
    }
    
    // Validate addresses based on user type
    if (isLoggedIn) {
      if (!selectedBillingAddressId) {
        Alert.alert('Billing Address Required', 'Please select or add a billing address');
        return;
      }
    } else {
      // Guest user flow
      if (!guestBillingAddress) {
        Alert.alert('Billing Address Required', 'Please add your billing address');
        return;
      }
      
      // Check if shipping is needed and present
      const differentShippingAddress = currentStep === 'shipping';
      if (differentShippingAddress && !guestShippingAddress) {
        Alert.alert('Shipping Address Required', 'Please add your shipping address');
        return;
      }
    }
    
    if (!acceptTerms) {
      Alert.alert('Terms & Conditions', 'Please accept the terms and conditions to continue');
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      // Get the user ID or guest track ID
      const userId = isLoggedIn ? (user?.UserID || '') : guestTrackId || '';
      
      // Get cart unique ID
      const cartUniqueId = typeof params?.uniqueId === 'string' ? params.uniqueId : useCartStore.getState().uniqueId;
      
      if (!userId) {
        Alert.alert('Error', 'User ID or guest track ID is missing. Please try again.');
        setIsPlacingOrder(false);
        return;
      }
      
      // Set address IDs and shipping flag based on user type
      let billingAddressId = 0;
      let shippingAddressId = 0;
      let differentAddress = false;
      
      if (isLoggedIn) {
        // Logged-in user - use selected address IDs from checkout store
        const { selectedBillingAddressId, selectedShippingAddressId } = useCheckoutStore.getState();
        
        billingAddressId = selectedBillingAddressId || (defaultBillingAddress?.BillingAddressId || 0);
        
        // Check if using different shipping address
        differentAddress = !!(selectedShippingAddressId && selectedShippingAddressId !== selectedBillingAddressId);
        
        shippingAddressId = differentAddress ? (selectedShippingAddressId || 0) : 0;
      } else {
        // Guest user - use address IDs from checkout store
        billingAddressId = guestBillingAddressId;
        differentAddress = !!(guestShippingAddress);
        shippingAddressId = differentAddress ? guestShippingAddressId : 0;
      }
      
      // Create checkout parameters
      const checkoutParams: SaveCheckoutParams = {
        UserID: userId,
        IpAddress: '127.0.0.1',
        UniqueId: cartUniqueId,
        Company: 3044,
        CultureId: 1,
        BuyNow: '',
        Location: '304401HO',
        DifferentAddress: differentAddress,
        BillingAddressId: billingAddressId,
        PaymentMode: selectedPaymentMethod.XCode,
        Source: Platform.OS === 'ios' ? 'iOS' : 'Android',
        Salesman: '3044SMOL',
        CreateAccount: !isLoggedIn && createAccount ? 1 : 0
      };
      
      // For guest users with different shipping address, add country/state/city codes
      if (!isLoggedIn && differentAddress && guestShippingAddress) {
        checkoutParams.SCountry = guestShippingAddress.country?.XCode.toString() || '';
        checkoutParams.SState = guestShippingAddress.state?.XCode.toString() || '';
        checkoutParams.SCity = guestShippingAddress.city?.XCode.toString() || '';
      }
      
      console.log('Placing order with params:', JSON.stringify(checkoutParams, null, 2));
      
      // Call the checkout API
      const response = await saveCheckout(checkoutParams);
      
      if (response.ResponseCode === '2' || response.ResponseCode === 2) {
        // Successful order placement
        setOrderPlacedTrackId(response.TrackId || null);
        
        // Navigate to thank you page
        if (response.TrackId) {
          router.push({
            pathname: '/thank-you',
            params: { trackId: response.TrackId }
          });
        } else {
          Alert.alert('Order Placed', 'Your order has been placed successfully!');
          router.push('/');
        }
      } else {
        // Error handling for different response codes
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (response.ResponseCode === '-4') {
          errorMessage = 'Payment method not selected. Please select a payment method.';
        } else if (response.ResponseCode === '-6') {
          errorMessage = 'Your cart is empty. Please add items to cart before checkout.';
        } else if (response.ResponseCode === '-8') {
          errorMessage = 'Validation error. Please check your information.';
        } else if (response.ResponseCode === '-16') {
          errorMessage = 'One or more items in your cart are not available in the requested quantity.';
        }
        
        Alert.alert('Checkout Error', errorMessage);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  // Render cart items
  const renderCartItems = () => (
    <View style={styles.cartItems}>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <Image 
            source={{ uri: `https://erp.merpec.com/Upload/CompanyLogo/3044/${item.Image1}` }} 
            style={styles.cartItemImage} 
            resizeMode="contain"
          />
          <View style={styles.cartItemDetails}>
            <Text style={styles.cartItemName} numberOfLines={2}>{item.ProductName}</Text>
            <Text style={styles.cartItemPrice}>
              <Text style={styles.itemQuantity}>x {item.Quantity}</Text> {item.Price.toFixed(2)} KD
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  // Render appropriate address section based on logged-in status and step
  const renderAddressSection = () => {
    if (isLoggedIn) {
      // Render address section for logged-in users
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          
          {/* Billing Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressTitle}>Billing Address</Text>
            {(() => {
              const selectedBilling = checkoutBillingAddresses.find(addr => addr.BillingAddressId === selectedBillingAddressId);
              return selectedBilling ? (
                <View style={styles.selectedAddress}>
                  <Text style={styles.addressText}>
                    {selectedBilling.FullName}, {selectedBilling.Mobile}{'\n'}
                    {[selectedBilling.Block, selectedBilling.Street, selectedBilling.House]
                      .filter(Boolean).join(', ')}{'\n'}
                    {[selectedBilling.City, selectedBilling.State, selectedBilling.Country]
                      .filter(Boolean).join(', ')}
                  </Text>
                  <TouchableOpacity
                    style={styles.changeButton}
                    onPress={() => setShowChangeBillingModal(true)}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : checkoutLoading ? (
                <ActivityIndicator size="small" color={colors.blue} />
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowChangeBillingModal(true)}
                >
                  <FontAwesome name="plus" size={16} color="#0063B1" />
                  <Text style={styles.addButtonText}>Add Billing Address</Text>
                </TouchableOpacity>
              );
            })()}
          </View>
          
          {/* Shipping Address */}
          <View style={styles.addressContainer}>
            <View style={styles.shippingHeader}>
              <Text style={styles.addressTitle}>Shipping Address</Text>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => {
                  if (selectedShippingAddressId) {
                    setSelectedShippingAddressId(0);
                  } else if (checkoutShippingAddresses.length > 0) {
                    setSelectedShippingAddressId(checkoutShippingAddresses[0].ShippingAddressId || 0);
                  }
                }}
              >
                                 <View style={[styles.checkboxInner, selectedShippingAddressId ? styles.checkboxSelected : null]}>
                  {selectedShippingAddressId && <FontAwesome name="check" size={12} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Ship to different address</Text>
              </TouchableOpacity>
            </View>
            
            {selectedShippingAddressId ? (() => {
              const selectedShipping = checkoutShippingAddresses.find(addr => addr.ShippingAddressId === selectedShippingAddressId);
              return selectedShipping ? (
                <View style={styles.selectedAddress}>
                  <Text style={styles.addressText}>
                    {selectedShipping.FullName}, {selectedShipping.Mobile}{'\n'}
                    {[selectedShipping.Block, selectedShipping.Street, selectedShipping.House]
                      .filter(Boolean).join(', ')}{'\n'}
                    {[selectedShipping.City, selectedShipping.State, selectedShipping.Country]
                      .filter(Boolean).join(', ')}
                  </Text>
                  <TouchableOpacity
                    style={styles.changeButton}
                    onPress={() => setShowChangeShippingModal(true)}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : checkoutLoading ? (
                <ActivityIndicator size="small" color={colors.blue} />
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowChangeShippingModal(true)}
                >
                  <FontAwesome name="plus" size={16} color="#0063B1" />
                  <Text style={styles.addButtonText}>Add Shipping Address</Text>
                </TouchableOpacity>
              );
            })() : null}
          </View>
        </View>
      );
    } else {
      // Render address section for guest users
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          
          {/* Guest Address Add Button - as per guest_checkout.png */}
          {!guestBillingAddress && !showGuestBillingForm && (
            <TouchableOpacity
              style={styles.addGuestAddressButton}
              onPress={() => setShowGuestBillingForm(true)}
            >
              <FontAwesome name="plus" size={16} color={colors.blue} style={styles.addIcon} />
              <Text style={styles.addGuestAddressText}>Add Address</Text>
              <FontAwesome name="chevron-right" size={14} color={colors.blue} style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
          
          {/* Billing Address - only show if already entered */}
          {guestBillingAddress && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Billing Address</Text>
              <View style={styles.selectedAddress}>
                <Text style={styles.addressText}>
                  {guestBillingAddress.fullName}, {guestBillingAddress.mobile}{'\n'}
                  {guestBillingAddress.block}, {guestBillingAddress.street}, {guestBillingAddress.house}
                  {guestBillingAddress.apartment ? ', ' + guestBillingAddress.apartment : ''}{'\n'}
                  {guestBillingAddress.city?.XName}, {guestBillingAddress.state?.XName}, {guestBillingAddress.country?.XName}
                </Text>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setShowGuestBillingForm(true)}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Shipping Address - Only show if shipping is different */}
          {currentStep === 'shipping' && guestShippingAddress && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Shipping Address</Text>
              <View style={styles.selectedAddress}>
                <Text style={styles.addressText}>
                  {guestShippingAddress.fullName}, {guestShippingAddress.mobile}{'\n'}
                  {guestShippingAddress.block}, {guestShippingAddress.street}, {guestShippingAddress.house}
                  {guestShippingAddress.apartment ? ', ' + guestShippingAddress.apartment : ''}{'\n'}
                  {guestShippingAddress.city?.XName}, {guestShippingAddress.state?.XName}, {guestShippingAddress.country?.XName}
                </Text>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setShowGuestShippingForm(true)}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    }
  };

  // Add handler for the checkbox
  const handleCreateAccountToggle = () => {
    setCreateAccount(!createAccount);
  };

  // Add handler for terms and conditions checkbox
  const handleTermsToggle = () => {
    setAcceptTerms(!acceptTerms);
  };

  // Add function to fetch default addresses
  const fetchDefaultAddresses = async (userId: string) => {
    setIsLoadingAddresses(true);
    try {
      // Fetch default billing address
      const billingResponse = await getDefaultBillingAddressByUserId(userId);
      console.log('Default billing address response:', billingResponse);
      
      if (billingResponse.Data?.success === 1 && billingResponse.Data.row?.length > 0) {
        setDefaultBillingAddress(billingResponse.Data.row[0]);
      }
      
      // Fetch default shipping address
      const shippingResponse = await getDefaultShippingAddressByUserId(userId);
      console.log('Default shipping address response:', shippingResponse);
      
      if (shippingResponse.Data?.success === 1 && shippingResponse.Data.row?.length > 0) {
        setDefaultShippingAddress(shippingResponse.Data.row[0]);
      }
    } catch (error) {
      console.error('Error fetching default addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Add function to fetch all addresses
  const fetchAllAddresses = async (userId: string) => {
    try {
      // Fetch all billing addresses
      const billingResponse = await getAllBillingAddressesByUserId(userId);
      console.log('All billing addresses response:', billingResponse);
      
      if (billingResponse.Data?.success === 1 && billingResponse.Data.row?.length > 0) {
        setLoggedInUserBillingAddresses(billingResponse.Data.row);
      }
      
      // Fetch all shipping addresses
      const shippingResponse = await getAllShippingAddressesByUserId(userId);
      console.log('All shipping addresses response:', shippingResponse);
      
      if (shippingResponse.Data?.success === 1 && shippingResponse.Data.row?.length > 0) {
        setLoggedInUserShippingAddresses(shippingResponse.Data.row);
      }
    } catch (error) {
      console.error('Error fetching all addresses:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <FontAwesome name="close" size={24} color={colors.black} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Checkout</Text>
              <View style={{ width: 24 }} />
            </View>
            
            {/* Guest Checkout Billing Form */}
            {showGuestBillingForm && (
              <GuestCheckoutAddressForm onComplete={handleGuestBillingComplete} />
            )}
            
            {/* Guest Checkout Shipping Form */}
            {showGuestShippingForm && (
              <GuestCheckoutShippingForm onComplete={handleGuestShippingComplete} />
            )}
            
            {/* Main Checkout Content */}
            {!showGuestBillingForm && !showGuestShippingForm && (
              <>
                <ScrollView style={styles.modalContent}>
                  {/* Cart Items */}
                  {renderCartItems()}
                  
                  {/* Address Section */}
                  {renderAddressSection()}
                  
                  {/* Payment Method Selection */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Payment Type</Text>
                    
                    {isLoadingPaymentMethods ? (
                      <ActivityIndicator size="small" color={colors.blue} />
                    ) : paymentMethods.length === 0 ? (
                      <Text style={styles.emptyText}>No payment methods available</Text>
                    ) : (
                      <View style={styles.paymentMethodsContainer}>
                        {paymentMethods.map((method) => (
                          <TouchableOpacity
                            key={method.XCode}
                            style={[
                              styles.paymentMethodItem,
                              selectedPaymentMethod?.XCode === method.XCode && styles.selectedPaymentMethod
                            ]}
                            onPress={() => setSelectedPaymentMethod(method)}
                          >
                            <View style={styles.paymentMethodRadio}>
                              <View 
                                style={[
                                  styles.paymentMethodRadioInner,
                                  selectedPaymentMethod?.XCode === method.XCode && styles.paymentMethodRadioSelected
                                ]} 
                              />
                            </View>
                            <Text style={styles.paymentMethodName}>{method.XName}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  
                  {/* Promo Code Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Have a Promo Code?</Text>
                    <View style={styles.promoContainer}>
                      <TextInput
                        style={styles.promoInput}
                        placeholder="Enter Promo Code"
                        value={promoCode}
                        onChangeText={setPromoCode}
                        editable={!appliedPromo && !isPromoApplying}
                      />
                      {appliedPromo && (
                        <TouchableOpacity
                          style={[styles.promoButton, styles.removePromoButton]}
                          onPress={handleRemovePromoCode}
                          disabled={isPromoRemoving}
                        >
                          {isPromoRemoving ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <Text style={styles.promoButtonText}>Remove</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                    {appliedPromo && (
                      <View style={styles.appliedPromo}>
                        <Text style={styles.appliedPromoText}>
                          Promo code applied: {appliedPromo}
                        </Text>
                        <Text style={styles.discountText}>
                          Discount: KD {promoDiscount.toFixed(2) || '0.00'}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.seePromosButton}
                      onPress={handleSeePromoCodes}
                    >
                      <Text style={styles.seePromosText}>See Available Promo Codes</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Order Summary Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Item Sub total</Text>
                      <Text style={styles.summaryValue}>KD {correctTotalAmount.toFixed(2)}</Text>
                    </View>
                    {promoDiscount > 0 && (
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Discount</Text>
                        <Text style={[styles.summaryValue, styles.discountValue]}>KD {promoDiscount.toFixed(2)}</Text>
                      </View>
                    )}
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Shipping Fee</Text>
                      <Text style={styles.summaryValue}>KD {shippingFee.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryItem, styles.totalItem]}>
                      <Text style={styles.totalLabel}>Grand Total</Text>
                      <Text style={styles.totalValue}>KD {grandTotal.toFixed(2)}</Text>
                    </View>
                  </View>
                  
                  {/* Create Account Checkbox */}
                  {!isLoggedIn && (
                    <View style={styles.createAccountContainer}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={handleCreateAccountToggle}
                      >
                        <View style={[styles.checkbox, createAccount && styles.checkboxChecked]}>
                          {createAccount && <FontAwesome name="check" size={14} color={colors.white} />}
                        </View>
                        <Text style={styles.checkboxLabel}>Create an Account?</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Terms and Conditions */}
                  <View style={styles.termsContainer}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={handleTermsToggle}
                    >
                      <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                        {acceptTerms && <FontAwesome name="check" size={14} color={colors.white} />}
                      </View>
                      <Text style={styles.termsText}>
                        By proceeding, I've read and accept the <Text style={styles.termsLink}>terms & conditions</Text>.
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                
                {/* Bottom Action Bar */}
                <View style={styles.bottomBar}>
                  <TouchableOpacity 
                    style={[
                      styles.placeOrderButton,
                      (!selectedPaymentMethod || isPlacingOrder || !acceptTerms) && styles.disabledButton
                    ]}
                    onPress={handlePlaceOrder}
                    disabled={!selectedPaymentMethod || isPlacingOrder || !acceptTerms}
                  >
                    {isPlacingOrder ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.placeOrderButtonText}>
                        Place Order • KD {grandTotal.toFixed(2)}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  {!isLoggedIn && (
                    <View style={styles.loginContainer}>
                      <Text style={styles.loginText}>Are you a returning customer? </Text>
                      <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.loginLink}>Login Here</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}
            
            {/* Address Selection Modals for Logged In Users */}
            <CheckoutAddressModal
              isVisible={showBillingAddressModal}
              onClose={() => setShowBillingAddressModal(false)}
              addresses={billingAddresses}
              selectedAddress={billingAddresses.find(addr => 
                addr.id === (defaultBillingAddress?.BillingAddressId || 0)
              ) || null}
              onSelectAddress={handleBillingAddressSelected}
              onAddNew={handleAddNewBillingAddress}
              addressType="billing"
            />
            
            <CheckoutAddressModal
              isVisible={showShippingAddressModal}
              onClose={() => setShowShippingAddressModal(false)}
              addresses={shippingAddresses}
              selectedAddress={shippingAddresses.find(addr => 
                addr.id === (defaultShippingAddress?.ShippingAddressId || 0)
              ) || null}
              onSelectAddress={handleShippingAddressSelected}
              onAddNew={handleAddNewShippingAddress}
              addressType="shipping"
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
            
            {/* Change Billing Address Modal */}
            <ChangeAddressModal
              isVisible={showChangeBillingModal}
              onClose={() => setShowChangeBillingModal(false)}
              onSelectAddress={address => {
                setSelectedBillingAddressId(address.BillingAddressId || address.ShippingAddressId || 0);
                setShowChangeBillingModal(false);
              }}
              addresses={checkoutBillingAddresses.map(apiAddressToAddress)}
              selectedAddressId={selectedBillingAddressId || undefined}
              addressType="billing"
              isLoading={checkoutLoading}
            />
            
            {/* Change Shipping Address Modal */}
            <ChangeAddressModal
              isVisible={showChangeShippingModal}
              onClose={() => setShowChangeShippingModal(false)}
              onSelectAddress={address => {
                setSelectedShippingAddressId(address.ShippingAddressId || address.BillingAddressId || 0);
                setShowChangeShippingModal(false);
              }}
              addresses={checkoutShippingAddresses.map(apiAddressToAddress)}
              selectedAddressId={selectedShippingAddressId || undefined}
              addressType="shipping"
              isLoading={checkoutLoading}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    width: '90%',
    maxHeight: '90%',
    alignSelf: 'center',
    marginVertical: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  cartItems: {
    paddingVertical: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: colors.black,
  },
  itemQuantity: {
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
  addressContainer: {
    marginBottom: spacing.md,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.black,
  },
  selectedAddress: {
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
  changeButton: {
    padding: spacing.sm,
    backgroundColor: colors.blue,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  addButton: {
    padding: spacing.md,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.blue,
    fontWeight: '500',
  },
  promoContainer: {
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
  promoButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  promoButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  appliedPromo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  appliedPromoText: {
    color: colors.black,
  },
  discountText: {
    color: colors.gray,
  },
  seePromosButton: {
    backgroundColor: colors.blue,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  seePromosText: {
    color: colors.white,
    fontWeight: '500',
  },
  summaryItem: {
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
  discountValue: {
    color: colors.red,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
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
  removePromoButton: {
    backgroundColor: colors.red,
  },
  paymentMethodsContainer: {
    marginTop: 10,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: colors.blue,
    backgroundColor: colors.lightBlue,
  },
  paymentMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  paymentMethodRadioInner: {
    width: 0,
    height: 0,
  },
  paymentMethodName: {
    fontSize: 16,
    color: colors.black,
  },
  emptyText: {
    color: colors.gray,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  createAccountContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.blue,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.blue,
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.black,
  },
  shippingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termsContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 14,
    color: colors.black,
    flexShrink: 1,
  },
  termsLink: {
    color: colors.blue,
    textDecorationLine: 'underline',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: colors.black,
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: colors.blue,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: colors.black,
  },
  loginLink: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  addGuestAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    marginVertical: 12,
  },
  addIcon: {
    marginRight: 12,
    color: colors.blue,
  },
  addGuestAddressText: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: '500',
    flex: 1,
  },
  arrowIcon: {
    color: colors.blue,
  },
}); 