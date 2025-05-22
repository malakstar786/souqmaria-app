import { create } from 'zustand';
import { 
  registerGuestUser, 
  GuestUserRegistrationParams,
  getDefaultBillingAddressByUserId, 
  getDefaultShippingAddressByUserId,
  getAllBillingAddressesByUserId,
  getAllShippingAddressesByUserId,
  ApiAddress
} from '../utils/api-service';
import { Platform } from 'react-native';
import { RESPONSE_CODES } from '../utils/api-config';

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
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentStep: (step: 'billing' | 'shipping' | 'payment' | 'confirmation') => void;
  setBillingAddress: (address: CheckoutAddress) => void;
  setShippingAddress: (address: CheckoutAddress) => void;
  setUseShippingForBilling: (value: boolean) => void;
  registerGuestUser: (userData: { fullName: string; email: string; mobile: string }) => Promise<boolean>;
  fetchBillingAddressId: () => Promise<void>;
  fetchShippingAddressId: () => Promise<void>;
  
  // New actions for logged-in users
  fetchDefaultAddresses: (userId: string) => Promise<void>;
  fetchAllAddresses: (userId: string) => Promise<void>;
  setSelectedBillingAddressId: (id: number) => void;
  setSelectedShippingAddressId: (id: number) => void;
  
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
      
      const response = await registerGuestUser(payload);
      
      // Accept both success (2) and already registered (4) responses
      if ((response.ResponseCode === '2' || response.ResponseCode === '4') && response.TrackId) {
        set({ 
          guestTrackId: response.TrackId, 
          isLoading: false,
          error: null
        });
        return true;
      } else {
        // API returned an error
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to register as guest user'
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to register as guest user'
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
      // Fetch default billing address
      const billingResponse = await getDefaultBillingAddressByUserId(userId);
      console.log('Default billing address response:', billingResponse);
      if (billingResponse.Data?.row && billingResponse.Data.row.length > 0) {
        const defaultBilling = billingResponse.Data.row[0];
        const billingId = defaultBilling.BillingAddressId || null;
        console.log('Setting default billing address ID to:', billingId);
        set({ selectedBillingAddressId: billingId });
      } else {
        console.log('No default billing address found');
        set({ selectedBillingAddressId: null });
      }
      
      // Fetch default shipping address  
      const shippingResponse = await getDefaultShippingAddressByUserId(userId);
      console.log('Default shipping address response:', shippingResponse);
      if (shippingResponse.Data?.row && shippingResponse.Data.row.length > 0) {
        const defaultShipping = shippingResponse.Data.row[0];
        const shippingId = defaultShipping.ShippingAddressId || null;
        console.log('Setting default shipping address ID to:', shippingId);
        set({ selectedShippingAddressId: shippingId });
      } else {
        console.log('No default shipping address found');
        set({ selectedShippingAddressId: null });
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching default addresses:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch default addresses' 
      });
    }
  },

  fetchAllAddresses: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch all billing addresses
      const billingResponse = await getAllBillingAddressesByUserId(userId);
      const billingAddresses = billingResponse.Data?.row || [];
      
      // Fetch all shipping addresses
      const shippingResponse = await getAllShippingAddressesByUserId(userId);
      const shippingAddresses = shippingResponse.Data?.row || [];
      
      set({ 
        billingAddresses,
        shippingAddresses,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching all addresses:', error);
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
      isLoading: false,
      error: null,
    });
  }
}));

export default useCheckoutStore; 