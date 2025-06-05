import { create } from 'zustand';
import { 
  registerGuestUser, 
  GuestUserRegistrationParams,
  getDefaultBillingAddressByUserId, 
  getDefaultShippingAddressByUserId,
  getAllBillingAddressesByUserId,
  getAllShippingAddressesByUserId,
  ApiAddress,
  getOrderReviewCheckout,
  OrderReviewCheckoutParams,
  OrderReviewData,
  saveBillingAddress,
  SaveBillingAddressPayload,
  saveShippingAddress,
  SaveShippingAddressPayload
} from '../utils/api-service';
import { Platform } from 'react-native';
import { RESPONSE_CODES } from '../utils/api-config';
import useLanguageStore from './language-store';
import { getDeviceIP } from '../utils/ip-utils';

// Interface for address data
export interface CheckoutAddress {
  fullName: string;
  email: string;
  mobile: string;
  country: { XCode: number; XName: string } | null;
  state: { XCode: number; XName: string } | null;
  city: { XCode: number; XName: string } | null;
  block: string;
  street: string;
  house: string;
  apartment: string;
  address2: string;
}

interface CheckoutState {
  // Checkout step tracking
  currentStep: 'billing' | 'shipping' | 'payment' | 'confirmation';
  
  // Guest user info
  guestTrackId: string | null;
  
  // Address information
  billingAddress: CheckoutAddress | null;
  shippingAddress: CheckoutAddress | null;
  useShippingForBilling: boolean;
  
  // Address IDs from API responses
  billingAddressId: number;
  shippingAddressId: number;
  
  // Selected address IDs for logged-in users
  selectedBillingAddressId: number | null;
  selectedShippingAddressId: number | null;
  
  // Address lists for logged-in users
  billingAddresses: ApiAddress[];
  shippingAddresses: ApiAddress[];
  
  // Order review data
  orderReviewData: OrderReviewData | null;
  isLoadingOrderReview: boolean;
  orderReviewError: string | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentStep: (step: 'billing' | 'shipping' | 'payment' | 'confirmation') => void;
  setBillingAddress: (address: CheckoutAddress) => void;
  setShippingAddress: (address: CheckoutAddress) => void;
  setUseShippingForBilling: (value: boolean) => void;
  registerGuestUser: (userData: { fullName: string; email: string; mobile: string }) => Promise<boolean>;
  saveGuestBillingAddress: (addressData: CheckoutAddress) => Promise<boolean>;
  saveGuestShippingAddress: (addressData: CheckoutAddress) => Promise<boolean>;
  fetchBillingAddressId: () => Promise<void>;
  fetchShippingAddressId: () => Promise<void>;
  
  // New actions for logged-in users
  fetchDefaultAddresses: (userId: string) => Promise<void>;
  fetchAllAddresses: (userId: string) => Promise<void>;
  setSelectedBillingAddressId: (id: number) => void;
  setSelectedShippingAddressId: (id: number) => void;
  
  // Order review actions
  fetchOrderReview: (params: OrderReviewCheckoutParams) => Promise<boolean>;
  clearOrderReviewError: () => void;
  triggerOrderReviewUpdate: () => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const initialAddress: CheckoutAddress = {
  fullName: '',
  email: '',
  mobile: '',
  country: null,
  state: null,
  city: null,
  block: '',
  street: '',
  house: '',
  apartment: '',
  address2: '',
};

const useCheckoutStore = create<CheckoutState>((set, get) => ({
  currentStep: 'billing',
  guestTrackId: null,
  billingAddress: null,
  shippingAddress: null,
  useShippingForBilling: false,
  billingAddressId: 0,
  shippingAddressId: 0,
  selectedBillingAddressId: null,
  selectedShippingAddressId: null,
  billingAddresses: [],
  shippingAddresses: [],
  orderReviewData: null,
  isLoadingOrderReview: false,
  orderReviewError: null,
  isLoading: false,
  error: null,

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  setBillingAddress: (address) => {
    set({ billingAddress: address });
  },

  setShippingAddress: (address) => {
    set({ shippingAddress: address });
  },

  setUseShippingForBilling: (value) => {
    set({ useShippingForBilling: value });
  },

  registerGuestUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const payload: GuestUserRegistrationParams = {
        FullName: userData.fullName,
        Email: userData.email,
        Mobile: userData.mobile,
        Source: Platform.OS === 'ios' ? 'iOS' : 'Android',
      };
      
      console.log('🧪 Registering guest user with payload:', JSON.stringify(payload, null, 2));
      const response = await registerGuestUser(payload);
      console.log('🧪 Guest registration response:', JSON.stringify(response, null, 2));
      
      // Guest_SaveUserRegistration returns UserId in Data field
      if (response.ResponseCode === '2' && response.Data?.UserId) {
        console.log('✅ Guest registration successful, UserId:', response.Data.UserId);
        set({ 
          guestTrackId: response.Data.UserId, // Store UserId as guestTrackId
          isLoading: false,
          error: null
        });
        return true;
      } else {
        // API returned an error
        console.log('❌ Guest registration failed:', response.ResponseCode, response.Message);
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to register as guest user'
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Guest registration error:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to register as guest user'
      });
      return false;
    }
  },

