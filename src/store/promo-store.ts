import { create } from 'zustand';
import { ENDPOINTS, SP_QUERIES } from '../utils/api-config';
import { 
  applyPromoCode,
  removePromoCode,
  PromoCodeParams
} from '../utils/api-service';
import useLanguageStore from './language-store';

export interface PromoCode {
  XCode: string;
  XName: string;
}

interface PromoStoreState {
  appliedPromoCode: string | null;
  promoError: string | null;
  isApplying: boolean;
  isRemoving: boolean;
  discount: number;
  discountAmount: number;
  promoCodes: PromoCode[];
  isFetchingCodes: boolean;
  
  applyPromo: (
    promoCode: string, 
    userId: string, 
    uniqueId: string, 
    buyNow: string
  ) => Promise<boolean>;
  
  removePromo: (
    userId: string, 
    uniqueId: string, 
    buyNow: string
  ) => Promise<boolean>;
  
  clearPromoError: () => void;
  resetPromoState: () => void;
  fetchPromoCodes: () => Promise<void>;
}

const usePromoStore = create<PromoStoreState>((set, get) => ({
  appliedPromoCode: null,
  promoError: null,
  isApplying: false,
  isRemoving: false,
  discount: 0,
  discountAmount: 0,
  promoCodes: [],
  isFetchingCodes: false,
  
  applyPromo: async (promoCode, userId, uniqueId, buyNow) => {
    set({ isApplying: true, promoError: null });
    
    try {
      const params: PromoCodeParams = {
        PromoCode: promoCode,
        UserId: userId,
        UniqueId: uniqueId,
        BuyNow: buyNow || '',
        IpAddress: '', // Will be filled by the service
        Company: 3044
      };
      
      const response = await applyPromoCode(params);
      
      if (response.ResponseCode === '-1') {
        set({ 
          promoError: response.Message || 'Invalid promo code', 
          isApplying: false 
        });
        return false;
      }
      
      if (response.ResponseCode === '1' || response.ResponseCode === 1) {
        set({
          appliedPromoCode: promoCode,
          discount: 0,
          discountAmount: response.DiscountAmount || 0,
          isApplying: false
        });
        return true;
      }
      
      set({ 
        promoError: response.Message || 'Failed to apply promo code', 
        isApplying: false 
      });
      return false;
    } catch (error) {
      console.error('Error applying promo code:', error);
      set({ 
        promoError: 'An error occurred. Please try again.', 
        isApplying: false 
      });
      return false;
    }
  },
  
  removePromo: async (userId, uniqueId, buyNow) => {
    set({ isRemoving: true });
    
    try {
      const params: PromoCodeParams = {
        PromoCode: get().appliedPromoCode || '',
        UserId: userId,
        UniqueId: uniqueId,
        BuyNow: buyNow || '',
        IpAddress: '', // Will be filled by the service
        Company: 3044
      };
      
      const response = await removePromoCode(params);
      
      if (response.ResponseCode === '1' || response.ResponseCode === 1) {
        set({
          appliedPromoCode: null,
          discount: 0,
          discountAmount: 0,
          isRemoving: false
        });
        return true;
      }
      
      set({ 
        promoError: response.Message || 'Failed to remove promo code', 
        isRemoving: false 
      });
      return false;
    } catch (error) {
      console.error('Error removing promo code:', error);
      set({
        promoError: 'An error occurred. Please try again.',
        isRemoving: false
      });
      return false;
    }
  },
  
  clearPromoError: () => set({ promoError: null }),
  
  resetPromoState: () => set({
    appliedPromoCode: null,
    promoError: null,
    isApplying: false,
    isRemoving: false,
    discount: 0,
    discountAmount: 0
  }),
  
  fetchPromoCodes: async () => {
    set({ isFetchingCodes: true });
    
    try {
      // Use the proper endpoint
      const data = {
        strQuery: `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Promo_Coupons_List','','','','','',${useLanguageStore.getState().getCultureId()},3044,''`
      };
      
      const response = await fetch(`${ENDPOINTS.GET_DATA_JSON}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.Data?.success === 1 && result.Data.row) {
        set({ 
          promoCodes: result.Data.row,
          isFetchingCodes: false 
        });
      } else {
        set({ 
          promoCodes: [],
          isFetchingCodes: false 
        });
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      set({ 
        promoCodes: [],
        isFetchingCodes: false 
      });
    }
  }
}));

export default usePromoStore; 