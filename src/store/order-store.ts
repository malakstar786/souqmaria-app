import { create } from 'zustand';
import { getMyOrders, getOrderDetails } from '../utils/api-service';

// Types for order data
export interface OrderItem {
  OrderID: string;
  OrderNo: string;
  OrderDate: string;
  TotalAmount: number;
  Status: string;
  ItemCount: number;
  // Additional properties that may be in the response
  [key: string]: any;
}

export interface OrderDetailItem {
  OrderID: string;
  OrderNo: string;
  OrderDate: string;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
  Discount: number;
  TotalAmount: number;
  ImageURL: string;
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
  
  // Actions
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderDetails: (userId: string, orderNo: string) => Promise<void>;
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
  
  // Fetch all orders for a user
  fetchOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await getMyOrders(userId);
      
      if (response.StatusCode === 200 && response.Data?.success === 1) {
        // API returned orders successfully
        set({ 
          orders: response.Data.row || [],
          isLoading: false 
        });
      } else {
        // API returned an error or no orders found
        set({
          orders: [],
          isLoading: false,
          error: response.Message || 'Failed to fetch orders. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error in fetchOrders:', error);
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
      const response = await getOrderDetails(userId, orderNo);
      
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
  
  // Clear any errors
  clearError: () => set({ error: null, errorDetails: null }),
  
  // Clear order details when no longer needed
  clearOrderDetails: () => set({ orderDetails: [], selectedOrder: null, errorDetails: null })
}));

export default useOrderStore; 