  saveGuestBillingAddress: async (addressData: CheckoutAddress) => {
    const { guestTrackId } = get();
    if (!guestTrackId) {
      console.error('❌ No guest track ID available for saving billing address');
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const payload: SaveBillingAddressPayload = {
        BillingAddressId: 0, // 0 for new address
        FullName: addressData.fullName,
        Email: addressData.email,
        Mobile: addressData.mobile,
        Address2: addressData.address2,
        Country: addressData.country?.XCode.toString() || '',
        State: addressData.state?.XCode.toString() || '',
        City: addressData.city?.XCode.toString() || '',
        Block: addressData.block,
        Street: addressData.street,
        House: addressData.house,
        Apartment: addressData.apartment,
        IsDefault: 1, // 1 for true
        Command: 'Save',
        UserId: guestTrackId,
        CompanyId: 3044,
        IpAddress: await getDeviceIP(),
      };

      console.log('🏠 Saving guest billing address with payload:', JSON.stringify(payload, null, 2));
      const response = await saveBillingAddress(payload);
      console.log('🏠 Billing address save response:', JSON.stringify(response, null, 2));

      if (response.ResponseCode === '2' && response.TrackId) {
        console.log('✅ Guest billing address saved successfully, TrackId:', response.TrackId);
        // Store the TrackId as the billing address ID
        set({ 
          billingAddressId: parseInt(response.TrackId),
          isLoading: false,
          error: null
        });
        return true;
      } else {
        console.log('❌ Failed to save guest billing address:', response.ResponseCode, response.Message);
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to save billing address'
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving guest billing address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to save billing address'
      });
      return false;
    }
  },

  saveGuestShippingAddress: async (addressData: CheckoutAddress) => {
    const { guestTrackId } = get();
    if (!guestTrackId) {
      console.error('❌ No guest track ID available for saving shipping address');
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const payload: SaveShippingAddressPayload = {
        ShippingAddressId: 0, // 0 for new address
        FullName: addressData.fullName,
        Email: addressData.email,
        Mobile: addressData.mobile,
        Address2: addressData.address2,
        Country: addressData.country?.XCode.toString() || '',
        State: addressData.state?.XCode.toString() || '',
        City: addressData.city?.XCode.toString() || '',
        Block: addressData.block,
        Street: addressData.street,
        House: addressData.house,
        Apartment: addressData.apartment,
        IsDefault: 1, // 1 for true
        Command: 'Save',
        UserId: guestTrackId,
        CompanyId: 3044,
        IpAddress: await getDeviceIP(),
      };

      console.log('🏠 Saving guest shipping address with payload:', JSON.stringify(payload, null, 2));
      const response = await saveShippingAddress(payload);
      console.log('🏠 Shipping address save response:', JSON.stringify(response, null, 2));

      if (response.ResponseCode === '2' && response.TrackId) {
        console.log('✅ Guest shipping address saved successfully, TrackId:', response.TrackId);
        // Store the TrackId as the shipping address ID
        set({ 
          shippingAddressId: parseInt(response.TrackId),
          isLoading: false,
          error: null
        });
        return true;
      } else {
        console.log('❌ Failed to save guest shipping address:', response.ResponseCode, response.Message);
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to save shipping address'
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving guest shipping address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to save shipping address'
      });
      return false;
    }
  },

  fetchBillingAddressId: async () => {
    const { guestTrackId } = get();
    if (!guestTrackId) return;

    try {
      const response = await getAllBillingAddressesByUserId(guestTrackId);
      console.log('Fetching billing address ID response:', response);
      if (response.Data && response.Data.success === 1 && response.Data.row.length > 0) {
        // Use the first billing address ID if available
        const firstAddress = response.Data.row[0];
        const addressId = firstAddress.BillingAddressId || 0;
        console.log('Setting billing address ID to:', addressId);
        set({ billingAddressId: addressId });
      } else {
        // No addresses found, use 0
        console.log('No billing addresses found, setting to 0');
        set({ billingAddressId: 0 });
      }
    } catch (error) {
      console.error('Error fetching billing address ID:', error);
      set({ billingAddressId: 0 });
    }
  },

  fetchShippingAddressId: async () => {
    const { guestTrackId } = get();
    if (!guestTrackId) return;

    try {
      const response = await getAllShippingAddressesByUserId(guestTrackId);
      console.log('Fetching shipping address ID response:', response);
      if (response.Data && response.Data.success === 1 && response.Data.row.length > 0) {
        // Use the first shipping address ID if available
        const firstAddress = response.Data.row[0];
        const addressId = firstAddress.ShippingAddressId || 0;
        console.log('Setting shipping address ID to:', addressId);
        set({ shippingAddressId: addressId });
      } else {
        // No addresses found, use 0
        console.log('No shipping addresses found, setting to 0');
        set({ shippingAddressId: 0 });
      }
    } catch (error) {
      console.error('Error fetching shipping address ID:', error);
      set({ shippingAddressId: 0 });
    }
  },

  fetchDefaultAddresses: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('🏠 fetchDefaultAddresses called for user:', userId);
      
      // Since the default address APIs return no data, we'll fetch all addresses 
      // and use the ones marked as default
      await get().fetchAllAddresses(userId);
      
      const { billingAddresses, shippingAddresses } = get();
      console.log('🏠 After fetchAllAddresses - billingAddresses:', billingAddresses.length, 'shippingAddresses:', shippingAddresses.length);
      
      // Find default billing address
      const defaultBilling = billingAddresses.find(addr => addr.IsDefault === true || addr.IsDefault === 1);
      console.log('🏠 Default billing address found:', !!defaultBilling);
      if (defaultBilling) {
        const billingId = defaultBilling.BillingAddressId || null;
        console.log('🏠 Setting default billing address ID to:', billingId);
        set({ selectedBillingAddressId: billingId });
      } else if (billingAddresses.length > 0) {
        // If no default, use the first one
        const billingId = billingAddresses[0].BillingAddressId || null;
        console.log('🏠 No default billing found, using first address:', billingId);
        set({ selectedBillingAddressId: billingId });
      } else {
        console.log('🏠 No billing addresses found');
        set({ selectedBillingAddressId: null });
      }
      
      // Find default shipping address
      const defaultShipping = shippingAddresses.find(addr => addr.IsDefault === true || addr.IsDefault === 1);
      console.log('🏠 Default shipping address found:', !!defaultShipping);
      if (defaultShipping) {
        const shippingId = defaultShipping.ShippingAddressId || null;
        console.log('🏠 Setting default shipping address ID to:', shippingId);
        set({ selectedShippingAddressId: shippingId });
      } else if (shippingAddresses.length > 0) {
        // If no default, use the first one
        const shippingId = shippingAddresses[0].ShippingAddressId || null;
        console.log('🏠 No default shipping found, using first address:', shippingId);
        set({ selectedShippingAddressId: shippingId });
      } else {
        console.log('🏠 No shipping addresses found');
        set({ selectedShippingAddressId: null });
      }
      
      set({ isLoading: false });
      console.log('🏠 fetchDefaultAddresses completed');
    } catch (error) {
      console.error('🏠 Error fetching default addresses:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch default addresses' 
      });
    }
  },

  fetchAllAddresses: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('🏠 Fetching all addresses for user:', userId);
      
      // Use the corrected checkout-specific APIs with proper parameter structure
      console.log('🏠 Fetching billing addresses...');
      const billingResponse = await getAllBillingAddressesByUserId(userId);
      console.log('🏠 Billing addresses response:', JSON.stringify(billingResponse, null, 2));
      const billingAddresses = billingResponse.Data?.row || [];
      console.log('🏠 Found', billingAddresses.length, 'billing addresses');
      
      // Fetch all shipping addresses
      console.log('🏠 Fetching shipping addresses...');
      const shippingResponse = await getAllShippingAddressesByUserId(userId);
      console.log('🏠 Shipping addresses response:', JSON.stringify(shippingResponse, null, 2));
      const shippingAddresses = shippingResponse.Data?.row || [];
      console.log('🏠 Found', shippingAddresses.length, 'shipping addresses');
      
      set({ 
        billingAddresses,
        shippingAddresses,
        isLoading: false 
      });
      
      console.log('🏠 Addresses stored in checkout store');
    } catch (error) {
      console.error('🏠 Error fetching all addresses:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch addresses' 
      });
    }
  },

  setSelectedBillingAddressId: (id: number) => {
    set({ selectedBillingAddressId: id });
  },

  setSelectedShippingAddressId: (id: number) => {
    set({ selectedShippingAddressId: id });
  },

  fetchOrderReview: async (params: OrderReviewCheckoutParams) => {
    set({ isLoadingOrderReview: true, orderReviewError: null });
    
    try {
      console.log('🛒 FETCH ORDER REVIEW - Starting with params:', JSON.stringify(params, null, 2));
      const response = await getOrderReviewCheckout(params);
      
      console.log('🛒 FETCH ORDER REVIEW - Full API response:', JSON.stringify(response, null, 2));
      console.log('🛒 FETCH ORDER REVIEW - Response.Data:', response.Data);
      console.log('🛒 FETCH ORDER REVIEW - Response.Data.ResponseCode:', response.Data?.ResponseCode);
      console.log('🛒 FETCH ORDER REVIEW - Response.Data.li:', response.Data?.li);
      console.log('🛒 FETCH ORDER REVIEW - Response.Data.li length:', response.Data?.li?.length);
      
      if (response.Data && response.Data.ResponseCode === '2') {
        // API call was successful
        if (response.Data.li && response.Data.li.length > 0) {
          // We have order review data
          const orderData = response.Data.li[0];
          console.log('🛒 FETCH ORDER REVIEW - Order data to store:', JSON.stringify(orderData, null, 2));
          console.log('🛒 FETCH ORDER REVIEW - Order data fields:');
          console.log('🛒   - SubTotal:', orderData.SubTotal, 'type:', typeof orderData.SubTotal);
          console.log('🛒   - Discount:', orderData.Discount, 'type:', typeof orderData.Discount);
          console.log('🛒   - ShippingCharge:', orderData.ShippingCharge, 'type:', typeof orderData.ShippingCharge);
          console.log('🛒   - GrandTotal:', orderData.GrandTotal, 'type:', typeof orderData.GrandTotal);
          
          set({ 
            orderReviewData: orderData,
            isLoadingOrderReview: false,
            orderReviewError: null
          });
          
          console.log('🛒 FETCH ORDER REVIEW - Data stored successfully');
          return true;
        } else {
          // No data but API was successful (e.g., empty cart, no location codes)
          // Don't show error, just clear the data
          console.log('🛒 FETCH ORDER REVIEW - No data in li array, clearing orderReviewData');
          set({ 
            orderReviewData: null,
            isLoadingOrderReview: false,
            orderReviewError: null
          });
          return true; // Still return true since API call was successful
        }
      } else {
        // API returned an actual error
        console.log('🛒 FETCH ORDER REVIEW - API returned error, ResponseCode:', response.Data?.ResponseCode);
        set({ 
          isLoadingOrderReview: false, 
          orderReviewError: response.Data?.Message || response.Message || 'Failed to fetch order review'
        });
        return false;
      }
    } catch (error) {
      console.error('🛒 FETCH ORDER REVIEW - Exception occurred:', error);
      set({ 
        isLoadingOrderReview: false, 
        orderReviewError: error instanceof Error ? error.message : 'Failed to fetch order review'
      });
      return false;
    }
  },

  clearOrderReviewError: () => {
    set({ orderReviewError: null });
  },

  triggerOrderReviewUpdate: async () => {
    const currentState = get();
    
    // Get cart store to access unique ID
    const cartStore = (await import('./cart-store')).default;
    const uniqueId = cartStore.getState().getUniqueId();
    
    // Get auth store to check if user is logged in
    const authStore = (await import('./auth-store')).default;
    const user = authStore.getState().user;
    const isLoggedIn = !!user;
    
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Starting automatic order review update');
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - User status:', isLoggedIn ? 'Logged in' : 'Guest');
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - UniqueId:', uniqueId);
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Current state billing addresses:', currentState.billingAddresses.length);
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Selected billing address ID:', currentState.selectedBillingAddressId);
    
    // Get the device IP address - this is critical for cart item matching
    const { getDeviceIP } = await import('../utils/ip-utils');
    const deviceIP = await getDeviceIP();
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Using device IP:', deviceIP);
    
    // Determine location parameters
    let country = '';
    let stateCode = '';
    let city = '';
    
    if (isLoggedIn) {
      // For logged-in users, try to get location from selected billing address
      const selectedBilling = currentState.billingAddresses.find(addr => 
        addr.BillingAddressId === currentState.selectedBillingAddressId
      );
      console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Selected billing address found:', !!selectedBilling);
      if (selectedBilling) {
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Selected billing address details:', JSON.stringify(selectedBilling, null, 2));
        country = selectedBilling.CountryId?.toString() || '';
        stateCode = selectedBilling.StateId?.toString() || '';
        city = selectedBilling.CityId?.toString() || '';
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Using logged-in user address location codes:', { country, stateCode, city });
        
        // If CountryId/StateId/CityId are not available, try using Country/State/City strings
        if (!country && selectedBilling.Country) {
          console.log('🛒 TRIGGER ORDER REVIEW UPDATE - CountryId not found, trying Country string:', selectedBilling.Country);
          country = selectedBilling.Country;
        }
        if (!stateCode && selectedBilling.State) {
          console.log('🛒 TRIGGER ORDER REVIEW UPDATE - StateId not found, trying State string:', selectedBilling.State);
          stateCode = selectedBilling.State;
        }
        if (!city && selectedBilling.City) {
          console.log('🛒 TRIGGER ORDER REVIEW UPDATE - CityId not found, trying City string:', selectedBilling.City);
          city = selectedBilling.City;
        }
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Final location codes after fallback:', { country, stateCode, city });
      } else {
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - No selected billing address found for logged-in user');
      }
    } else {
      // For guest users
      console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Guest billing address:', !!currentState.billingAddress);
      if (currentState.billingAddress) {
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Guest billing address details:', JSON.stringify(currentState.billingAddress, null, 2));
        country = currentState.billingAddress.country?.XCode.toString() || '';
        stateCode = currentState.billingAddress.state?.XCode.toString() || '';
        city = currentState.billingAddress.city?.XCode.toString() || '';
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Using guest billing address location codes:', { country, stateCode, city });
      } else {
        console.log('🛒 TRIGGER ORDER REVIEW UPDATE - No guest billing address available - calling without location codes');
      }
    }
    
    const params: OrderReviewCheckoutParams = {
      Country: country,
      State: stateCode,
      City: city,
      UniqueId: uniqueId,
      IpAddress: deviceIP,
      CultureId: parseInt(useLanguageStore.getState().getCultureId()),
      Company: 3044,
      UserId: isLoggedIn ? (user?.UserID || '') : '',
      BuyNow: ''
    };
    
    console.log('🛒 TRIGGER ORDER REVIEW UPDATE - Final params for order review call:', JSON.stringify(params, null, 2));
    await get().fetchOrderReview(params);
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      currentStep: 'billing',
      guestTrackId: null,
      billingAddress: null,
      shippingAddress: null,
      useShippingForBilling: false,
      billingAddressId: 0,
      shippingAddressId: 0,
      selectedBillingAddressId: null,
      selectedShippingAddressId: null,
      billingAddresses: [],
      shippingAddresses: [],
      orderReviewData: null,
      isLoadingOrderReview: false,
      orderReviewError: null,
      isLoading: false,
      error: null,
    });
  }
}));

export default useCheckoutStore; 