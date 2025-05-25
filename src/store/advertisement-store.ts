import { create } from 'zustand';
import { getAdvertisements } from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';
import useLanguageStore from './language-store';

// Base URL for advertisement images
const ADVERTISEMENT_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/ads/';

export interface Advertisement {
  Ads_ImageName: string; // Assuming this field name based on API docs pattern
  TagUrl: string | null;   // Assuming this field name for click-through URL
  imageUrl?: string;       // To store the full constructed image URL
  id?: string;             // For FlatList key, can be Ads_ImageName or generated
}

interface AdvertisementState {
  advertisements: Advertisement[];
  isLoading: boolean;
  error: string | null;
  fetchAdvertisements: (cultureId?: string, userId?: string) => Promise<void>;
  clearError: () => void;
}

const useAdvertisementStore = create<AdvertisementState>((set) => ({
  advertisements: [],
  isLoading: false,
  error: null,
  fetchAdvertisements: async (cultureId?: string, userId = '') => {
    set({ isLoading: true, error: null });
    try {
      const finalCultureId = cultureId || useLanguageStore.getState().getCultureId();
      const response = await getAdvertisements(finalCultureId, userId);
      // Check ResponseCode for success, as per api-service modification
      if (
        response.ResponseCode === RESPONSE_CODES.SUCCESS ||
        response.ResponseCode === RESPONSE_CODES.SUCCESS_ALT
      ) {
        if (response.Data?.success === 1 && response.Data?.row) {
          const rawAdvertisements = response.Data.row || [];
          const processedAdvertisements = rawAdvertisements.map((ad: Advertisement, index: number) => ({
            ...ad,
            imageUrl: `${ADVERTISEMENT_IMAGE_BASE_URL}${ad.Ads_ImageName}`,
            // Ensure unique ID, fallback if Ads_ImageName is not suitable or missing
            id: ad.Ads_ImageName || `advertisement-${index}`,
          }));
          set({ advertisements: processedAdvertisements, isLoading: false, error: null });
        } else {
          // Data success is 0 or row is missing, but API call itself was 'successful' by ResponseCode
          // This means no data was found, which is not an error state for the UI in this case.
          set({
            advertisements: [],
            isLoading: false,
            error: null, // Explicitly set error to null as per user request
          });
        }
      } else {
        // API call failed based on ResponseCode
        set({
          advertisements: [],
          isLoading: false,
          error: response.Message || 'Failed to fetch advertisements.',
        });
      }
    } catch (error) {
      console.error('Error in fetchAdvertisements store:', error);
      set({
        isLoading: false,
        error: 'An unexpected error occurred while fetching advertisements.',
      });
    }
  },
  clearError: () => set({ error: null }),
}));

export default useAdvertisementStore; 