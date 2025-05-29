import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from '@theme';
// Directly define theme constants since @theme import is not working correctly
// const colors = {
//   white: '#FFFFFF',
//   lightBlue: '#E6F0FA',
//   blue: '#0063B1',
//   black: '#000000',
//   lightGray: '#E0E0E0',
//   veryLightGray: '#F5F5F5',
//   gray: '#888888',
//   red: '#FF0000',
//   textGray: '#808080', // For placeholder text or secondary info
//   text: '#333333', // Primary text color
//   border: '#CCCCCC', // Standard border color
//   borderLight: '#EEEEEE', // Lighter border color for dividers
//   backgroundLight: '#F9F9F9', // Light background color for content containers
// };

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
  ApiAddress,
  OrderReviewCheckoutParams
} from '../utils/api-service';
import { Address as StoreAddress } from '../store/address-store';
import PromoCodeModal from '../components/PromoCodeModal';
import ChangeAddressModal from '../components/ChangeAddressModal';
import AddAddressModal from '../components/AddAddressModal';
import AuthModal from '../components/AuthModal';
import { useTranslation } from '../utils/translations';
import { useRTL } from '../utils/rtl';

const { width, height } = Dimensions.get('window');

// Interfaces and types
// Note: Using PaymentModeItem from api-service.ts

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
    // Preserve the original ID fields that ChangeAddressModal expects
    BillingAddressId: api.BillingAddressId,
    ShippingAddressId: api.ShippingAddressId,
    // Keep the legacy id field for backwards compatibility
    id: api.BillingAddressId || api.ShippingAddressId || 0,
    FullName: api.FullName,
    Email: api.Email,
    Mobile: api.Mobile,
    Address2: api.Address2 || '',
    Address: api.Address || '',
    Country: api.Country || '',
    State: api.State || '',
    City: api.City || '',
    Block: api.Block || '',
    Street: api.Street || '',
    House: api.House || '',
    Apartment: api.Apartment || '',
    IsDefault: typeof api.IsDefault === 'boolean' ? api.IsDefault : !!api.IsDefault,
    // Also keep the original field names for consistency
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
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { refreshCartItems, cartItems, totalAmount } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
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
    fetchDefaultAddresses,
    fetchAllAddresses,
    billingAddresses: checkoutBillingAddresses,
    shippingAddresses: checkoutShippingAddresses,
    selectedBillingAddressId,
    selectedShippingAddressId,
    setSelectedBillingAddressId,
    setSelectedShippingAddressId,
    orderReviewData,
    isLoadingOrderReview,
    orderReviewError,
    fetchOrderReview,
    clearOrderReviewError,
    triggerOrderReviewUpdate,
  } = useCheckoutStore();
  
  // State
  const [promoCode, setPromoCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);
  
  // State for address modals
  const [showAddBillingModal, setShowAddBillingModal] = useState(false);
  const [showAddShippingModal, setShowAddShippingModal] = useState(false);
  
  // State for guest checkout flow
  const [showGuestBillingForm, setShowGuestBillingForm] = useState(false);
  const [showGuestShippingForm, setShowGuestShippingForm] = useState(false);
  
  // Add state for "Create an Account" checkbox
  const [createAccount, setCreateAccount] = useState(false);
  
  // Add state for terms and conditions
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Add state for PromoCodeModal
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  
  // Add state for AuthModal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('signup');
  
  // Add state for applying promo codes
  const [isPromoApplying, setIsPromoApplying] = useState(false);
  const [isPromoRemoving, setIsPromoRemoving] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  
  // Get uniqueId and BuyNow from local storage or params
  const uniqueId = params.uniqueId as string || useCartStore(state => state.uniqueId);
  const buyNow = ''; // Always empty since users can only checkout from cart now
  
  // Use only order review data for all calculations - no fallbacks
  const shippingFee = orderReviewData?.ShippingCharge ?? 0;
  const discount = orderReviewData?.Discount ?? 0;
  const grandTotal = orderReviewData?.GrandTotal ?? 0;
  const subTotal = orderReviewData?.SubTotal ?? 0;
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentModeItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentModeItem | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlacedTrackId, setOrderPlacedTrackId] = useState<string | null>(null);
  
  // State for change address modals
  const [showChangeBillingModal, setShowChangeBillingModal] = useState(false);
  const [showChangeShippingModal, setShowChangeShippingModal] = useState(false);
  
  // Add state for shipping different address
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  
  // MAIN useEffect to fetch addresses for logged-in users
  useEffect(() => {
    console.log('🏠 Checkout useEffect triggered - isLoggedIn:', isLoggedIn, 'user:', user?.UserID);
    if (isLoggedIn && user && user.UserID) {
      console.log('🏠 Fetching addresses for user:', user.UserID);
      // Fetch default addresses which will also fetch all addresses internally
      fetchDefaultAddresses(user.UserID);
    }
  }, [isLoggedIn, user?.UserID]);
  
  // Log checkout store state for debugging
  useEffect(() => {
    console.log('🏠 Checkout Store State Update:');
    console.log('🏠 - selectedBillingAddressId:', selectedBillingAddressId);
    console.log('🏠 - selectedShippingAddressId:', selectedShippingAddressId);
    console.log('🏠 - checkoutBillingAddresses length:', checkoutBillingAddresses.length);
    console.log('🏠 - checkoutShippingAddresses length:', checkoutShippingAddresses.length);
    console.log('🏠 - checkoutLoading:', checkoutLoading);
  }, [selectedBillingAddressId, selectedShippingAddressId, checkoutBillingAddresses.length, checkoutShippingAddresses.length, checkoutLoading]);
  
  // Consolidated order review trigger - handles all changes that should trigger order review
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log('🛒 Order review trigger - Cart items, addresses, or promo changed');
      triggerOrderReviewUpdate();
    }
  }, [
    cartItems.length,
    selectedBillingAddressId,
    selectedShippingAddressId,
    shipToDifferentAddress,
    guestBillingAddress,
    guestShippingAddress,
    appliedPromo,
    triggerOrderReviewUpdate
  ]);
  
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
  const handleSelectPromoCode = async (code: string) => {
    setPromoCode(code);
    
    // Auto apply the selected code
    const userId = user?.UserID || '';
    
    try {
      setIsPromoApplying(true);
      const result = await promoStore.applyPromo(code, userId, uniqueId, buyNow);
      
      if (result) {
        // Success - Promo code was applied
        setAppliedPromo(code);
        Alert.alert('Success', 'Promo code applied successfully');
      } else {
        // Failed to apply promo code
        Alert.alert('Error', promoStore.promoError || 'Failed to apply promo code');
        setPromoCode(''); // Clear the input
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'An error occurred while applying the promo code');
      setPromoCode(''); // Clear the input
    } finally {
      setIsPromoApplying(false);
    }
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
    
    console.log('🏠 handleSelectBillingAddress called');
    console.log('🏠 checkoutBillingAddresses:', checkoutBillingAddresses);
    console.log('🏠 checkoutBillingAddresses length:', checkoutBillingAddresses.length);
    console.log('🏠 selectedBillingAddressId:', selectedBillingAddressId);
    console.log('🏠 Mapped addresses:', checkoutBillingAddresses.map(apiAddressToAddress));
    
    setShowChangeBillingModal(true);
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
    
    console.log('🏠 handleSelectShippingAddress called');
    console.log('🏠 checkoutShippingAddresses:', checkoutShippingAddresses);
    console.log('🏠 checkoutShippingAddresses length:', checkoutShippingAddresses.length);
    console.log('🏠 selectedShippingAddressId:', selectedShippingAddressId);
    console.log('🏠 Mapped addresses:', checkoutShippingAddresses.map(apiAddressToAddress));
    
    setShowChangeShippingModal(true);
  };
  
  // Handle billing address selected from modal
  const handleBillingAddressSelected = (address: any) => {
    setSelectedBillingAddressId(address.BillingAddressId);
    setShowChangeBillingModal(false);
  };

  // Handle shipping address selected from modal
  const handleShippingAddressSelected = (address: any) => {
    setSelectedShippingAddressId(address.ShippingAddressId);
    setShowChangeShippingModal(false);
  };
  
  // Show add new billing address modal
  const handleAddNewBillingAddress = () => {
    setShowAddBillingModal(true);
  };
  
  // Show add new shipping address modal
  const handleAddNewShippingAddress = () => {
    setShowAddShippingModal(true);
  };
  
  // Handle new billing address added
  const handleBillingAddressAdded = () => {
    // Refresh the addresses and close modal
    if (user?.UserID) {
      fetchAllAddresses(user.UserID);
    }
    setShowAddBillingModal(false);
  };
  
  // Handle new shipping address added
  const handleShippingAddressAdded = () => {
    // Refresh the addresses and close modal  
    if (user?.UserID) {
      fetchAllAddresses(user.UserID);
    }
    setShowAddShippingModal(false);
  };
  
  // Navigate to login screen
  const handleLogin = () => {
    setAuthInitialTab('login');
    setShowAuthModal(true);
  };
  
  // Get selected addresses for display
  const getSelectedBillingAddress = () => {
    console.log('🏠 getSelectedBillingAddress: selectedBillingAddressId =', selectedBillingAddressId);
    console.log('🏠 getSelectedBillingAddress: checkoutBillingAddresses.length =', checkoutBillingAddresses.length);
    if (!selectedBillingAddressId) return null;
    const address = checkoutBillingAddresses.find(addr => addr.BillingAddressId === selectedBillingAddressId);
    console.log('🏠 getSelectedBillingAddress: found address =', !!address);
    return address || null;
  };

  const getSelectedShippingAddress = () => {
    console.log('🏠 getSelectedShippingAddress: selectedShippingAddressId =', selectedShippingAddressId);
    console.log('🏠 getSelectedShippingAddress: checkoutShippingAddresses.length =', checkoutShippingAddresses.length);
    if (!selectedShippingAddressId) return null;
    const address = checkoutShippingAddresses.find(addr => addr.ShippingAddressId === selectedShippingAddressId);
    console.log('🏠 getSelectedShippingAddress: found address =', !!address);
    return address || null;
  };

  // Format address for display from API address
  const formatApiAddressForDisplay = (address: ApiAddress) => {
    return `${address.FullName}\n${address.Address}\n${address.City}, ${address.State}\n${address.Country}`;
  };

  // Format address for display from checkout store addresses  
  const formatAddressForDisplay = (address: Address) => {
    return `${address.fullName}, ${address.mobile}\n${address.block}, ${address.street}, ${address.house}${address.apartment ? ', ' + address.apartment : ''}\n${address.city}, ${address.state}, ${address.country}`;
  };
  
  // Function to handle address selection callbacks
  const handleChangeBillingAddress = (address: ApiAddress) => {
    setSelectedBillingAddressId(address.BillingAddressId || address.ShippingAddressId || 0);
    setShowChangeBillingModal(false);
  };

  const handleChangeShippingAddress = (address: ApiAddress) => {
    setSelectedShippingAddressId(address.ShippingAddressId || address.BillingAddressId || 0);
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
      let sCountry = '';
      let sState = '';
      let sCity = '';
      
      if (isLoggedIn) {
        // Logged-in user - use selected address IDs from checkout store
        const { selectedBillingAddressId, selectedShippingAddressId } = useCheckoutStore.getState();
        
        billingAddressId = selectedBillingAddressId || (getSelectedBillingAddress()?.BillingAddressId || 0);
        
        // For logged-in users, if shipToDifferentAddress is checked and we have a shipping address, use different addresses
        if (shipToDifferentAddress && selectedShippingAddressId) {
          differentAddress = true;
          shippingAddressId = selectedShippingAddressId;
          
          // Get shipping address details for SCountry, SState, SCity
          const shippingAddress = getSelectedShippingAddress();
          if (shippingAddress) {
            // Convert address location names to codes (you may need to map these)
            sCountry = shippingAddress.CountryId?.toString() || '';
            sState = shippingAddress.StateId?.toString() || '';
            sCity = shippingAddress.CityId?.toString() || '';
          }
        } else {
          // Use same address for both billing and shipping
          differentAddress = false;
          shippingAddressId = billingAddressId;
          
          // Use billing address location for shipping
          const billingAddress = getSelectedBillingAddress();
          if (billingAddress) {
            sCountry = billingAddress.CountryId?.toString() || '';
            sState = billingAddress.StateId?.toString() || '';
            sCity = billingAddress.CityId?.toString() || '';
          }
        }
        
        console.log('🏠 Checkout Logic - billingAddressId:', billingAddressId);
        console.log('🏠 Checkout Logic - shippingAddressId:', shippingAddressId);
        console.log('🏠 Checkout Logic - differentAddress:', differentAddress);
        console.log('🏠 Checkout Logic - shipToDifferentAddress:', shipToDifferentAddress);
        console.log('🏠 Checkout Logic - sCountry:', sCountry);
        console.log('🏠 Checkout Logic - sState:', sState);
        console.log('🏠 Checkout Logic - sCity:', sCity);
      } else {
        // Guest user - use address IDs from checkout store
        billingAddressId = guestBillingAddressId;
        differentAddress = !!(guestShippingAddress);
        shippingAddressId = differentAddress ? guestShippingAddressId : billingAddressId;
        
        if (differentAddress && guestShippingAddress) {
          // Use guest shipping address location
          sCountry = guestShippingAddress.country?.XCode.toString() || '';
          sState = guestShippingAddress.state?.XCode.toString() || '';
          sCity = guestShippingAddress.city?.XCode.toString() || '';
        } else if (guestBillingAddress) {
          // Use guest billing address location for shipping
          sCountry = guestBillingAddress.country?.XCode.toString() || '';
          sState = guestBillingAddress.state?.XCode.toString() || '';
          sCity = guestBillingAddress.city?.XCode.toString() || '';
        }
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
        ShippingAddressId: shippingAddressId, // Always include ShippingAddressId
        SCountry: sCountry,
        SState: sState,
        SCity: sCity,
        PaymentMode: selectedPaymentMethod.XCode,
        Source: Platform.OS === 'ios' ? 'iOS' : 'Android',
        OrderNote: '',
        Salesman: '3044SMOL'
      };
      
      console.log('Placing order with params:', JSON.stringify(checkoutParams, null, 2));
      
      // Call the checkout API
      const response = await saveCheckout(checkoutParams);
      
      // Log the complete response for debugging
      console.log('🛒 SAVE CHECKOUT API RESPONSE - COMPLETE:', JSON.stringify(response, null, 2));
      console.log('🛒 SAVE CHECKOUT - Response Code:', response.ResponseCode);
      console.log('🛒 SAVE CHECKOUT - Status Code:', response.StatusCode);
      console.log('🛒 SAVE CHECKOUT - Message:', response.Message);
      console.log('🛒 SAVE CHECKOUT - Data Field:', response.Data);
      console.log('🛒 SAVE CHECKOUT - TrackId from Data:', response.Data?.TrackId);
      console.log('🛒 SAVE CHECKOUT - TrackId from Root:', response.TrackId);
      console.log('🛒 SAVE CHECKOUT - Raw Response Keys:', Object.keys(response));
      
      if (response.ResponseCode === '2' || response.ResponseCode === 2) {
        // Successful order placement
        // First check root level TrackId, then Data field
        let trackId = response.TrackId || response.Data?.TrackId;
        
        console.log('🛒 SAVE CHECKOUT - SUCCESS! Extracted TrackId:', trackId);
        
        // If no TrackId returned, generate one based on user type and timestamp
        if (!trackId) {
          const timestamp = new Date().getTime();
          if (isLoggedIn && user?.UserID) {
            // For logged-in users, use user ID + timestamp
            trackId = `ORD_${user.UserID}_${timestamp}`;
          } else {
            // For guest users, use uniqueId + timestamp
            trackId = `ORD_GUEST_${uniqueId}_${timestamp}`;
          }
          console.log('🛒 SAVE CHECKOUT - Generated fallback TrackId:', trackId);
        }
        
        console.log('🛒 SAVE CHECKOUT - Final TrackId for navigation:', trackId);
        setOrderPlacedTrackId(trackId || null);
        
        // Navigate to success page
        router.push({
          pathname: '/thank-you',
          params: { 
            trackId: trackId,
            status: 'success'
          }
        });
      } else {
        // Error handling for different response codes
        console.log('🛒 ORDER FAILED with response code:', response.ResponseCode);
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
        
        // Navigate to failure page
        router.push({
          pathname: '/thank-you',
          params: { 
            trackId: 'ORDER_FAILED',
            status: 'failed',
            errorMessage: errorMessage
          }
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  // Render cart items
  const renderCartItems = () => {
    // Use order review data if available, otherwise fall back to cart items
    const itemsToRender = orderReviewData?.CartItemsList || cartItems;
    const isUsingOrderReview = !!orderReviewData?.CartItemsList;
    
    const renderCartItem = ({ item, index }: { item: any; index: number }) => {
      // Handle different property names between CartItem and OrderReviewCartItem
      const itemName = isUsingOrderReview 
        ? (item as any).ItemName 
        : (item as any).ProductName || (item as any).ItemName;
      const quantity = isUsingOrderReview 
        ? (item as any).Quantity 
        : (item as any).Qty || (item as any).Quantity;
      const price = isUsingOrderReview 
        ? (item as any).NewPrice 
        : (item as any).Price;
      const imageUrl = isUsingOrderReview 
        ? (item as any).Image1 
        : (item as any).Image1 || (item as any).Image;
      
      return (
        <View style={styles.horizontalCartItem}>
          <Image 
            source={{ uri: `https://erp.merpec.com/Upload/CompanyLogo/3044/${imageUrl}` }} 
            style={styles.horizontalCartItemImage} 
            resizeMode="contain"
          />
          <View style={styles.horizontalCartItemDetails}>
            <Text style={styles.horizontalCartItemName} numberOfLines={2}>
              {itemName}
            </Text>
            <Text style={styles.horizontalCartItemQuantity}>x {quantity}</Text>
            <Text style={styles.horizontalCartItemPrice}>{price.toFixed(2)} KD</Text>
          </View>
        </View>
      );
    };
    
    return (
      <View style={styles.cartItemsContainer}>
        {isLoadingOrderReview && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.blue} />
            <Text style={styles.loadingText}>Loading order details...</Text>
          </View>
        )}
        
        <FlatList
          data={itemsToRender}
          renderItem={renderCartItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCartList}
        />
      </View>
    );
  };

  // Render appropriate address section based on logged-in status and step
  const renderAddressSection = () => {
    if (isLoggedIn) {
      // Render address section for logged-in users
      return (
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Image 
              source={require('../assets/checkout/address_icon_checkout.png')} 
              style={[styles.sectionIcon, isRTL && { marginLeft: spacing.sm, marginRight: 0 }]}
              resizeMode="contain"
            />
            <Text style={[styles.sectionTitle, { textAlign }]}>{t('address')}</Text>
          </View>
          
          {/* Billing Address */}
          <View style={styles.addressContainer}>
            <Text style={[styles.addressTitle, { textAlign }]}>{t('billing_address')}</Text>
            {(() => {
              const selectedBilling = getSelectedBillingAddress();
              console.log('🏠 renderAddressSection: selectedBilling =', !!selectedBilling);
              if (selectedBilling) {
                console.log('🏠 renderAddressSection: showing selected billing address');
                return (
                  <View style={[styles.selectedAddress, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.addressText, { textAlign, flex: 1 }]}>
                      {formatApiAddressForDisplay(selectedBilling)}
                    </Text>
                    <TouchableOpacity 
                      style={styles.changeButton}
                      onPress={() => setShowChangeBillingModal(true)}
                    >
                      <Text style={[styles.changeButtonText, { textAlign }]}>{t('change_address')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                console.log('🏠 renderAddressSection: showing add billing address button');
                return (
                  <TouchableOpacity 
                    style={[styles.addButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={handleAddNewBillingAddress}
                  >
                    <FontAwesome 
                      name="plus" 
                      size={16} 
                      color={colors.blue} 
                      style={[{ marginRight: isRTL ? 0 : spacing.sm, marginLeft: isRTL ? spacing.sm : 0 }]}
                    />
                    <Text style={[styles.addButtonText, { textAlign }]}>{t('add_billing_address')}</Text>
                  </TouchableOpacity>
                );
              }
            })()}
          </View>
          
          {/* Ship to Different Address Checkbox */}
          <View style={styles.shippingCheckboxContainer}>
            <TouchableOpacity
              style={[styles.checkboxContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => setShipToDifferentAddress(!shipToDifferentAddress)}
            >
              <View style={[styles.checkboxSquare, shipToDifferentAddress && styles.checkboxSquareSelected]}>
                {shipToDifferentAddress && <FontAwesome name="check" size={12} color={colors.white} />}
              </View>
              <Text style={[
                styles.checkboxLabel, 
                { 
                  marginLeft: isRTL ? 0 : spacing.sm, 
                  marginRight: isRTL ? spacing.sm : 0,
                  textAlign 
                }
              ]}>
                {t('ship_to_different_address')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Shipping Address - only show if different address is selected */}
          {shipToDifferentAddress && (
            <View style={styles.addressContainer}>
              <Text style={[styles.addressTitle, { textAlign }]}>{t('shipping_address')}</Text>
              {getSelectedShippingAddress() ? (
                <View style={[styles.selectedAddress, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.addressText, { textAlign, flex: 1 }]}>
                    {formatApiAddressForDisplay(getSelectedShippingAddress()!)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => setShowChangeShippingModal(true)}
                  >
                    <Text style={[styles.changeButtonText, { textAlign }]}>{t('change_address')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.addButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  onPress={handleAddNewShippingAddress}
                >
                  <FontAwesome 
                    name="plus" 
                    size={16} 
                    color={colors.blue} 
                    style={[{ marginRight: isRTL ? 0 : spacing.sm, marginLeft: isRTL ? spacing.sm : 0 }]}
                  />
                  <Text style={[styles.addButtonText, { textAlign }]}>{t('add_shipping_address')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      );
    } else {
      // Render address section for guest users
      return (
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Image 
              source={require('../assets/checkout/address_icon_checkout.png')} 
              style={[styles.sectionIcon, isRTL && { marginLeft: spacing.sm, marginRight: 0 }]}
              resizeMode="contain"
            />
            <Text style={[styles.sectionTitle, { textAlign }]}>{t('address')}</Text>
          </View>
          
          {/* Guest Address Add Button - as per guest_checkout.png */}
          {!guestBillingAddress && !showGuestBillingForm && (
            <TouchableOpacity
              style={[styles.addGuestAddressButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => setShowGuestBillingForm(true)}
            >
              <FontAwesome 
                name="plus" 
                size={16} 
                color={colors.blue} 
                style={[styles.addIcon, isRTL && { marginLeft: spacing.sm, marginRight: 0 }]} 
              />
              <Text style={[styles.addGuestAddressText, { textAlign, flex: 1 }]}>{t('add_address')}</Text>
              <FontAwesome 
                name={isRTL ? "chevron-left" : "chevron-right"} 
                size={14} 
                color={colors.blue} 
                style={[styles.arrowIcon, isRTL && { marginRight: spacing.sm, marginLeft: 0 }]} 
              />
            </TouchableOpacity>
          )}
          
          {/* Billing Address - only show if already entered */}
          {guestBillingAddress && (
            <View style={styles.addressContainer}>
              <Text style={[styles.addressTitle, { textAlign }]}>{t('billing_address')}</Text>
              <View style={[styles.selectedAddress, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.addressText, { textAlign, flex: 1 }]}>
                  {guestBillingAddress.fullName}, {guestBillingAddress.mobile}{'\n'}
                  {guestBillingAddress.block}, {guestBillingAddress.street}, {guestBillingAddress.house}
                  {guestBillingAddress.apartment ? ', ' + guestBillingAddress.apartment : ''}{'\n'}
                  {guestBillingAddress.city?.XName}, {guestBillingAddress.state?.XName}, {guestBillingAddress.country?.XName}
                </Text>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setShowGuestBillingForm(true)}
                >
                  <Text style={[styles.changeButtonText, { textAlign }]}>{t('change_address')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Shipping Address - Show if shipping address exists */}
          {guestShippingAddress && (
            <View style={styles.addressContainer}>
              <Text style={[styles.addressTitle, { textAlign }]}>{t('shipping_address')}</Text>
              <View style={[styles.selectedAddress, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.addressText, { textAlign, flex: 1 }]}>
                  {guestShippingAddress.fullName}, {guestShippingAddress.mobile}{'\n'}
                  {guestShippingAddress.block}, {guestShippingAddress.street}, {guestShippingAddress.house}
                  {guestShippingAddress.apartment ? ', ' + guestShippingAddress.apartment : ''}{'\n'}
                  {guestShippingAddress.city?.XName}, {guestShippingAddress.state?.XName}, {guestShippingAddress.country?.XName}
                </Text>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setShowGuestShippingForm(true)}
                >
                  <Text style={[styles.changeButtonText, { textAlign }]}>{t('change_address')}</Text>
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
    // Show auth modal with signup tab
    setAuthInitialTab('signup');
    setShowAuthModal(true);
  };

  // Add handler for terms and conditions checkbox
  const handleTermsToggle = () => {
    setAcceptTerms(!acceptTerms);
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
            <View style={[styles.header, { flexDirection }]}>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('checkout')}</Text>
              <View style={{ width: 40 }} />
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
                  
                  {/* Promo Code Section */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.seePromosButtonSmall}
                      onPress={handleSeePromoCodes}
                    >
                      <Text style={styles.seePromosTextSmall}>{t('see_available_promo_codes')}</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.sectionHeader}>
                      <Image 
                        source={require('../assets/checkout/promo_icon_checkout.png')} 
                        style={styles.sectionIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.sectionTitle}>{t('have_promo_code')}</Text>
                    </View>
                    <View style={styles.promoContainer}>
                      <TextInput
                        style={styles.promoInput}
                        placeholder={t('enter_promo_code')}
                        value={promoCode}
                        onChangeText={setPromoCode}
                        editable={!appliedPromo && !isPromoApplying}
                      />
                      {!appliedPromo ? (
                        <TouchableOpacity
                          style={[styles.promoButton, (!promoCode?.trim() || isPromoApplying) && styles.disabledPromoButton]}
                          onPress={handleApplyPromoCode}
                          disabled={!promoCode?.trim() || isPromoApplying}
                        >
                          {isPromoApplying ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <Text style={styles.promoButtonText}>{t('apply')}</Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.promoButton, styles.removePromoButton]}
                          onPress={handleRemovePromoCode}
                          disabled={isPromoRemoving}
                        >
                          {isPromoRemoving ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <Text style={styles.promoButtonText}>{t('remove')}</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  
                  {/* Payment Method Selection */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Image 
                        source={require('../assets/checkout/payment_icon_checkout.png')} 
                        style={styles.sectionIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.sectionTitle}>{t('select_payment_type')}</Text>
                    </View>
                    
                    {isLoadingPaymentMethods ? (
                      <ActivityIndicator size="small" color={colors.blue} />
                    ) : paymentMethods.length === 0 ? (
                      <Text style={styles.emptyText}>{t('no_payment_methods_available')}</Text>
                    ) : (
                      <>
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
                        
                        {/* Payment Methods Image - positioned below right corner */}
                        <View style={styles.paymentMethodsImageContainer}>
                          <Image 
                            source={require('../assets/checkout/payment_methods.png')} 
                            style={styles.paymentMethodsImage}
                            resizeMode="contain"
                          />
                        </View>
                      </>
                    )}
                  </View>
                  
                  {/* Order Summary Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('order_summary')}</Text>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>{t('item_sub_total')}</Text>
                      <Text style={styles.summaryValue}>
                        KD {subTotal.toFixed(2)}
                      </Text>
                    </View>
                    {/* Always show discount field */}
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>{t('discount')}</Text>
                      <Text style={[styles.summaryValue, styles.discountValue]}>
                        -KD {discount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>{t('shipping_fee')}</Text>
                      <Text style={styles.summaryValue}>
                        KD {shippingFee.toFixed(2)}
                      </Text>
                    </View>
                    <View style={[styles.summaryItem, styles.totalItem]}>
                      <Text style={styles.totalLabel}>{t('grand_total')}</Text>
                      <Text style={styles.totalValue}>
                        KD {grandTotal.toFixed(2)}
                      </Text>
                    </View>
                    {orderReviewData?.PromoCode && (
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('applied_promo')}</Text>
                        <Text style={styles.summaryValue}>
                          {orderReviewData.PromoCode} ({orderReviewData.Percentage}% off)
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Create Account Checkbox */}
                  {!isLoggedIn && (
                    <View style={styles.createAccountContainer}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={handleCreateAccountToggle}
                      >
                        <View style={[styles.checkboxSquare, createAccount && styles.checkboxSquareSelected]}>
                          {createAccount && <FontAwesome name="check" size={12} color={colors.white} />}
                        </View>
                        <Text style={styles.checkboxLabel}>{t('create_account_question')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Terms and Conditions */}
                  <View style={styles.termsContainer}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={handleTermsToggle}
                    >
                      <View style={[styles.checkboxSquare, acceptTerms && styles.checkboxSquareSelected]}>
                        {acceptTerms && <FontAwesome name="check" size={12} color={colors.white} />}
                      </View>
                      <Text style={styles.termsText}>
                        {t('terms_conditions_text')} <Text style={styles.termsLink}>{t('terms_conditions')}</Text>.
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
                        {t('place_order')} • KD {grandTotal.toFixed(2)}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  {!isLoggedIn && (
                    <View style={styles.loginContainer}>
                      <Text style={styles.loginText}>{t('returning_customer')} </Text>
                      <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.loginLink}>{t('login_here')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}
            
            {/* Address Selection Modals for Logged In Users - Removed due to type conflicts */}
            
            {/* Add Address Modals */}
            <AddAddressModal
              isVisible={showAddBillingModal}
              onClose={() => setShowAddBillingModal(false)}
              addressType="billing"
              onSuccess={handleBillingAddressAdded}
            />
            
            <AddAddressModal
              isVisible={showAddShippingModal}
              onClose={() => setShowAddShippingModal(false)}
              addressType="shipping"
              onSuccess={handleShippingAddressAdded}
            />
            
            {/* Change Billing Address Modal */}
            <ChangeAddressModal
              isVisible={showChangeBillingModal}
              onClose={() => setShowChangeBillingModal(false)}
              onSelectAddress={handleBillingAddressSelected}
              addresses={checkoutBillingAddresses.map(apiAddressToAddress)}
              selectedAddressId={selectedBillingAddressId || undefined}
              addressType="billing"
              isLoading={checkoutLoading}
            />
            
            {/* Change Shipping Address Modal */}
            <ChangeAddressModal
              isVisible={showChangeShippingModal}
              onClose={() => setShowChangeShippingModal(false)}
              onSelectAddress={handleShippingAddressSelected}
              addresses={checkoutShippingAddresses.map(apiAddressToAddress)}
              selectedAddressId={selectedShippingAddressId || undefined}
              addressType="shipping"
              isLoading={checkoutLoading}
            />
            
            {/* Promo Code Modal */}
            <PromoCodeModal
              isVisible={showPromoCodeModal}
              onClose={() => setShowPromoCodeModal(false)}
              onSelectPromoCode={handleSelectPromoCode}
            />
            
            {/* Auth Modal */}
            <AuthModal
              isVisible={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              initialTab={authInitialTab}
              onSuccess={() => {
                // Refresh the page data after successful login/signup
                if (user?.UserID) {
                  fetchDefaultAddresses(user.UserID);
                  fetchAllAddresses(user.UserID);
                }
              }}
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
  cartItemsContainer: {
    paddingVertical: spacing.lg,
  },
  horizontalCartItem: {
    width: 130,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalCartItemImage: {
    width: 60,
    height: 60,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  horizontalCartItemDetails: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  horizontalCartItemName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
    lineHeight: 16,
  },
  horizontalCartItemQuantity: {
    fontSize: 10,
    color: colors.textGray,
    marginBottom: spacing.xs,
  },
  horizontalCartItemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  horizontalCartList: {
    paddingHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
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
    color: colors.black,
    fontWeight: '500',
  },
  shippingCheckboxContainer: {
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
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
  checkboxSquare: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxSquareSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
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
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  promoButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 48,
  },
  promoButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  appliedPromo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  appliedPromoText: {
    color: colors.text,
    fontWeight: '500',
  },
  discountText: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  seePromosButtonSmall: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  seePromosTextSmall: {
    color: colors.blue,
    fontWeight: '500',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
    paddingTop: spacing.md,
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
    marginTop: spacing.sm,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
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
    borderColor: colors.lightGray,
    marginRight: spacing.md,
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
    color: colors.text,
    fontWeight: '500',
  },
  paymentMethodsImageContainer: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    marginRight: spacing.md,
  },
  paymentMethodsImage: {
    width: 120,
    height: 40,
  },
  emptyText: {
    color: colors.textGray,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledPromoButton: {
    opacity: 0.5,
    backgroundColor: colors.textGray,
  },
  createAccountContainer: {
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
  },
  termsContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.veryLightGray,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  termsText: {
    fontSize: 14,
    color: colors.black,
    flexShrink: 1,
    lineHeight: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.blue,
    marginTop: 10,
  },
}); 