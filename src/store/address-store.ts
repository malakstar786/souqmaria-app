import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS, API_BASE_URL, RESPONSE_CODES } from '../utils/api-config';
import { getBillingAddresses, getShippingAddresses } from '../utils/api-service';

export interface Address {
  id: number; // Maps to BillingAddressId or ShippingAddressId from API
  fullName: string;
  email: string;
  mobile: string;
  country: string;
  countryName: string;
  state: string;
  stateName: string;
  city: string;
  cityName: string;
  block: string;
  street: string;
  house: string;
  apartment?: string;
  address2?: string;
  isDefault: boolean;
}

interface AddressState {
  billingAddresses: Address[];
  shippingAddresses: Address[];
  isLoading: boolean;
  error: string | null;
  
  // Address CRUD operations
  saveBillingAddress: (addressData: any) => Promise<boolean>;
  updateBillingAddress: (addressData: any) => Promise<boolean>;
  deleteBillingAddress: (addressId: number, userId: string) => Promise<boolean>;
  saveShippingAddress: (addressData: any) => Promise<boolean>;
  updateShippingAddress: (addressData: any) => Promise<boolean>;
  deleteShippingAddress: (addressId: number, userId: string) => Promise<boolean>;
  
  // Fetch user addresses
  fetchUserAddresses: (userId: string) => Promise<void>;
  
  // Reset store
  reset: () => void;
}

// Helper function for API requests
const apiRequest = async (endpoint: string, method: string, data: any) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper function to normalize response code for comparison
const normalizeResponseCode = (code: any): string | number => {
  if (code === undefined) return '';
  // Convert to string or number as needed
  return typeof code === 'string' ? code : Number(code);
};

// Helper function to check if a response code indicates success
const isSuccessCode = (code: any): boolean => {
  const normalizedCode = normalizeResponseCode(code);
  return (
    normalizedCode === RESPONSE_CODES.SUCCESS || 
    normalizedCode === RESPONSE_CODES.SUCCESS_ALT ||
    normalizedCode === RESPONSE_CODES.success || 
    normalizedCode === RESPONSE_CODES.success_alt ||
    normalizedCode === 2 // Fallback for numeric 2
  );
};

// Transform API address data to our Address interface
const transformBillingAddress = (apiAddress: any): Address => {
  return {
    id: apiAddress.BillingAddressId,
    fullName: apiAddress.FullName || '',
    email: apiAddress.Email || '',
    mobile: apiAddress.Mobile || '',
    country: apiAddress.Country || '',
    countryName: apiAddress.CountryName || '',
    state: apiAddress.State || '',
    stateName: apiAddress.StateName || '',
    city: apiAddress.City || '',
    cityName: apiAddress.CityName || '',
    block: apiAddress.Block || '',
    street: apiAddress.Street || '',
    house: apiAddress.House || '',
    apartment: apiAddress.Apartment || '',
    address2: apiAddress.Address2 || '',
    isDefault: apiAddress.IsDefault === 1 || apiAddress.IsDefault === true,
  };
};

const transformShippingAddress = (apiAddress: any): Address => {
  return {
    id: apiAddress.ShippingAddressId,
    fullName: apiAddress.FullName || '',
    email: apiAddress.Email || '',
    mobile: apiAddress.Mobile || '',
    country: apiAddress.Country || '',
    countryName: apiAddress.CountryName || '',
    state: apiAddress.State || '',
    stateName: apiAddress.StateName || '',
    city: apiAddress.City || '',
    cityName: apiAddress.CityName || '',
    block: apiAddress.Block || '',
    street: apiAddress.Street || '',
    house: apiAddress.House || '',
    apartment: apiAddress.Apartment || '',
    address2: apiAddress.Address2 || '',
    isDefault: apiAddress.IsDefault === 1 || apiAddress.IsDefault === true,
  };
};

