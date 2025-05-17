import { create } from 'zustand';
import { 
  saveBillingAddress,
  SaveBillingAddressPayload,
  updateBillingAddress,
  deleteBillingAddress,
  saveShippingAddress,
  SaveShippingAddressPayload,
  updateShippingAddress,
  deleteShippingAddress
} from '../utils/api-service';
import { useAuthStore } from './auth-store';

// Address types
export interface BillingAddress {
  BillingAddressId: number;
  FullName: string;
  Email: string;
  Mobile: string;
  Address2?: string;
  Country: string;
  State: string;
  City: string;
  Block: string;
  Street: string;
  House: string;
  Apartment?: string;
  IsDefault: boolean;
}

export interface ShippingAddress {
  ShippingAddressId: number;
  FullName: string;
  Email: string;
  Mobile: string;
  Address2?: string;
  Country: string;
  State: string;
  City: string;
  Block: string;
  Street: string;
  House: string;
  Apartment?: string;
  IsDefault: boolean;
}

// Address state
interface AddressState {
  billingAddresses: BillingAddress[];
  shippingAddresses: ShippingAddress[];
  isLoading: boolean;
  error: string | null;
  
  // Billing Address Actions
  saveBillingAddress: (address: Omit<SaveBillingAddressPayload, 'Command' | 'UserId' | 'CompanyId' | 'IpAddress'>) => Promise<boolean>;
  updateBillingAddress: (address: Omit<SaveBillingAddressPayload, 'Command' | 'UserId' | 'CompanyId' | 'IpAddress'>) => Promise<boolean>;
  deleteBillingAddress: (addressId: number) => Promise<boolean>;
  
  // Shipping Address Actions
  saveShippingAddress: (address: Omit<SaveShippingAddressPayload, 'Command' | 'UserId' | 'CompanyId' | 'IpAddress'>) => Promise<boolean>;
  updateShippingAddress: (address: Omit<SaveShippingAddressPayload, 'Command' | 'UserId' | 'CompanyId' | 'IpAddress'>) => Promise<boolean>;
  deleteShippingAddress: (addressId: number) => Promise<boolean>;
  
  clearError: () => void;
}

