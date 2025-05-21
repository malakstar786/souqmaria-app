import { create } from 'zustand';
import { RESPONSE_CODES } from '../utils/api-config';
import { addWishlistItem, deleteWishlistItem, getWishlistItems } from '../utils/api-service';

// Interface for wishlist item
export interface WishlistItem {
  ItemCode: string;
  ItemName: string;
  ItemImage: string;
  OnlineActualPrice: number;
  OldPrice?: number;
}

// Interface for the store state
interface WishlistState {
  // Wishlist items
  items: WishlistItem[];
  // Loading states
  isLoading: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  error: string | null;
  
  // Actions
  fetchWishlistItems: (userId: string) => Promise<void>;
  addToWishlist: (itemCode: string, userId: string) => Promise<boolean>;
  removeFromWishlist: (itemCode: string, userId: string) => Promise<boolean>;
  clearError: () => void;
}

// Create wishlist store
const useWishlistStore = create<WishlistState>((set, get) => ({
  // Initial state
  items: [],
  isLoading: false,
  isAdding: false,
  isRemoving: false,
  error: null,
  
  // Fetch wishlist items
  fetchWishlistItems: async (userId: string) => {
    if (!userId) {
      set({ items: [], error: null });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      console.log('🧡 Fetching wishlist items for user:', userId);
      const response = await getWishlistItems(userId);
      
      if (response.Data?.success === 1 && Array.isArray(response.Data.row)) {
        set({ 
          items: response.Data.row, 
          isLoading: false, 
          error: null 
        });
        console.log(`🧡 Wishlist items fetched: ${response.Data.row.length} items`);
      } else {
        set({ 
          items: [], 
          isLoading: false, 
          error: response.Data?.success === 0 ? 'Data not found.' : null // Set a message only if data not found
        });
        console.log('🧡 No wishlist items found:', response.Message);
      }
    } catch (error: any) {
      console.error('❌ Error fetching wishlist items:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch wishlist items',
        items: [] 
      });
    }
  },
  
  // Add item to wishlist
  addToWishlist: async (itemCode: string, userId: string) => {
    if (!userId) {
      set({ error: 'Please login to add items to your wishlist' });
      return false;
    }
    
    set({ isAdding: true, error: null });
    
    try {
      console.log(`🧡 Adding item ${itemCode} to wishlist for user ${userId}`);
      const response = await addWishlistItem(itemCode, userId);
      
      if (
        response.StatusCode === 200 && 
        (String(response.ResponseCode) === '2' || response.ResponseCode === 2)
      ) {
        // Refresh wishlist items
        await get().fetchWishlistItems(userId);
        set({ isAdding: false });
        console.log('🧡 Item added to wishlist successfully');
        return true;
      } else {
        set({ 
          isAdding: false, 
          error: response.Message || 'Failed to add item to wishlist' 
        });
        console.log('❌ Failed to add item to wishlist:', response.Message);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error adding item to wishlist:', error);
      set({ 
        isAdding: false, 
        error: error.message || 'Failed to add item to wishlist' 
      });
      return false;
    }
  },
  
  // Remove item from wishlist
  removeFromWishlist: async (itemCode: string, userId: string) => {
    if (!userId) {
      set({ error: 'Please login to manage your wishlist' });
      return false;
    }
    
    set({ isRemoving: true, error: null });
    
    try {
      console.log(`🧡 Removing item ${itemCode} from wishlist for user ${userId}`);
      const response = await deleteWishlistItem(itemCode, userId);
      
      if (
        response.StatusCode === 200 && 
        (String(response.ResponseCode) === '4' || response.ResponseCode === 4)
      ) {
        // Update local state
        set(state => ({
          isRemoving: false,
          items: state.items.filter(item => item.ItemCode !== itemCode)
        }));
        console.log('🧡 Item removed from wishlist successfully');
        return true;
      } else {
        set({ 
          isRemoving: false, 
          error: response.Message || 'Failed to remove item from wishlist' 
        });
        console.log('❌ Failed to remove item from wishlist:', response.Message);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error removing item from wishlist:', error);
      set({ 
        isRemoving: false, 
        error: error.message || 'Failed to remove item from wishlist' 
      });
      return false;
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
}));

export default useWishlistStore; 