import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  getCartItems, 
  updateCartQty,
  deleteCartItem,
  addToCart as apiAddToCart,
  AddToCartParams,
  ApiResponse,
  AddToCartResponse,
  UpdateCartQtyParams
} from '../utils/api-service';
import { COMMON_PARAMS, RESPONSE_CODES, CULTURE_IDS } from '../utils/api-config';

// Cart item interface
interface CartItem {
  CartID: number;
  ProductID: number;
  ProductCode: string;
  ProductName: string;
  Price: number;
  Quantity: number;
  Image1: string;
  NetAmount: number;
  ItemCode: string;
}

// Add to cart payload interface
interface StoreAddToCartPayload {
  ItemCode: string;
  NewPrice: number;
  OldPrice: number;
  Discount: number;
  Quantity: number;
  UserID?: string;
}

// Add to cart result interface
interface AddToCartResult {
  success: boolean;
  error?: string;
}

// Define the cart state interface
interface CartState {
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
  uniqueId: string;
  isLoading: boolean;
  error: string | null;
  generateUniqueId: () => void;
  getUniqueId: () => string;
  fetchCartItems: (userId?: string) => Promise<void>;
  updateCartItemQty: (cartId: number, newQty: number) => Promise<boolean>;
  removeCartItem: (cartId: number) => Promise<boolean>;
  addToCart: (payload: StoreAddToCartPayload) => Promise<AddToCartResult>;
  clearCart: () => void;
  clearError: () => void;
  refreshCartItems: () => Promise<void>;
}

// Generate a unique ID for this app instance
const generateStoreUniqueId = () => `app-${Date.now()}`;

// Update the totalAmount and totalItems based on cart items
const recalculateTotals = (items: CartItem[]) => {
  const itemCount = items.length;
  const totalPrice = items.reduce((total, item) => total + (item.Price * item.Quantity), 0);
  
  return {
    totalItems: itemCount,
    totalAmount: totalPrice
  };
};

