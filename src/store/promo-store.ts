import { create } from 'zustand';
import { 
  applyPromoCode, 
  removePromoCode, 
  PromoCodeParams,
  getPromoCodes,
  PromoCodeItem 
} from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';
import useCartStore from './cart-store';

// Define the store state interface
interface PromoState {
  appliedPromoCode: string | null;
  promoName: string | null;
  discountAmount: number;
  isApplying: boolean;
  isRemoving: boolean;
  isFetchingCodes: boolean;
  promoCodes: PromoCodeItem[];
  error: string | null;
  success: boolean;
  
  // Actions
  applyPromo: (
    promoCode: string, 
    userId: string, 
    uniqueId: string, 
    buyNow: string
  ) => Promise<boolean>;
  
  removePromo: (
    promoCode: string,
    userId: string,
    uniqueId: string,
    buyNow: string
  ) => Promise<boolean>;
  
  fetchPromoCodes: () => Promise<PromoCodeItem[]>;
  
  clearPromo: () => void;
  clearError: () => void;
  clearPromoError: () => void;
}

// Create the store
const usePromoStore = create<PromoState>((set, get) => ({
  // Initial state
  appliedPromoCode: null,
  promoName: null,
  discountAmount: 0,
  isApplying: false,
  isRemoving: false,
  isFetchingCodes: false,
  promoCodes: [],
  error: null,
  success: false,
  
  // Apply promo code
  applyPromo: async (promoCode, userId, uniqueId, buyNow) => {
    // Don't attempt to reapply the same code
    if (get().appliedPromoCode === promoCode) {
      return true;
    }
    
    set({ isApplying: true, error: null, success: false });
    
    try {
      const params: PromoCodeParams = {
        PromoCode: promoCode,
        UserId: userId,
        UniqueId: uniqueId,
        BuyNow: buyNow,
        IpAddress: '', // Will be set by the API service
        Company: 3044
      };
      
      const response = await applyPromoCode(params);
      
      // Log response for debugging
      console.log('Promo apply response:', JSON.stringify(response, null, 2));
      
      // Check for success - API returns '2' as success code for applying promo
      if (response.ResponseCode === RESPONSE_CODES.PROMO_APPLY_SUCCESS) {
        // Find the promo name if available
        let promoName = null;
        const promoCodes = get().promoCodes;
        const matchingPromo = promoCodes.find(p => p.XCode === promoCode);
        if (matchingPromo) {
          promoName = matchingPromo.XName;
        }
        
        // If we haven't fetched promo codes yet, fetch them now
        if (promoCodes.length === 0) {
          const codes = await get().fetchPromoCodes();
          const foundPromo = codes.find(p => p.XCode === promoCode);
          if (foundPromo) {
            promoName = foundPromo.XName;
          }
        }
        
        // Now we need to refresh the cart to get the discount amount
        const refreshCart = useCartStore.getState().fetchCartItems;
        await refreshCart();
        
        // After refreshing the cart, get the cart totals
        const cartItems = useCartStore.getState().cartItems;
        const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.Price * item.Quantity), 0);
        const total = useCartStore.getState().totalAmount;
        
        // Calculate the discount amount (subtotal - total)
        const discountAmount = Math.max(0, subtotal - total);
        
        set({ 
          appliedPromoCode: promoCode,
          promoName,
          discountAmount,
          isApplying: false,
          error: null,
          success: true
        });
        return true;
      } else {
        set({ 
          isApplying: false,
          error: response.Message || 'Failed to apply promo code',
          success: false
        });
        return false;
      }
    } catch (error) {
      console.error('Error in applyPromo:', error);
      set({ 
        isApplying: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false
      });
      return false;
    }
  },
  
  // Remove promo code
  removePromo: async (promoCode, userId, uniqueId, buyNow) => {
    set({ isRemoving: true, error: null, success: false });
    
    try {
      const params: PromoCodeParams = {
        PromoCode: promoCode,
        UserId: userId,
        UniqueId: uniqueId,
        BuyNow: buyNow,
        IpAddress: '', // Will be set by the API service
        Company: 3044
      };
      
      const response = await removePromoCode(params);
      
      // Log response for debugging
      console.log('Promo remove response:', JSON.stringify(response, null, 2));
      
      // Check for success - API returns '2' as success code for removing promo
      if (response.ResponseCode === RESPONSE_CODES.PROMO_REMOVE_SUCCESS) {
        // Refresh cart to update totals
        const refreshCart = useCartStore.getState().fetchCartItems;
        await refreshCart();
        
        set({ 
          appliedPromoCode: null,
          promoName: null,
          discountAmount: 0,
          isRemoving: false,
          error: null,
          success: true
        });
        return true;
      } else {
        set({ 
          isRemoving: false,
          error: response.Message || 'Failed to remove promo code',
          success: false
        });
        return false;
      }
    } catch (error) {
      console.error('Error in removePromo:', error);
      set({ 
        isRemoving: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false
      });
      return false;
    }
  },
  
  // Fetch available promo codes
  fetchPromoCodes: async () => {
    set({ isFetchingCodes: true });
    
    try {
      const response = await getPromoCodes();
      
      if (response.StatusCode === 200 && response.Data?.success === 1 && response.Data.row?.length > 0) {
        const promoCodes = response.Data.row;
        set({ promoCodes, isFetchingCodes: false });
        return promoCodes;
      } else {
        set({ promoCodes: [], isFetchingCodes: false });
        return [];
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      set({ promoCodes: [], isFetchingCodes: false });
      return [];
    }
  },
  
  // Clear promo state
  clearPromo: () => {
    set({
      appliedPromoCode: null,
      promoName: null,
      discountAmount: 0,
      error: null,
      success: false
    });
  },
  
  // Clear error state
  clearError: () => {
    set({ error: null });
  },
  
  // Alias for clearError for compatibility
  clearPromoError: () => {
    set({ error: null });
  }
}));

export default usePromoStore; 