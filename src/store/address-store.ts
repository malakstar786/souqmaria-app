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
  address?: string; // Combined address field returned by API
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
  
  // Helper to clear error state
  clearError: () => void;
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

// Helper to check if a response code indicates success
const isSuccessCode = (code: string | number | undefined): boolean => {
  if (!code) return false;
  
  // Convert to string for consistent comparison
  const codeStr = String(code);
  
  // Define endpoint-specific success codes
  const successCodes = {
    general: ['2', '200'],
    billingAddressSave: ['2'],
    billingAddressUpdate: ['2'],
    billingAddressDelete: ['6'],
    shippingAddressSave: ['2'],
    shippingAddressUpdate: ['4'],
    shippingAddressDelete: ['6']
  };
  
  // Check if code is in any of the success code arrays
  return Object.values(successCodes).some(codes => codes.includes(codeStr));
};

// Transform API billing address to our Address interface
const transformBillingAddress = (apiAddress: any): Address => {
  return {
    id: apiAddress.BillingAddressId,
    fullName: apiAddress.FullName || '',
    email: apiAddress.Email || '',
    mobile: apiAddress.Mobile || '',
    country: String(apiAddress.CountryId || ''),
    countryName: apiAddress.Country || '',
    state: String(apiAddress.StateId || ''),
    stateName: apiAddress.State || '',
    city: String(apiAddress.CityId || ''),
    cityName: apiAddress.City || '',
    block: apiAddress.Block || '',
    street: apiAddress.Street || '',
    house: apiAddress.House || '',
    apartment: apiAddress.Apartment || '',
    address2: apiAddress.Address2 || '',
    address: apiAddress.Address || '',
    isDefault: apiAddress.IsDefault === true || apiAddress.IsDefault === 1,
  };
};

