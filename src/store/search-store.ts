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
    
    // Reset error state when starting a new search
    set({ isLoading: true, error: null });
    
    try {
      console.log(`Searching for: "${currentSearchQuery}"`);
      const response = await searchItems(currentSearchQuery);
      console.log(`Search API response status: ${response.StatusCode}, responseCode: ${response.ResponseCode}`);

      if (response.StatusCode === 200) {
        if (response.Data?.success === 1 && Array.isArray(response.Data.row)) {
          // First, filter for valid items (must have XName and XCode)
          const validApiResults = response.Data.row.filter(
            (item: SearchItem) => item.XName && typeof item.XName === 'string' && item.XName.trim() !== '' && item.XCode
          );

          console.log(`Search results: ${validApiResults.length} valid items found in API response`);

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

          console.log(`Client filtered ${clientFilteredResults.length} results from ${validApiResults.length} API results`);

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
          console.log(`Search API success != 1 or row not an array: ${JSON.stringify(response.Data?.success)}`);
          set({
            searchResults: [],
            isLoading: false,
            error: response.Data?.Message || 'No products found.',
          });
        }
      } else {
        // HTTP error or other API error
        console.log(`Search API error: ${response.StatusCode}, ${response.Message}`);
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
    set({ searchResults: [], error: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useSearchStore; 