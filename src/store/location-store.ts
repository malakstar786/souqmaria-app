import { create } from 'zustand';
import { getCountryList, getStateList, getCityList } from '../utils/api-service';

export interface LocationItem {
  XCode: number;
  XName: string;
}

interface LocationState {
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
  selectedCountry: LocationItem | null;
  selectedState: LocationItem | null;
  selectedCity: LocationItem | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCountries: () => Promise<void>;
  fetchStates: (countryId: number) => Promise<void>;
  fetchCities: (stateId: number) => Promise<void>;
  selectCountry: (country: LocationItem) => void;
  selectState: (state: LocationItem) => void;
  selectCity: (city: LocationItem) => void;
  resetStates: () => void;
  resetCities: () => void;
  resetAll: () => void;
}

const useLocationStore = create<LocationState>((set, get) => ({
  countries: [],
  states: [],
  cities: [],
  selectedCountry: null,
  selectedState: null,
  selectedCity: null,
  isLoading: false,
  error: null,

  // Fetch countries from API
  fetchCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCountryList();
      if (response && response.success === 1 && response.row) {
        set({ countries: response.row, isLoading: false });
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || 'Failed to fetch countries',
          countries: []
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        countries: [] 
      });
    }
  },

  // Fetch states for a country
  fetchStates: async (countryId: number) => {
    set({ isLoading: true, error: null, states: [] });
    try {
      const response = await getStateList(countryId);
      if (response && response.success === 1 && response.row) {
        set({ states: response.row, isLoading: false });
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || 'Failed to fetch states',
          states: []
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        states: [] 
      });
    }
  },

  // Fetch cities for a state
  fetchCities: async (stateId: number) => {
    set({ isLoading: true, error: null, cities: [] });
    try {
      const response = await getCityList(stateId);
      if (response && response.success === 1 && response.row) {
        set({ cities: response.row, isLoading: false });
      } else {
        set({ 
          isLoading: false, 
          error: response?.Message || 'Failed to fetch cities',
          cities: []
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        cities: [] 
      });
    }
  },

  // Select a country and fetch its states
  selectCountry: (country: LocationItem) => {
    set({ 
      selectedCountry: country,
      selectedState: null,
      selectedCity: null,
      states: [],
      cities: []
    });
    get().fetchStates(country.XCode);
  },

  // Select a state and fetch its cities
  selectState: (state: LocationItem) => {
    set({ selectedState: state, selectedCity: null, cities: [] });
    get().fetchCities(state.XCode);
  },

  // Select a city
  selectCity: (city: LocationItem) => {
    set({ selectedCity: city });
  },

  // Reset states and cities
  resetStates: () => {
    set({ states: [], selectedState: null, cities: [], selectedCity: null });
  },

  // Reset cities
  resetCities: () => {
    set({ cities: [], selectedCity: null });
  },

  // Reset all selections and data
  resetAll: () => {
    set({ 
      selectedCountry: null, 
      selectedState: null, 
      selectedCity: null,
      states: [],
      cities: []
    });
  }
}));

export default useLocationStore; 