// Transform API shipping address to our Address interface
const transformShippingAddress = (apiAddress: any): Address => {
  return {
    id: apiAddress.ShippingAddressId,
    fullName: apiAddress.FullName || '',
    email: apiAddress.Email || '',
    mobile: apiAddress.Mobile || '',
    // Country, State, City might be provided as names directly in address list
    country: String(apiAddress.CountryId || ''),
    countryName: apiAddress.Country || '',
    state: String(apiAddress.StateId || ''),
    stateName: apiAddress.State || '',
    city: String(apiAddress.CityId || ''),
    cityName: apiAddress.City || '',
    block: apiAddress.Block || '',
    street: apiAddress.Street || '',
    house: apiAddress.House || '',
    apartment: apiAddress.Apartment || '',
    address2: apiAddress.Address2 || '',
    // Use custom Address field if present (from address list endpoint)
    address: apiAddress.Address || '',
    isDefault: apiAddress.IsDefault === true || apiAddress.IsDefault === 1,
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
      // Make sure addressData has all the required fields
      if (!addressData.UserId) {
        set({ 
          isLoading: false, 
          error: 'User ID is required. Please login again.'
        });
        return false;
      }
      
      // Ensure it uses CompanyId as required by this endpoint
      const response = await apiRequest(
        ENDPOINTS.CRUD_BILLING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Billing address save response:', JSON.stringify(response, null, 2));
      
      // API responses can have inconsistent casing, normalize it
      const statusCode = response?.StatusCode || response?.statusCode || 200;
      const responseCode = response?.ResponseCode || response?.responseCode;
      const responseMessage = response?.Message || response?.message;
      const codeStr = String(responseCode);
      
      // Check specifically for billing address save success code (2)
      if (codeStr === '2') {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after saving
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: responseMessage || 'Failed to save billing address'
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
      // Make sure addressData has all the required fields
      if (!addressData.UserId) {
        set({ 
          isLoading: false, 
          error: 'User ID is required. Please login again.'
        });
        return false;
      }
      
      // Ensure it uses CompanyId as required by this endpoint
      const response = await apiRequest(
        ENDPOINTS.CRUD_BILLING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Billing address update response:', JSON.stringify(response, null, 2));
      
      // API responses can have inconsistent casing, normalize it
      const statusCode = response?.StatusCode || response?.statusCode || 200;
      const responseCode = response?.ResponseCode || response?.responseCode;
      const responseMessage = response?.Message || response?.message;
      const codeStr = String(responseCode);
      
      // Check specifically for billing address update success code (2)
      if (codeStr === '2') {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after updating
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: responseMessage || 'Failed to update billing address'
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
      if (!userId) {
        set({ 
          isLoading: false, 
          error: 'User ID is required. Please login again.'
        });
        return false;
      }
      
      const payload = {
        BillingAddressId: addressId,
        UserId: userId,
        CompanyId: 3044, // This endpoint requires CompanyId
        IpAddress: '127.0.0.1',
        Command: 'Delete'
      };
      
      const response = await apiRequest(
        ENDPOINTS.CRUD_BILLING_ADDRESS,
        'POST',
        payload
      );
      
      console.log('Billing address delete response:', JSON.stringify(response, null, 2));
      
      // API responses can have inconsistent casing, normalize it
      const statusCode = response?.StatusCode || response?.statusCode || 200;
      const responseCode = response?.ResponseCode || response?.responseCode;
      const responseMessage = response?.Message || response?.message;
      const codeStr = String(responseCode);
      
      // For delete, the API returns response code 6
      if (codeStr === '6') {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after deletion
        await get().fetchUserAddresses(userId);
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: responseMessage || 'Failed to delete billing address'
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
      // Make sure addressData has all the required fields
      if (!addressData.UserId) {
        set({ 
          isLoading: false, 
          error: 'User ID is required. Please login again.'
        });
        return false;
      }
      
      console.log('Shipping address payload with userId:', addressData.UserId);
      
      // Ensure it uses CompanyId as required by this endpoint
      const response = await apiRequest(
        ENDPOINTS.CRUD_SHIPPING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Shipping address save response:', JSON.stringify(response, null, 2));
      
      // API responses can have inconsistent casing, normalize it
      const statusCode = response?.StatusCode || response?.statusCode || 200;
      const responseCode = response?.ResponseCode || response?.responseCode;
      const responseMessage = response?.Message || response?.message;
      const codeStr = String(responseCode);
      
      // Check specifically for shipping address save success code (2)
      if (codeStr === '2') {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after saving
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: responseMessage || 'Failed to save shipping address'
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
      // Make sure addressData has all the required fields
      if (!addressData.UserId) {
        set({ 
          isLoading: false, 
          error: 'User ID is required. Please login again.'
        });
        return false;
      }
      
      // Ensure it uses CompanyId as required by this endpoint
      const response = await apiRequest(
        ENDPOINTS.CRUD_SHIPPING_ADDRESS,
        'POST',
        addressData
      );
      
      console.log('Shipping address update response:', JSON.stringify(response, null, 2));
      
      // API responses can have inconsistent casing, normalize it
      const statusCode = response?.StatusCode || response?.statusCode || 200;
      const responseCode = response?.ResponseCode || response?.responseCode;
      const responseMessage = response?.Message || response?.message;
      const codeStr = String(responseCode);
      
      // For shipping address update, the API returns response code 4
      if (codeStr === '4') {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after updating
        if (addressData.UserId) {
          await get().fetchUserAddresses(addressData.UserId);
        }
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: responseMessage || 'Failed to update shipping address'
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
      if (!userId) {
        set({ 
          isLoading: false, 
          error: 'User ID is required. Please login again.'
        });
        return false;
      }
      
      const payload = {
        ShippingAddressId: addressId,
        UserId: userId,
        CompanyId: 3044, // This endpoint requires CompanyId
        IpAddress: '127.0.0.1',
        Command: 'Delete'
      };
      
      const response = await apiRequest(
        ENDPOINTS.CRUD_SHIPPING_ADDRESS,
        'POST',
        payload
      );
      
      console.log('Shipping address delete response:', JSON.stringify(response, null, 2));
      
      // API responses can have inconsistent casing, normalize it
      const statusCode = response?.StatusCode || response?.statusCode || 200;
      const responseCode = response?.ResponseCode || response?.responseCode;
      const responseMessage = response?.Message || response?.message;
      const codeStr = String(responseCode);
      
      // For shipping address delete, the API returns response code 6
      if (codeStr === '6') {
        set({ isLoading: false, error: null }); // clear error on success
        // Refresh user addresses after deletion
        await get().fetchUserAddresses(userId);
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: responseMessage || 'Failed to delete shipping address'
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
        hasData: billingResponse.Data?.success === 1 && Array.isArray(billingResponse.Data.row),
        rawData: billingResponse.Data
      }, null, 2));
      
      // Only try to map billing addresses if there's real data
      if (billingResponse.Data?.success === 1 && Array.isArray(billingResponse.Data.row) && billingResponse.Data.row.length > 0) {
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
        hasData: shippingResponse.Data?.success === 1 && Array.isArray(shippingResponse.Data.row),
        rawData: shippingResponse.Data
      }, null, 2));
      
      // Only try to map shipping addresses if there's real data
      if (shippingResponse.Data?.success === 1 && Array.isArray(shippingResponse.Data.row) && shippingResponse.Data.row.length > 0) {
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
  },
  
  // Helper to clear error state
  clearError: () => set({ error: null }),
}));

export default useAddressStore; 