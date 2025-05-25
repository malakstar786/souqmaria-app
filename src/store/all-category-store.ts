import { create } from 'zustand';
import { getAllCategories } from '../utils/api-service';
import useLanguageStore from './language-store';

// Base URL for category images
const CATEGORY_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/HomePage_Category/3044/';

// Types for category data
export interface Category {
  SrNo: string;
  CategoryNameEN: string; // English category name
  CategoryNameAR: string; // Arabic category name
  CategoryName: string; // For backward compatibility - will use English name
  Ordering: number;
  Image: string; // This is the image filename
  HPCType: string;
  imageUrl?: string; // To store the full constructed image URL
  // Additional properties that may be in the response
  [key: string]: any;
}

interface AllCategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllCategories: (cultureId?: string, userId?: string) => Promise<void>;
  clearError: () => void;
}

const useAllCategoryStore = create<AllCategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  // Fetch all categories
  fetchAllCategories: async (cultureId?: string, userId = '') => {
    set({ isLoading: true, error: null });
    
    try {
      const finalCultureId = cultureId || useLanguageStore.getState().getCultureId();
      const response = await getAllCategories(finalCultureId, userId);
      
      if (response.StatusCode === 200 && response.Data?.success === 1) {
        // API returned categories successfully
        const rawCategories = response.Data.row || [];
        
        const processedCategories = rawCategories.map((category: any) => ({
          ...category,
          // Ensure CategoryName exists for backward compatibility
          CategoryName: category.CategoryNameEN || category.CategoryName,
          // Construct the full image URL
          imageUrl: `${CATEGORY_IMAGE_BASE_URL}${category.Image}`,
        }));
        
        // Sort categories by their Ordering property
        const sortedCategories = [...processedCategories].sort(
          (a, b) => a.Ordering - b.Ordering
        );
        
        set({ 
          categories: sortedCategories,
          isLoading: false 
        });
      } else {
        // API returned an error or no categories found
        set({
          categories: [],
          isLoading: false,
          error: response.Message || 'Failed to fetch all categories. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error in fetchAllCategories:', error);
      set({
        isLoading: false,
        error: 'An unexpected error occurred while fetching all categories.'
      });
    }
  },
  
  // Clear any errors
  clearError: () => set({ error: null })
}));

export default useAllCategoryStore; 