// Create the cart store
const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  totalAmount: 0,
  totalItems: 0,
  uniqueId: generateStoreUniqueId(),
  isLoading: false,
  error: null,
  
  generateUniqueId: () => {
    const newUniqueId = generateStoreUniqueId();
    set({ uniqueId: newUniqueId });
  },
  
  getUniqueId: () => {
    let { uniqueId } = get();
    if (!uniqueId) {
      const newUniqueId = generateStoreUniqueId();
      set({ uniqueId: newUniqueId });
      return newUniqueId;
    }
    return uniqueId;
  },
  
  fetchCartItems: async (userId?: string) => {
    set({ isLoading: true, error: null });
    const uniqueId = get().getUniqueId();
    
    try {
      // If userId is not provided, get it from auth store
      let actualUserId = userId;
      if (!actualUserId) {
        const authStore = (await import('./auth-store')).default;
        actualUserId = authStore.getState().user?.UserID || authStore.getState().user?.id || '';
      }
      
      console.log(`🛒 Fetching cart items for user: ${actualUserId || 'Guest'}, uniqueId: ${uniqueId}`);
      
      const response: ApiResponse<any> = await getCartItems(
        actualUserId || '',
        uniqueId,
        CULTURE_IDS.ENGLISH
      );
      
      if (response.Data?.success === 1 && response.Data.row && Array.isArray(response.Data.row)) {
        const items = response.Data.row.map((item: any): CartItem => ({
          CartID: item.CartID || item.CartId,
          ProductID: item.ProductID || item.ProductId || 0,
          ProductCode: item.ProductCode,
          ProductName: item.ProductName,
          Price: parseFloat(item.Price),
          Quantity: parseInt(item.Quantity, 10),
          Image1: item.Image1,
          NetAmount: parseFloat(item.NetAmount),
          ItemCode: item.ItemCode || item.ProductCode,
        }));
        
        const { totalItems, totalAmount } = recalculateTotals(items);
        
        set({ 
          cartItems: items, 
          totalItems,
          totalAmount,
          isLoading: false 
        });
        console.log(`🛒 Found ${items.length} items in cart for user: ${actualUserId || 'Guest'}, uniqueId: ${uniqueId}`);
      } else {
        set({ 
          cartItems: [], 
          totalItems: 0,
          totalAmount: 0,
          isLoading: false,
          error: response.Data?.Message || (response.Data?.success === 0 ? 'Cart is empty' : (response.Message || 'Failed to fetch cart'))
        });
        console.log(`🛒 No items in cart or error for user: ${actualUserId || 'Guest'}, uniqueId: ${uniqueId}. Message: ${response.Data?.Message || response.Message}`);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart items'
      });
    }
  },

  updateCartItemQty: async (cartId, newQty) => {
    set({ isLoading: true, error: null });
    try {
      const params: UpdateCartQtyParams = {
        CartId: cartId,
        Qty: newQty,
        Company: COMMON_PARAMS.Company,
        Location: COMMON_PARAMS.Location,
      };
      const response: ApiResponse<any> = await updateCartQty(params);
      
      if (String(response.ResponseCode) === String(RESPONSE_CODES.SUCCESS) || String(response.ResponseCode) === '2') {
        const authStore = (await import('./auth-store')).default;
        const currentUserId = authStore.getState().user?.UserID || authStore.getState().user?.id || '';
        
        console.log(`🛒 Successfully updated cart item quantity for user: ${currentUserId || 'Guest'}`);
        await get().fetchCartItems(currentUserId); 
        set({ isLoading: false });
        return true;
      }
      
      set({ error: response.Message || 'Failed to update quantity', isLoading: false });
      return false;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update cart', isLoading: false });
      return false;
    }
  },
  
  removeCartItem: async (cartId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deleteCartItem({
        CartId: cartId,
        Company: COMMON_PARAMS.Company
      });

      if (String(response.ResponseCode) === String(RESPONSE_CODES.SUCCESS) || String(response.ResponseCode) === '2') {
        const authStore = (await import('./auth-store')).default;
        const currentUserId = authStore.getState().user?.UserID || authStore.getState().user?.id || '';
        
        console.log(`🛒 Successfully removed cart item for user: ${currentUserId || 'Guest'}`);
        await get().fetchCartItems(currentUserId);
        set({ isLoading: false });
        return true;
      }
      set({ error: response.Message || 'Failed to delete item', isLoading: false });
      return false;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete item', isLoading: false });
      return false;
    }
  },
  
  addToCart: async (payload: StoreAddToCartPayload) => {
    set({ isLoading: true, error: null });
    try {
      const uniqueId = get().getUniqueId();
      const ipAddress = '127.0.0.1'; 
      const authStore = (await import('./auth-store')).default;
      const currentUserId = authStore.getState().user?.UserID || authStore.getState().user?.id || '';

      console.log(`🛒 Adding item to cart for user: ${currentUserId || 'Guest'}, uniqueId: ${uniqueId}`);
      
      const apiPayload: AddToCartParams = {
        ItemCode: payload.ItemCode,
        NewPrice: payload.NewPrice,
        OldPrice: payload.OldPrice,
        Discount: payload.Discount,
        Qty: payload.Quantity,
        UserId: currentUserId || '',
        UniqueId: uniqueId,
        IpAddress: ipAddress,
        Company: COMMON_PARAMS.Company,
        Location: COMMON_PARAMS.Location,
      };
      
      const response: ApiResponse<AddToCartResponse | null> = await apiAddToCart(apiPayload);

      if (String(response.ResponseCode) === String(RESPONSE_CODES.SUCCESS) || String(response.ResponseCode) === '2' || 
          String(response.ResponseCode) === String(RESPONSE_CODES.UPDATED_SUCCESS) || String(response.ResponseCode) === '4' ||
          String(response.ResponseCode) === String(RESPONSE_CODES.CART_ADDED) || String(response.ResponseCode) === String(RESPONSE_CODES.CART_UPDATED)
          ) {
        await get().fetchCartItems(currentUserId);
        set({ isLoading: false });
        return { 
          success: true,
        };
      }
      
      set({ error: response.Message || 'Failed to add item to cart', isLoading: false });
      return { 
        success: false,
        error: response.Message || 'Failed to add item to cart'
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add to cart', isLoading: false });
      return { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add to cart'
      };
    }
  },

  clearCart: () => set({ cartItems: [], totalAmount: 0, totalItems: 0, error: null, isLoading: false }),
  
  clearError: () => set({ error: null }),
  
  refreshCartItems: async () => {
    const { cartItems } = get();
    const { totalItems, totalAmount } = recalculateTotals(cartItems);
    set({ totalItems, totalAmount });
  },
}));

export default useCartStore; 