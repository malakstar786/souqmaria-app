import { create } from 'zustand';
import { searchItems, SearchItem } from '../utils/api-service';
import { RESPONSE_CODES } from '../utils/api-config';

interface SearchState {
  searchQuery: string;
  searchResults: SearchItem[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearchResults: () => void;
  clearError: () => void;
}

// Helper to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  error: null,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  performSearch: async (query: string) => {
    const currentSearchQuery = query.trim();
    if (!currentSearchQuery) {
      set({ searchResults: [], isLoading: false, error: null });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await searchItems(currentSearchQuery);

      // console.log(`Search API Response for "${currentSearchQuery}":`, JSON.stringify(response.Data, null, 2));

      if (response.StatusCode === 200) {
        if (response.Data?.success === 1 && Array.isArray(response.Data.row)) {
          // First, filter for valid items (must have XName and XCode)
          const validApiResults = response.Data.row.filter(
            (item: SearchItem) => item.XName && typeof item.XName === 'string' && item.XName.trim() !== '' && item.XCode
          );

          if (validApiResults.length === 0) {
             set({
              searchResults: [],
              isLoading: false,
              error: response.Data.Message?.includes('not found') ? response.Data.Message : 'No products found matching your criteria.',
            });
            return;
          }

          // Client-side filtering based on the search query
          const escapedQuery = escapeRegExp(currentSearchQuery);
          const searchRegex = new RegExp(escapedQuery, 'i'); // 'i' for case-insensitive
          
          const clientFilteredResults = validApiResults.filter((item: SearchItem) =>
            searchRegex.test(item.XName)
          );

          // console.log(`Client filtered ${clientFilteredResults.length} results from ${validApiResults.length} API results for query "${currentSearchQuery}"`);

          if (clientFilteredResults.length > 0) {
            set({
              searchResults: clientFilteredResults,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              searchResults: [],
              isLoading: false,
              error: `No products found matching "${currentSearchQuery}"`, // More specific error
            });
          }
        } else {
          // API reported success: 0 or unexpected Data.row structure
          set({
            searchResults: [],
            isLoading: false,
            error: response.Data?.Message || 'No products found.',
          });
        }
      } else {
        // HTTP error or other API error
        set({
          searchResults: [],
          isLoading: false,
          error: response.Message || 'Search failed. Please try again.',
        });
      }
    } catch (err) {
      console.error('Error performing search:', err);
      set({
        searchResults: [],
        isLoading: false,
        error: 'An unexpected error occurred during search.',
      });
    }
  },

  clearSearchResults: () => {
    set({ searchQuery: '', searchResults: [], isLoading: false, error: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useSearchStore; 