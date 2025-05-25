import { create } from 'zustand';

interface NetworkState {
  isConnected: boolean;
  isOnline: boolean;
  
  // Actions
  setNetworkState: (state: Partial<NetworkState>) => void;
  checkConnection: () => Promise<boolean>;
}

const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  isOnline: true,
  
  setNetworkState: (newState: Partial<NetworkState>) => set((state) => ({ ...state, ...newState })),
  
  checkConnection: async () => {
    try {
      // Simple network check by trying to fetch from a reliable endpoint
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      
      const isOnline = response.ok;
      
      set({
        isConnected: isOnline,
        isOnline,
      });
      
      return isOnline;
    } catch (error) {
      console.error('Network check failed:', error);
      set({
        isConnected: false,
        isOnline: false,
      });
      return false;
    }
  },
}));

// Initialize network monitoring
export const initializeNetworkMonitoring = () => {
  // Check connection every 30 seconds
  const interval = setInterval(() => {
    useNetworkStore.getState().checkConnection();
  }, 30000);
  
  // Initial network check
  useNetworkStore.getState().checkConnection();
  
  return () => clearInterval(interval);
};

// Hook for components to use network state
export const useNetworkStatus = () => {
  const { isConnected, isOnline } = useNetworkStore();
  
  return {
    isConnected,
    isOnline,
    checkConnection: useNetworkStore.getState().checkConnection,
  };
};

export default useNetworkStore; 