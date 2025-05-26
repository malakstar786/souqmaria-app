import { create } from 'zustand';
import { getMyOrders, getOrderDetails, searchMyOrders, searchOrderDetails } from '../utils/api-service';
import useLanguageStore from './language-store';

// Types for order data based on actual API response
export interface OrderItem {
  OrderId: string;        // Order tracking ID (e.g., "TR00001859")
  OrderOn: string;        // Order date (e.g., "26/05/2025")
  OrderTotal: number;     // Total order amount (e.g., 1.300)
  // Additional properties that may be in the response
  [key: string]: any;
}

export interface OrderDetailItem {
  OrderId: string;        // Order tracking ID
  ItemImage: string;      // Product image filename
  ItemCode: string;       // Product code
  ItemName: string;       // Product name
  Quantity: number;       // Quantity ordered
  ProdPrice: number;      // Product price per unit
  // Additional properties that may be in the response
  [key: string]: any;
}

interface OrderState {
  orders: OrderItem[];
  selectedOrder: OrderItem | null;
  orderDetails: OrderDetailItem[];
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  errorDetails: string | null;
  searchQuery: string;
  isSearching: boolean;
  
  // Actions
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderDetails: (userId: string, orderNo: string) => Promise<void>;
  searchOrders: (userId: string, searchQuery: string) => Promise<void>;
  clearSearch: () => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
  clearOrderDetails: () => void;
}

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  orderDetails: [],
  isLoading: false,
  isLoadingDetails: false,
  error: null,
  errorDetails: null,
  searchQuery: '',
  isSearching: false,
  
  // Fetch all orders for a user
  fetchOrders: async (userId: string) => {
    console.log('📋 My Orders - Fetching orders for userId:', userId);
    set({ isLoading: true, error: null });
    
    try {
      // Get current culture ID from language store
      const { getCultureId } = useLanguageStore.getState();
      const cultureId = getCultureId();
      console.log('📋 My Orders - Using culture ID:', cultureId);
      
      const response = await getMyOrders(userId, cultureId);
      console.log('📋 My Orders - API Response:', JSON.stringify(response, null, 2));
      
      if (response.StatusCode === 200 && response.Data?.success === 1) {
        // API returned orders successfully
        console.log('📋 My Orders - Orders found:', response.Data.row?.length || 0);
        console.log('📋 My Orders - Order data:', JSON.stringify(response.Data.row, null, 2));
        set({ 
          orders: response.Data.row || [],
          isLoading: false,
          error: null  // Clear any previous errors
        });
      } else if (response.StatusCode === 200 && response.Data?.success === 0) {
        // API was successful but no orders found - this is not an error
        console.log('📋 My Orders - No orders found (empty data). Message:', response.Message);
        set({
          orders: [],
          isLoading: false,
          error: null  // Don't show error for empty data
        });
      } else {
        // Actual API error
        console.log('📋 My Orders - API error. Message:', response.Message);
        console.log('📋 My Orders - Response Code:', response.ResponseCode);
        console.log('📋 My Orders - Status Code:', response.StatusCode);
        set({
          orders: [],
          isLoading: false,
          error: response.Message || 'Failed to fetch orders. Please try again.'
        });
      }
    } catch (error) {
      console.error('❌ My Orders - Error in fetchOrders:', error);
      set({
        isLoading: false,
        error: 'An unexpected error occurred while fetching orders.'
      });
    }
  },
  
  // Fetch details for a specific order
  fetchOrderDetails: async (userId: string, orderNo: string) => {
    set({ isLoadingDetails: true, errorDetails: null });
    
    try {
      // Get current culture ID from language store
      const { getCultureId } = useLanguageStore.getState();
      const cultureId = getCultureId();
      console.log('📋 Order Details - Using culture ID:', cultureId);
      
      const response = await getOrderDetails(userId, orderNo, cultureId);
      
      if (response.StatusCode === 200 && response.Data?.success === 1) {
        // API returned order details successfully
        set({ 
          orderDetails: response.Data.row || [],
          isLoadingDetails: false 
        });
      } else {
        // API returned an error or no order details found
        set({
          orderDetails: [],
          isLoadingDetails: false,
          errorDetails: response.Message || 'Failed to fetch order details. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error in fetchOrderDetails:', error);
      set({
        isLoadingDetails: false,
        errorDetails: 'An unexpected error occurred while fetching order details.'
      });
    }
  },
  
  // Search orders by order ID
  searchOrders: async (userId: string, searchQuery: string) => {
    console.log('📋 Search Orders - Searching for:', searchQuery);
    set({ isSearching: true, error: null });
    
    try {
      // Get current culture ID from language store
      const { getCultureId } = useLanguageStore.getState();
      const cultureId = getCultureId();
      console.log('📋 Search Orders - Using culture ID:', cultureId);
      
      const response = await searchMyOrders(userId, searchQuery, cultureId);
      console.log('📋 Search Orders - API Response:', JSON.stringify(response, null, 2));
      
      if (response.StatusCode === 200 && response.Data?.success === 1) {
        // API returned search results successfully
        console.log('📋 Search Orders - Results found:', response.Data.row?.length || 0);
        set({ 
          orders: response.Data.row || [],
          isSearching: false,
          error: null
        });
      } else if (response.StatusCode === 200 && response.Data?.success === 0) {
        // API was successful but no results found
        console.log('📋 Search Orders - No results found. Message:', response.Message);
        set({
          orders: [],
          isSearching: false,
          error: null
        });
      } else {
        // Actual API error
        console.log('📋 Search Orders - API error. Message:', response.Message);
        set({
          orders: [],
          isSearching: false,
          error: response.Message || 'Failed to search orders. Please try again.'
        });
      }
    } catch (error) {
      console.error('❌ Search Orders - Error:', error);
      set({
        isSearching: false,
        error: 'An unexpected error occurred while searching orders.'
      });
    }
  },
  
  // Clear search and reload all orders
  clearSearch: () => {
    set({ searchQuery: '', orders: [] });
  },
  
  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  
  // Clear any errors
  clearError: () => set({ error: null, errorDetails: null }),
  
  // Clear order details when no longer needed
  clearOrderDetails: () => set({ orderDetails: [], selectedOrder: null, errorDetails: null })
}));

export default useOrderStore; 