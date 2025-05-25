import { create } from 'zustand';
import { getBanners } from '../utils/api-service';
import useLanguageStore from './language-store';

// Base URL for banner images
const BANNER_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/Banner/';

export interface Banner {
  Banner_ImageName: string;
  TagUrl: string | null;
  imageUrl?: string; // To store the full constructed image URL
  id?: string; // For FlatList key, can be same as Banner_ImageName or generated
}

interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  fetchBanners: (cultureId?: string, userId?: string) => Promise<void>;
  clearError: () => void;
}

const useBannerStore = create<BannerState>((set) => ({
  banners: [],
  isLoading: false,
  error: null,
  fetchBanners: async (cultureId?: string, userId = '') => {
    set({ isLoading: true, error: null });
    try {
      const finalCultureId = cultureId || useLanguageStore.getState().getCultureId();
      const response = await getBanners(finalCultureId, userId);
      if (response.StatusCode === 200 && response.Data?.success === 1) {
        const rawBanners = response.Data.row || [];
        const processedBanners = rawBanners.map((banner: Banner, index: number) => ({
          ...banner,
          imageUrl: `${BANNER_IMAGE_BASE_URL}${banner.Banner_ImageName}`,
          id: banner.Banner_ImageName || `banner-${index}`, // Ensure unique ID
        }));
        set({ banners: processedBanners, isLoading: false });
      } else {
        set({
          banners: [],
          isLoading: false,
          error: response.Message || 'Failed to fetch banners.',
        });
      }
    } catch (error) {
      console.error('Error in fetchBanners:', error);
      set({
        isLoading: false,
        error: 'An unexpected error occurred while fetching banners.',
      });
    }
  },
  clearError: () => set({ error: null }),
}));

export default useBannerStore; 