// Create address store
export const useAddressStore = create<AddressState>((set, get) => ({
  billingAddresses: [],
  shippingAddresses: [],
  isLoading: false,
  error: null,
  
  // Save a new billing address
  saveBillingAddress: async (address) => {
    const user = useAuthStore.getState().user;
    if (!user?.UserID) {
      set({ error: 'User not found. Please log in again.' });
      return false;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const payload: SaveBillingAddressPayload = {
        ...address,
        Command: 'Save',
        UserId: user.UserID,
        CompanyId: 3044,
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
        IsDefault: typeof address.IsDefault === 'boolean' ? (address.IsDefault ? 1 : 0) : address.IsDefault,
      };
      
      const response = await saveBillingAddress(payload);
      
      if (response.StatusCode === 200 && String(response.ResponseCode) === '2') {
        // Add the new address to the state (with the ID if available from response)
        const newAddress: BillingAddress = {
          ...address,
          BillingAddressId: response.Data?.BillingAddressId || address.BillingAddressId,
          IsDefault: Boolean(address.IsDefault),
        };
        
        set((state) => ({
          billingAddresses: [...state.billingAddresses, newAddress],
          isLoading: false,
          error: null,
        }));
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to save billing address.' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to save billing address due to a network error.' 
      });
      return false;
    }
  },
  
  // Update an existing billing address
  updateBillingAddress: async (address) => {
    const user = useAuthStore.getState().user;
    if (!user?.UserID) {
      set({ error: 'User not found. Please log in again.' });
      return false;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const payload: SaveBillingAddressPayload = {
        ...address,
        Command: 'Update',
        UserId: user.UserID,
        CompanyId: 3044,
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
        IsDefault: typeof address.IsDefault === 'boolean' ? (address.IsDefault ? 1 : 0) : address.IsDefault,
      };
      
      const response = await updateBillingAddress(payload);
      
      if (response.StatusCode === 200 && String(response.ResponseCode) === '2') {
        // Update the address in the state
        set((state) => ({
          billingAddresses: state.billingAddresses.map((a) => 
            a.BillingAddressId === address.BillingAddressId
              ? { ...address, IsDefault: Boolean(address.IsDefault) }
              : a
          ),
          isLoading: false,
          error: null,
        }));
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to update billing address.' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to update billing address due to a network error.' 
      });
      return false;
    }
  },
  
  // Delete a billing address
  deleteBillingAddress: async (addressId) => {
    const user = useAuthStore.getState().user;
    if (!user?.UserID) {
      set({ error: 'User not found. Please log in again.' });
      return false;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await deleteBillingAddress({
        BillingAddressId: addressId,
        UserId: user.UserID,
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
        CompanyId: 3044,
        Command: 'Delete'
      });
      
      if (response.StatusCode === 200 && String(response.ResponseCode) === '6') {
        // Remove the address from the state
        set((state) => ({
          billingAddresses: state.billingAddresses.filter(
            (a) => a.BillingAddressId !== addressId
          ),
          isLoading: false,
          error: null,
        }));
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to delete billing address.' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to delete billing address due to a network error.' 
      });
      return false;
    }
  },

  // Save a new shipping address
  saveShippingAddress: async (address) => {
    const user = useAuthStore.getState().user;
    if (!user?.UserID) {
      set({ error: 'User not found. Please log in again.' });
      return false;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const payload: SaveShippingAddressPayload = {
        ...address,
        Command: 'Save',
        UserId: user.UserID,
        CompanyId: 3044,
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
        IsDefault: typeof address.IsDefault === 'boolean' ? (address.IsDefault ? 1 : 0) : address.IsDefault,
      };
      
      const response = await saveShippingAddress(payload);
      
      if (response.StatusCode === 200 && String(response.ResponseCode) === '2') {
        // Add the new address to the state (with the ID if available from response)
        const newAddress: ShippingAddress = {
          ...address,
          ShippingAddressId: response.Data?.ShippingAddressId || address.ShippingAddressId,
          IsDefault: Boolean(address.IsDefault),
        };
        
        set((state) => ({
          shippingAddresses: [...state.shippingAddresses, newAddress],
          isLoading: false,
          error: null,
        }));
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to save shipping address.' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to save shipping address due to a network error.' 
      });
      return false;
    }
  },
  
  // Update an existing shipping address
  updateShippingAddress: async (address) => {
    const user = useAuthStore.getState().user;
    if (!user?.UserID) {
      set({ error: 'User not found. Please log in again.' });
      return false;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const payload: SaveShippingAddressPayload = {
        ...address,
        Command: 'Update',
        UserId: user.UserID,
        CompanyId: 3044,
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
        IsDefault: typeof address.IsDefault === 'boolean' ? (address.IsDefault ? 1 : 0) : address.IsDefault,
      };
      
      const response = await updateShippingAddress(payload);
      
      if (response.StatusCode === 200 && String(response.ResponseCode) === '4') {
        // Update the address in the state
        set((state) => ({
          shippingAddresses: state.shippingAddresses.map((a) => 
            a.ShippingAddressId === address.ShippingAddressId
              ? { ...address, IsDefault: Boolean(address.IsDefault) }
              : a
          ),
          isLoading: false,
          error: null,
        }));
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to update shipping address.' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to update shipping address due to a network error.' 
      });
      return false;
    }
  },
  
  // Delete a shipping address
  deleteShippingAddress: async (addressId) => {
    const user = useAuthStore.getState().user;
    if (!user?.UserID) {
      set({ error: 'User not found. Please log in again.' });
      return false;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await deleteShippingAddress({
        ShippingAddressId: addressId,
        UserId: user.UserID,
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
        CompanyId: 3044,
        Command: 'Delete'
      });
      
      if (response.StatusCode === 200 && String(response.ResponseCode) === '6') {
        // Remove the address from the state
        set((state) => ({
          shippingAddresses: state.shippingAddresses.filter(
            (a) => a.ShippingAddressId !== addressId
          ),
          isLoading: false,
          error: null,
        }));
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to delete shipping address.' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to delete shipping address due to a network error.' 
      });
      return false;
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAddressStore; 