const useAddressStore = create<AddressState>((set, get) => ({
  billingAddresses: [],
  shippingAddresses: [],
  isLoading: false,
  error: null,
  
  // Save new billing address
  saveBillingAddress: async (addressData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest(
        ENDPOINTS.CRUD_BILLING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Billing address save response:', JSON.stringify(response, null, 2));
      
      const statusCode = response?.StatusCode || response?.statusCode;
      const responseCode = response?.ResponseCode || response?.responseCode;
      
      // Check for success with case-insensitive comparison
      if (statusCode === 200 && isSuccessCode(responseCode)) {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after saving
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || response?.message || 'Failed to save billing address'
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving billing address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error saving address'
      });
      return false;
    }
  },
  
  // Update existing billing address
  updateBillingAddress: async (addressData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest(
        ENDPOINTS.CRUD_BILLING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Billing address update response:', JSON.stringify(response, null, 2));
      
      const statusCode = response?.StatusCode || response?.statusCode;
      const responseCode = response?.ResponseCode || response?.responseCode;
      
      if (statusCode === 200 && isSuccessCode(responseCode)) {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after updating
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || response?.message || 'Failed to update billing address'
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating billing address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error updating address'
      });
      return false;
    }
  },
  
  // Delete billing address
  deleteBillingAddress: async (addressId, userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest(
        ENDPOINTS.CRUD_BILLING_ADDRESS,
        'POST',
        {
          BillingAddressId: addressId,
          UserId: userId,
          Company: 3044,
          IpAddress: '127.0.0.1',
          Command: 'Delete'
        }
      );
      
      console.log('Billing address delete response:', JSON.stringify(response, null, 2));
      
      const statusCode = response?.StatusCode || response?.statusCode;
      const responseCode = response?.ResponseCode || response?.responseCode;
      
      // For delete, the API returns response code 6
      if (statusCode === 200 && 
         (responseCode === 6 || responseCode === '6' || 
          responseCode === RESPONSE_CODES.DELETED_SUCCESS)) {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after deletion
        await get().fetchUserAddresses(userId);
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || response?.message || 'Failed to delete billing address'
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting billing address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error deleting address'
      });
      return false;
    }
  },
  
  // Save new shipping address
  saveShippingAddress: async (addressData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest(
        ENDPOINTS.CRUD_SHIPPING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Shipping address save response:', JSON.stringify(response, null, 2));
      
      const statusCode = response?.StatusCode || response?.statusCode;
      const responseCode = response?.ResponseCode || response?.responseCode;
      
      if (statusCode === 200 && isSuccessCode(responseCode)) {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after saving
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || response?.message || 'Failed to save shipping address'
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving shipping address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error saving address'
      });
      return false;
    }
  },
  
  // Update existing shipping address
  updateShippingAddress: async (addressData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest(
        ENDPOINTS.CRUD_SHIPPING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Shipping address update response:', JSON.stringify(response, null, 2));
      
      const statusCode = response?.StatusCode || response?.statusCode;
      const responseCode = response?.ResponseCode || response?.responseCode;
      
      // For shipping address update, the API accepts both response code 2 and 4
      // but per documentation it should return 4
      if (statusCode === 200 && 
         (responseCode === 4 || responseCode === '4' || 
          responseCode === RESPONSE_CODES.SHIPPING_ADDRESS_UPDATE_SUCCESS ||
          isSuccessCode(responseCode))) {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after updating
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || response?.message || 'Failed to update shipping address'
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating shipping address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error updating address'
      });
      return false;
    }
  },
  
  // Delete shipping address
  deleteShippingAddress: async (addressId, userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest(
        ENDPOINTS.CRUD_SHIPPING_ADDRESS,
        'POST',
        {
          ShippingAddressId: addressId,
          UserId: userId,
          Company: 3044,
          IpAddress: '127.0.0.1',
          Command: 'Delete'
        }
      );
      
      console.log('Shipping address delete response:', JSON.stringify(response, null, 2));
      
      const statusCode = response?.StatusCode || response?.statusCode;
      const responseCode = response?.ResponseCode || response?.responseCode;
      
      // For delete, the API returns response code 6
      if (statusCode === 200 && 
         (responseCode === 6 || responseCode === '6' || 
          responseCode === RESPONSE_CODES.DELETED_SUCCESS)) {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after deletion
        await get().fetchUserAddresses(userId);
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || response?.message || 'Failed to delete shipping address'
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting shipping address:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error deleting address'
      });
      return false;
    }
  },
  
  // Fetch both billing and shipping addresses for a user
  fetchUserAddresses: async (userId?: string) => {
    if (!userId) {
      console.error('🏠 fetchUserAddresses: No userId provided!');
      set({ error: 'User ID is required to fetch addresses' });
      return;
    }
    
    console.log('🏠 Fetching addresses for user:', userId);
    set({ isLoading: true, error: null });
    
    try {
      // Fetch billing addresses
      const billingResponse = await getBillingAddresses(userId);
      console.log('🏠 Billing addresses response:', JSON.stringify({
        statusCode: billingResponse.StatusCode,
        responseCode: billingResponse.ResponseCode,
        message: billingResponse.Message,
        hasData: billingResponse.Data?.success === 1 && Array.isArray(billingResponse.Data.row)
      }, null, 2));
      
      if (billingResponse.Data?.success === 1 && Array.isArray(billingResponse.Data.row)) {
        const mappedBillingAddresses = billingResponse.Data.row.map(transformBillingAddress);
        set({ billingAddresses: mappedBillingAddresses });
        console.log(`🏠 Found ${mappedBillingAddresses.length} billing addresses`);
      } else {
        set({ billingAddresses: [] });
        console.log('🏠 No billing addresses found');
      }
      
      // Fetch shipping addresses
      const shippingResponse = await getShippingAddresses(userId);
      console.log('🏠 Shipping addresses response:', JSON.stringify({
        statusCode: shippingResponse.StatusCode,
        responseCode: shippingResponse.ResponseCode,
        message: shippingResponse.Message,
        hasData: shippingResponse.Data?.success === 1 && Array.isArray(shippingResponse.Data.row)
      }, null, 2));
      
      if (shippingResponse.Data?.success === 1 && Array.isArray(shippingResponse.Data.row)) {
        const mappedShippingAddresses = shippingResponse.Data.row.map(transformShippingAddress);
        set({ shippingAddresses: mappedShippingAddresses });
        console.log(`🏠 Found ${mappedShippingAddresses.length} shipping addresses`);
      } else {
        set({ shippingAddresses: [] });
        console.log('🏠 No shipping addresses found');
      }
      
      set({ isLoading: false, error: null });
    } catch (error) {
      console.error('🏠 Error fetching addresses:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch addresses',
        billingAddresses: [],
        shippingAddresses: []
      });
    }
  },
  
  // Reset the store state
  reset: () => {
    set({
      billingAddresses: [],
      shippingAddresses: [],
      isLoading: false,
      error: null
    });
  }
}));

export default useAddressStore; 