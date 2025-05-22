import { create } from 'zustand';
import { applyPromoCode, removePromoCode, PromoCodeParams } from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';

// Define the store state interface
interface PromoState {
  appliedPromoCode: string | null;
  discountAmount: number;
  isApplying: boolean;
  isRemoving: boolean;
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
  
  clearPromo: () => void;
  clearError: () => void;
}

// Create the store
const usePromoStore = create<PromoState>((set, get) => ({
  // Initial state
  appliedPromoCode: null,
  discountAmount: 0,
  isApplying: false,
  isRemoving: false,
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
        set({ 
          appliedPromoCode: promoCode,
          discountAmount: response.Data?.DiscountAmount || 0, // Assuming DiscountAmount is returned
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
        set({ 
          appliedPromoCode: null,
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
  
  // Clear promo state
  clearPromo: () => {
    set({
      appliedPromoCode: null,
      discountAmount: 0,
      error: null,
      success: false
    });
  },
  
  // Clear error state
  clearError: () => {
    set({ error: null });
  }
}));

export default usePromoStore; 