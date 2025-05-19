import { create } from 'zustand';
import {
  getMenuCategories,
  getMenuSubCategories,
  MenuCategory as ApiMenuCategory,
  MenuSubCategory,
} from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';
import useAuthStore from './auth-store'; // To get userId if needed

export interface MenuCategory extends ApiMenuCategory {
  subCategories?: MenuSubCategory[];
  isLoadingSubCategories?: boolean;
  errorSubCategories?: string | null;
  // Add an ID for key extraction if XCode isn't always unique or suitable
  id: string; 
}

interface MenuState {
  menuStructure: MenuCategory[];
  isLoading: boolean; // For loading main categories
  error: string | null; // For errors fetching main categories
  fetchMenuStructure: (cultureId?: string) => Promise<void>;
  fetchSubCategoriesForCategory: (categoryXcode: string, cultureId?: string) => Promise<void>;
  clearMenuErrors: () => void;
}

const useMenuStore = create<MenuState>((set, get) => ({
  menuStructure: [],
  isLoading: false,
  error: null,
  fetchMenuStructure: async (cultureId = '1') => {
    set({ isLoading: true, error: null });
    const userId = useAuthStore.getState().user?.UserID || useAuthStore.getState().user?.id || '';
    try {
      const response = await getMenuCategories(cultureId, String(userId));
      if (response.ResponseCode === RESPONSE_CODES.SUCCESS && response.Data?.success === 1 && Array.isArray(response.Data.row)) {
        const categories = response.Data.row.map(cat => ({ 
          ...cat, 
          id: cat.XCode, // Assuming XCode is unique for main categories
          subCategories: [], // Initialize subcategories array
          isLoadingSubCategories: false,
          errorSubCategories: null,
        }));      
        set({ menuStructure: categories, isLoading: false, error: null }); // Ensure error is cleared on success
      } else {
        // Handle cases where HTTP was ok, but SP indicates no data or an issue, or HTTP error
        let errorMessage = 'Failed to fetch menu categories.';
        if (response.Data?.Message && response.Data.success !== 1) {
          errorMessage = response.Data.Message; // SP message like "Data not found"
        } else if (response.Message) {
          errorMessage = response.Message; // Outer message from apiRequest (e.g. network error)
        }
        set({ 
          isLoading: false, 
          error: errorMessage, 
          menuStructure: [] 
        });
      }
    } catch (error) {
      console.error('Error in fetchMenuStructure store:', error);
      set({ isLoading: false, error: 'An unexpected error occurred.', menuStructure: [] });
    }
  },

  fetchSubCategoriesForCategory: async (categoryXcode: string, cultureId = '1') => {
    const currentStructure = get().menuStructure;
    const categoryIndex = currentStructure.findIndex(cat => cat.XCode === categoryXcode);

    if (categoryIndex === -1) {
      console.warn(`Category with XCode ${categoryXcode} not found in menuStructure.`);
      return;
    }

    // Optimistic update for loading state
    const optimisticStructure = currentStructure.map((cat, index) => 
      index === categoryIndex ? { ...cat, isLoadingSubCategories: true, errorSubCategories: null } : cat
    );
    set({ menuStructure: optimisticStructure });
    
    const userId = useAuthStore.getState().user?.UserID || useAuthStore.getState().user?.id || '';

    try {
      const response = await getMenuSubCategories(categoryXcode, cultureId, String(userId));
      const finalStructure = get().menuStructure.map((cat, index) => {
        if (index === categoryIndex) {
          if (response.ResponseCode === RESPONSE_CODES.SUCCESS && response.Data?.success === 1) {
            return {
              ...cat,
              subCategories: response.Data.row,
              isLoadingSubCategories: false,
              errorSubCategories: null,
            };
          } else {
            return {
              ...cat,
              isLoadingSubCategories: false,
              errorSubCategories: response.Message || 'Failed to load subcategories.',
            };
          }
        }
        return cat;
      });
      set({ menuStructure: finalStructure });
    } catch (error) {
      console.error(`Error fetching subcategories for ${categoryXcode}:`, error);
      const errorStructure = get().menuStructure.map((cat, index) => 
        index === categoryIndex ? { ...cat, isLoadingSubCategories: false, errorSubCategories: 'An unexpected error occurred.' } : cat
      );
      set({ menuStructure: errorStructure });
    }
  },

  clearMenuErrors: () => set({ error: null }), // Optionally clear subCategory errors too if needed
}));

export default useMenuStore; 