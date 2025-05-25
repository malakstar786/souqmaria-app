# SouqMaria Mobile Application - Complete Developer Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Development Environment Setup](#development-environment-setup)
4. [Application Structure](#application-structure)
5. [API Documentation](#api-documentation)
6. [User Interface Specifications](#user-interface-specifications)
7. [Core Features Implementation](#core-features-implementation)
8. [State Management](#state-management)
9. [Performance Optimization](#performance-optimization)
10. [Deployment Guide](#deployment-guide)
11. [Testing Strategy](#testing-strategy)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

### Business Context
SouqMaria is a Kuwait-based e-commerce mobile application specializing in mobile phones, tablets, and electronics. The application provides a seamless shopping experience with bilingual support (English/Arabic) and cash-on-delivery payment options.

### Key Business Requirements
- **Target Market**: Kuwait electronics consumers
- **Product Categories**: Mobile phones, tablets, accessories, smartwatches, speakers, headphones, electronics appliances
- **Payment Method**: Cash on Delivery (COD) only
- **Languages**: English (default) and Arabic with RTL support
- **User Types**: Guest users and registered users
- **Core Functionality**: Product browsing, cart management, wishlist, user accounts, order tracking

### Success Metrics
- App startup time < 3 seconds
- Category page load time < 2 seconds
- Smooth 60fps scrolling performance
- Support for iOS and Android platforms
- Offline browsing capabilities
- Accessibility compliance (WCAG 2.1 AA)

---

## Technical Architecture

### Technology Stack

#### Frontend Framework
- **React Native**: 0.72+
- **Expo**: 49+ (Managed workflow)
- **TypeScript**: 5.0+ (Strict mode enabled)
- **Expo Router**: File-based routing system

#### State Management
- **Zustand**: Primary state management
- **React Query**: Server state and caching
- **AsyncStorage**: Local data persistence

#### UI/UX Libraries
- **React Native Reanimated**: Animations and gestures
- **React Native Gesture Handler**: Touch interactions
- **Expo Image**: Optimized image loading
- **React Native Safe Area Context**: Safe area management

#### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Expo Dev Tools**: Development and debugging

### Architecture Patterns

#### Component Architecture
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   ├── forms/           # Form-specific components
│   └── modals/          # Modal components
├── screens/             # Screen components
├── navigation/          # Navigation configuration
├── services/            # API and external services
├── store/               # State management
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── constants/           # App constants
```

#### Data Flow Architecture
```
UI Components → Zustand Stores → API Services → Backend APIs
     ↑                ↓              ↓
User Actions    State Updates   Data Fetching
```

### Performance Architecture

#### Caching Strategy
- **API Cache**: 30 minutes for general data, 1 hour for critical data
- **Image Cache**: Persistent with automatic cleanup
- **State Persistence**: Critical user data and preferences

#### Memory Management
- **Component Memoization**: React.memo for expensive components
- **List Optimization**: FlatList with performance props
- **Image Optimization**: Lazy loading and size optimization

---

## Development Environment Setup

### Prerequisites

#### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Expo CLI**: Latest version
- **Git**: Latest version

#### Platform-Specific Requirements

**iOS Development:**
- macOS 12.0 or higher
- Xcode 14.0 or higher
- iOS Simulator
- Apple Developer Account (for deployment)

**Android Development:**
- Android Studio
- Android SDK (API level 33+)
- Android Emulator or physical device
- Google Play Console Account (for deployment)

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/souqmaria/mobile-app-sm.git
cd mobile-app-sm
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create `.env` file in project root:
```env
# API Configuration
API_BASE_URL=https://api.souqmaria.com/api/MerpecWebApi/
COMPANY_ID=3044
LOCATION_ID=304401HO
SALESMAN_ID=3044SMOL

# App Configuration
APP_ENV=development
DEBUG_MODE=true

# Image URLs
CATEGORY_IMAGE_BASE_URL=https://erp.merpec.com/Upload/HomePage_Category/3044/
PRODUCT_IMAGE_BASE_URL=https://erp.merpec.com/Upload/CompanyLogo/3044/
BANNER_IMAGE_BASE_URL=https://erp.merpec.com/Upload/Banner/
```

#### 4. Start Development Server
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Development Tools Setup

#### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- React Native Tools
- Expo Tools

#### Debugging Setup
- **Flipper**: React Native debugging
- **Expo Dev Tools**: Expo-specific debugging
- **React Native Debugger**: Standalone debugging tool

---

## Application Structure

### File System Organization

```
mobile-app-sm/
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── eas.json                 # EAS Build configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── app/                 # Expo Router pages
│   │   ├── (shop)/          # Main app screens
│   │   │   ├── _layout.tsx  # Shop layout
│   │   │   ├── index.tsx    # Home screen
│   │   │   ├── categories.tsx
│   │   │   ├── cart.tsx
│   │   │   └── account/     # Account section
│   │   ├── product/         # Product pages
│   │   ├── checkout.tsx     # Checkout flow
│   │   └── thank-you.tsx    # Order confirmation
│   ├── components/          # Reusable components
│   │   ├── common/          # Shared UI components
│   │   ├── forms/           # Form components
│   │   └── modals/          # Modal components
│   ├── store/               # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── cart-store.ts
│   │   ├── category-store.ts
│   │   └── language-store.ts
│   ├── utils/               # Utility functions
│   │   ├── api-service.ts   # API integration
│   │   ├── api-cache.ts     # Caching logic
│   │   └── localization.ts  # i18n support
│   ├── constants/           # App constants
│   │   └── colors.ts        # Color palette
│   └── types/               # TypeScript definitions
├── assets/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
└── docs/                    # Documentation
    ├── api/                 # API documentation
    ├── ui/                  # UI specifications
    └── deployment/          # Deployment guides
```

### Navigation Structure

#### Route Hierarchy
```
/ (Root)
├── (shop)/                  # Main app section
│   ├── index               # Home screen
│   ├── categories          # Categories listing
│   ├── cart               # Shopping cart
│   └── account/           # User account
│       ├── index          # Account dashboard
│       ├── details/       # User details
│       ├── address/       # Address management
│       ├── orders/        # Order history
│       ├── wishlist       # User wishlist
│       └── policies       # Terms & policies
├── product/[id]           # Product details
├── products/              # Product listings
│   └── list              # Filtered products
├── checkout              # Checkout process
├── thank-you            # Order confirmation
└── signup              # User registration
```

#### Navigation Configuration
- **Tab Navigation**: Bottom tabs for main sections
- **Stack Navigation**: Hierarchical navigation within sections
- **Modal Navigation**: Overlays for forms and confirmations
- **Deep Linking**: Support for product and category URLs

---

## API Documentation

### API Architecture

#### Base Configuration
```typescript
const API_CONFIG = {
  BASE_URL: 'https://api.souqmaria.com/api/MerpecWebApi/',
  COMPANY_ID: 3044,
  LOCATION_ID: '304401HO',
  SALESMAN_ID: '3044SMOL',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};
```

#### Common Parameters
All API requests include these standard parameters:
- **CompanyId**: `3044` (Fixed company identifier)
- **CultureId**: `1` (English) or `2` (Arabic)
- **Location**: `304401HO` (Fixed location identifier)
- **Salesman**: `3044SMOL` (Fixed salesman identifier)

### Authentication APIs

#### User Registration
**Endpoint**: `POST /SaveUserRegistration/`

**Request Body**:
```typescript
interface RegisterUserRequest {
  FullName: string;        // Max 128 chars
  Email: string;           // Max 72 chars
  Mobile: string;          // Max 16 chars
  Password: string;        // Max 48 chars
  IpAddress: string;       // Max 128 chars
  Source: 'iOS' | 'Android'; // Max 10 chars
  CompanyId: number;       // Fixed: 3044
}
```

**Response**:
```typescript
interface ApiResponse {
  statusCode: number;      // HTTP status
  responseCode: number;    // App-specific code
  message: string;         // Response message
  data?: any;             // Optional data payload
}
```

**Response Codes**:
- `2`: Registration successful
- `-2`: Registration failed
- `-4`: Email already exists
- `-6`: Mobile already exists
- `-8`: Server validation error

#### User Login
**Endpoint**: `POST /UserLogin/`

**Request Body**:
```typescript
interface LoginRequest {
  UserName: string;        // Email or mobile
  Password: string;        // User password
  CompanyId: number;       // Fixed: 3044
}
```

**Success Response**:
```typescript
interface LoginResponse {
  StatusCode: number;
  ResponseCode: string;
  Message: string;
  Data: {
    UserId: string;
    FullName: string;
    Email: string;
    Mobile: string;
    // Additional user data
  };
}
```

### Product APIs

#### Get Categories
**Endpoint**: `POST /getData_JSON/`

**Request Body**:
```typescript
{
  strQuery: "[Web].[Sp_Get_SM_Apps] 'Get_HomePage_Category_List','','','','','',1,3044,''"
}
```

**Response**:
```typescript
interface CategoryResponse {
  success: 1 | 0;
  row: Array<{
    SrNo: string;           // Category ID
    CategoryName: string;   // Localized name
    Ordering: number;       // Display order
    Image: string;          // Image filename
    HPCType: string;        // Category type
  }>;
  Message: string;
}
```

#### Get Product Details
**Endpoint**: `POST /getData_JSON/`

**Request Body**:
```typescript
{
  strQuery: "[Web].[Sp_Get_SM_Apps] 'Get_ProductDetails_ByItemCode','ITEM_CODE','304401HO','','','',1,3044,''"
}
```

**Response**:
```typescript
interface ProductResponse {
  success: 1 | 0;
  row: Array<{
    Image1: string;         // Primary image
    Image2: string;         // Secondary image
    Image3: string;         // Tertiary image
    ProductBrand: string;   // Brand name
    ItemCode: string;       // Product ID
    ItemName: string;       // Product name
    Description: string;    // Product description
    Barcode: string;        // Product barcode
    IsWishListItem: boolean; // Wishlist status
    StockQty: number;       // Available stock
    OldPrice: number;       // Original price
    Discount: number;       // Discount amount
    NewPrice: number;       // Current price
  }>;
  Message: string;
}
```

### Cart Management APIs

#### Add to Cart
**Endpoint**: `POST /AddToCart/`

**Request Body**:
```typescript
interface AddToCartRequest {
  ItemCode: string;        // Product code
  NewPrice: number;        // Current price
  OldPrice: number;        // Original price
  Discount: number;        // Discount amount
  UserId: string;          // User ID (empty for guests)
  UniqueId: string;        // Cart identifier
  IpAddress: string;       // Client IP
  Company: string;         // Company ID
  Location: string;        // Location ID
  Qty: number;            // Quantity
}
```

**Response Codes**:
- `2`: Item added successfully
- `4`: Item quantity updated
- `-4`: Stock not available
- `-10`: General error

#### Get Cart Items
**Endpoint**: `POST /getData_JSON/`

**Request Body**:
```typescript
{
  strQuery: "[Web].[SP_Template1_Get_CartProductsDetails_Apps] 'USER_ID','IP_ADDRESS','UNIQUE_ID',3044,1"
}
```

### Address Management APIs

#### Save Address
**Endpoint**: `POST /CRUD_Billing_Manage_Address/`

**Request Body**:
```typescript
interface SaveAddressRequest {
  BillingAddressId: number; // 0 for new address
  FullName: string;         // Max 100 chars
  Email: string;            // Max 128 chars
  Mobile: string;           // Max 50 chars
  Address2: string;         // Optional line 2
  Country: string;          // Country code
  State: string;            // State code
  City: string;             // City code
  Block: string;            // Block number
  Street: string;           // Street name
  House: string;            // House number
  Apartment: string;        // Apartment number
  IsDefault: boolean;       // Default flag
  Command: 'Save' | 'Update' | 'Delete';
  UserId: string;           // User ID
  CompanyId: number;        // Company ID
  IpAddress: string;        // Client IP
}
```

### Checkout APIs

#### Save Checkout
**Endpoint**: `POST /Save_Checkout/`

**Request Body**:
```typescript
interface CheckoutRequest {
  UserID: string;           // User or guest ID
  IpAddress: string;        // Client IP
  UniqueId: string;         // Cart ID
  Company: number;          // Company ID
  CultureId: number;        // Language ID
  BuyNow: string;           // Direct purchase item
  Location: string;         // Location ID
  DifferentAddress: boolean; // Shipping flag
  BillingAddressId: number; // Billing address
  ShippingAddressId: number; // Shipping address
  SCountry: string;         // Shipping country
  SState: string;           // Shipping state
  SCity: string;            // Shipping city
  PaymentMode: string;      // Payment method
  Source: string;           // Platform
  OrderNote: string;        // Order notes
  Salesman: string;         // Salesman ID
}
```

**Response**:
```typescript
interface CheckoutResponse {
  StatusCode: number;
  ResponseCode: string;
  Message: string;
  TrackId: string;          // Order tracking ID
}
```

### Error Handling

#### Standard Error Response
```typescript
interface ErrorResponse {
  statusCode: number;       // HTTP status code
  responseCode: number;     // Application error code
  message: string;          // Error message
  error?: string;           // Detailed error info
}
```

#### Common Error Codes
- `200`: Success
- `400`: Bad request / Validation error
- `401`: Unauthorized
- `404`: Not found
- `500`: Server error

#### API Error Handling Strategy
```typescript
const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { statusCode, responseCode, message } = error.response.data;
    return message || 'An error occurred';
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return 'An unexpected error occurred';
  }
};
```

---

## User Interface Specifications

### Design System

#### Color Palette
```typescript
export const COLORS = {
  // Primary Colors
  primary: '#00AEEF',        // Blue
  secondary: '#8DC63F',      // Green
  
  // Neutral Colors
  black: '#000000',
  white: '#FFFFFF',
  lightGray: '#D9D9D9',
  veryLightGray: '#F1F1F1',
  lightBlue: '#D9F4FF',
  
  // Status Colors
  success: '#8DC63F',
  error: '#FF0000',
  warning: '#FFA500',
  info: '#00AEEF',
  
  // Text Colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundLight: '#F1F1F1',
  backgroundBlue: '#D9F4FF',
};
```

#### Typography
```typescript
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};
```

#### Spacing System
```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};
```

### Screen Specifications

#### Home Screen
**Layout Components**:
- Header with logo and cart icon
- Search bar with suggestions
- Category grid (2 columns)
- Featured banners carousel
- Bottom navigation tabs

**Design Requirements**:
- Background: White (`#FFFFFF`)
- Header background: Light blue (`#D9F4FF`)
- Category cards: White with subtle shadow
- Rounded corners: 12px for cards
- Spacing: 16px between sections

#### Product Listing Screen
**Layout Components**:
- Header with back button and search
- Filter bar (Sort, Category, Price, Brand)
- Product grid (2 columns)
- Results count indicator

**Performance Requirements**:
- FlatList optimization for large datasets
- Image lazy loading
- Infinite scroll pagination
- Pull-to-refresh functionality

#### Product Detail Screen
**Layout Components**:
- Image carousel with indicators
- Product information section
- Quantity selector and add to cart
- WhatsApp order button
- Key features list
- Related products section

**Interactive Elements**:
- Image zoom functionality
- Quantity increment/decrement
- Add to cart animation
- Share product functionality

#### Cart Screen
**Layout Components**:
- Cart items list
- Quantity controls per item
- Remove item functionality
- Price summary section
- Checkout button

**State Management**:
- Real-time quantity updates
- Price recalculation
- Empty cart state
- Loading states for operations

### Responsive Design

#### Screen Size Support
- **Small phones**: 320px width minimum
- **Standard phones**: 375px - 414px width
- **Large phones**: 414px+ width
- **Tablets**: 768px+ width (limited support)

#### Orientation Support
- **Portrait**: Primary orientation
- **Landscape**: Limited support for media viewing

### Accessibility

#### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Touch Targets**: Minimum 44px x 44px
- **Screen Reader**: Full VoiceOver/TalkBack support
- **Keyboard Navigation**: Focus management
- **Text Scaling**: Support for large text sizes

#### Implementation
```typescript
// Accessibility props example
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add to cart"
  accessibilityHint="Adds this item to your shopping cart"
  accessibilityRole="button"
  style={styles.addToCartButton}
>
  <Text>Add to Cart</Text>
</TouchableOpacity>
```

### Internationalization (i18n)

#### Language Support
- **English**: Default language (LTR)
- **Arabic**: Secondary language (RTL)

#### RTL Support Implementation
```typescript
import { I18nManager } from 'react-native';

// Check if RTL is enabled
const isRTL = I18nManager.isRTL;

// Style adjustments for RTL
const styles = StyleSheet.create({
  container: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    textAlign: isRTL ? 'right' : 'left',
  },
});
```

#### Text Localization
```typescript
// Localization utility
export const t = (key: string, params?: Record<string, any>): string => {
  const currentLanguage = useLanguageStore(state => state.currentLanguage);
  return getLocalizedText(key, currentLanguage, params);
};

// Usage in components
<Text>{t('common.addToCart')}</Text>
<Text>{t('product.priceWithCurrency', { price: 25, currency: 'KWD' })}</Text>
```

---

## Core Features Implementation

### Authentication System

#### User Registration Flow
```typescript
// Registration store implementation
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  register: (userData: RegisterData) => Promise<boolean>;
  login: (credentials: LoginData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: ProfileData) => Promise<boolean>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await registerUser(userData);
      
      if (response.responseCode === 2) {
        // Registration successful
        set({ 
          isLoading: false,
          user: response.data,
          error: null 
        });
        return true;
      } else {
        // Handle specific error codes
        const errorMessage = getErrorMessage(response.responseCode);
        set({ isLoading: false, error: errorMessage });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Registration failed. Please try again.' 
      });
      return false;
    }
  },
  
  // ... other methods
}));
```

#### Login Implementation
```typescript
// Login component
const LoginScreen = () => {
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const handleLogin = async () => {
    const success = await login(formData);
    if (success) {
      router.replace('/(shop)');
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email or Mobile"
        value={formData.username}
        onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={isLoading}
        style={styles.loginButton}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
```

### Product Catalog System

#### Category Management
```typescript
// Category store
interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await getCategories();
      
      if (response.success === 1) {
        set({ 
          categories: response.row,
          isLoading: false,
          error: null 
        });
      } else {
        set({ 
          isLoading: false, 
          error: 'Failed to load categories' 
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Network error. Please try again.' 
      });
    }
  },
  
  getCategoryById: (id: string) => {
    return get().categories.find(cat => cat.SrNo === id);
  },
}));
```

#### Product Search Implementation
```typescript
// Search functionality
const useProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await searchProducts(query);
        setSuggestions(response.row || []);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);
  
  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    isLoading,
  };
};
```

### Shopping Cart System

#### Cart State Management
```typescript
interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  addItem: (product: Product, quantity: number) => Promise<boolean>;
  updateQuantity: (cartId: number, quantity: number) => Promise<boolean>;
  removeItem: (cartId: number) => Promise<boolean>;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  addItem: async (product, quantity) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await addToCart({
        ItemCode: product.ItemCode,
        NewPrice: product.NewPrice,
        OldPrice: product.OldPrice,
        Discount: product.Discount,
        Qty: quantity,
        // ... other required fields
      });
      
      if (response.ResponseCode === '2') {
        // Refresh cart items
        await get().fetchCartItems();
        set({ isLoading: false });
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to add item' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to add item to cart' 
      });
      return false;
    }
  },
  
  updateQuantity: async (cartId, quantity) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await updateCartQuantity({
        CartId: cartId,
        Qty: quantity,
        Company: '3044',
        Location: '304401HO',
      });
      
      if (response.ResponseCode === '2') {
        // Update local state
        set(state => ({
          items: state.items.map(item => 
            item.CartID === cartId 
              ? { ...item, Quantity: quantity, SubTotal: item.Price * quantity }
              : item
          ),
          isLoading: false,
        }));
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.Message || 'Failed to update quantity' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to update quantity' 
      });
      return false;
    }
  },
  
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.SubTotal, 0);
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.Quantity, 0);
  },
}));
```

### Checkout System

#### Guest Checkout Flow
```typescript
// Guest checkout implementation
const GuestCheckoutFlow = () => {
  const [step, setStep] = useState<'address' | 'shipping' | 'payment' | 'review'>('address');
  const [guestData, setGuestData] = useState<GuestCheckoutData>({
    trackId: null,
    billingAddress: null,
    shippingAddress: null,
    differentShipping: false,
    paymentMethod: null,
  });
  
  const handleGuestRegistration = async (addressData: AddressData) => {
    try {
      const response = await registerGuestUser({
        FullName: addressData.fullName,
        Email: addressData.email,
        Mobile: addressData.mobile,
        IpAddress: await getDeviceIP(),
        Source: Platform.OS === 'ios' ? 'iOS' : 'Android',
        CompanyId: 3044,
      });
      
      if (response.ResponseCode === '2' || response.ResponseCode === '4') {
        setGuestData(prev => ({ 
          ...prev, 
          trackId: response.TrackId,
          billingAddress: addressData 
        }));
        
        if (guestData.differentShipping) {
          setStep('shipping');
        } else {
          setStep('payment');
        }
      }
    } catch (error) {
      console.error('Guest registration failed:', error);
    }
  };
  
  const handlePlaceOrder = async () => {
    try {
      const checkoutData = {
        UserID: guestData.trackId,
        DifferentAddress: guestData.differentShipping,
        BillingAddressId: 0,
        ShippingAddressId: 0,
        PaymentMode: guestData.paymentMethod,
        // ... other required fields
      };
      
      if (guestData.differentShipping && guestData.shippingAddress) {
        checkoutData.SCountry = guestData.shippingAddress.country;
        checkoutData.SState = guestData.shippingAddress.state;
        checkoutData.SCity = guestData.shippingAddress.city;
      }
      
      const response = await saveCheckout(checkoutData);
      
      if (response.ResponseCode === '2') {
        router.push(`/thank-you?trackId=${response.TrackId}&status=success`);
      } else {
        // Handle checkout error
        console.error('Checkout failed:', response.Message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  
  // Render appropriate step component
  switch (step) {
    case 'address':
      return <GuestAddressForm onSubmit={handleGuestRegistration} />;
    case 'shipping':
      return <GuestShippingForm onSubmit={(data) => {
        setGuestData(prev => ({ ...prev, shippingAddress: data }));
        setStep('payment');
      }} />;
    case 'payment':
      return <PaymentSelection onSubmit={(method) => {
        setGuestData(prev => ({ ...prev, paymentMethod: method }));
        setStep('review');
      }} />;
    case 'review':
      return <OrderReview onPlaceOrder={handlePlaceOrder} />;
    default:
      return null;
  }
};
```

### Wishlist System

#### Wishlist Management
```typescript
interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  
  addToWishlist: (itemCode: string) => Promise<boolean>;
  removeFromWishlist: (itemCode: string) => Promise<boolean>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (itemCode: string) => boolean;
}

const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  addToWishlist: async (itemCode) => {
    const { user } = useAuthStore.getState();
    if (!user) return false;
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await addToWishlist({
        ItemCode: itemCode,
        UserId: user.UserId,
        IpAddress: await getDeviceIP(),
        CompanyId: 3044,
        Command: 'Save',
      });
      
      if (response.responseCode === 2) {
        // Refresh wishlist
        await get().fetchWishlist();
        set({ isLoading: false });
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: response.message || 'Failed to add to wishlist' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to add to wishlist' 
      });
      return false;
    }
  },
  
  isInWishlist: (itemCode) => {
    return get().items.some(item => item.ItemCode === itemCode);
  },
}));
```

---

## State Management

### Zustand Store Architecture

#### Store Structure
```typescript
// Base store interface
interface BaseStore {
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Store factory for common patterns
const createBaseStore = <T extends BaseStore>(
  initialState: Omit<T, keyof BaseStore>
): T => ({
  ...initialState,
  isLoading: false,
  error: null,
  lastUpdated: null,
} as T);
```

#### Authentication Store
```typescript
interface AuthStore extends BaseStore {
  user: User | null;
  isLoggedIn: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: ProfileData) => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...createBaseStore({
        user: null,
        isLoggedIn: false,
      }),
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await loginUser(credentials);
          
          if (response.ResponseCode === '2') {
            set({
              user: response.Data,
              isLoggedIn: true,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.Message || 'Login failed',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error. Please try again.',
          });
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
```

#### Language Store
```typescript
interface LanguageStore {
  currentLanguage: 'en' | 'ar';
  cultureId: 1 | 2;
  isRTL: boolean;
  
  setLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
  getCultureId: () => 1 | 2;
}

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      cultureId: 1,
      isRTL: false,
      
      setLanguage: (language) => {
        const cultureId = language === 'en' ? 1 : 2;
        const isRTL = language === 'ar';
        
        set({
          currentLanguage: language,
          cultureId,
          isRTL,
        });
        
        // Update React Native's RTL setting
        I18nManager.forceRTL(isRTL);
      },
      
      toggleLanguage: () => {
        const currentLang = get().currentLanguage;
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        get().setLanguage(newLang);
      },
      
      getCultureId: () => get().cultureId,
    }),
    {
      name: 'language-storage',
    }
  )
);
```

### Data Persistence Strategy

#### AsyncStorage Integration
```typescript
// Storage utility
export const storage = {
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },
  
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};
```

#### Cache Management
```typescript
// Cache store for API responses
interface CacheStore {
  cache: Record<string, CacheEntry>;
  
  set: (key: string, data: any, ttl?: number) => void;
  get: (key: string) => any | null;
  invalidate: (key: string) => void;
  clear: () => void;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

const useCacheStore = create<CacheStore>((set, get) => ({
  cache: {},
  
  set: (key, data, ttl = 30 * 60 * 1000) => { // 30 minutes default
    set(state => ({
      cache: {
        ...state.cache,
        [key]: {
          data,
          timestamp: Date.now(),
          ttl,
        },
      },
    }));
  },
  
  get: (key) => {
    const entry = get().cache[key];
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      get().invalidate(key);
      return null;
    }
    
    return entry.data;
  },
  
  invalidate: (key) => {
    set(state => {
      const newCache = { ...state.cache };
      delete newCache[key];
      return { cache: newCache };
    });
  },
  
  clear: () => {
    set({ cache: {} });
  },
}));
```

---

## Performance Optimization

### Caching Strategy

#### API Response Caching
```typescript
// Enhanced API service with caching
class ApiService {
  private cache = new Map<string, CacheEntry>();
  
  async request<T>(
    endpoint: string,
    options: RequestOptions,
    cacheConfig?: CacheConfig
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(endpoint, options);
    
    // Check cache first
    if (cacheConfig?.enabled) {
      const cachedData = this.getFromCache<T>(cacheKey, cacheConfig.ttl);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Make API request
    const response = await this.makeRequest<T>(endpoint, options);
    
    // Cache successful responses
    if (cacheConfig?.enabled && response) {
      this.setCache(cacheKey, response, cacheConfig.ttl);
    }
    
    return response;
  }
  
  private generateCacheKey(endpoint: string, options: RequestOptions): string {
    return `${endpoint}_${JSON.stringify(options)}`;
  }
  
  private getFromCache<T>(key: string, ttl: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
}

// Cache configurations
export const CACHE_CONFIGS = {
  CRITICAL: { enabled: true, ttl: 60 * 60 * 1000 }, // 1 hour
  STANDARD: { enabled: true, ttl: 30 * 60 * 1000 }, // 30 minutes
  SHORT: { enabled: true, ttl: 5 * 60 * 1000 },     // 5 minutes
  NONE: { enabled: false, ttl: 0 },
};
```

#### Image Optimization
```typescript
// Optimized image component
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  placeholder,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);
  
  if (hasError) {
    return (
      <View style={[style, styles.placeholder]}>
        <Text style={styles.errorText}>Image not available</Text>
      </View>
    );
  }
  
  return (
    <View style={style}>
      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
      <Image
        source={source}
        style={[style, { opacity: isLoading ? 0 : 1 }]}
        onLoad={handleLoad}
        onError={handleError}
        cachePolicy="memory-disk"
        {...props}
      />
    </View>
  );
};
```

### List Performance Optimization

#### FlatList Configuration
```typescript
// Optimized product list component
const ProductList: React.FC<ProductListProps> = ({ products, onEndReached }) => {
  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} />
  ), []);
  
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );
  
  const keyExtractor = useCallback((item: Product) => item.ItemCode, []);
  
  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={6}
      windowSize={5}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
};

// Memoized product card
const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  const navigation = useNavigation();
  
  const handlePress = useCallback(() => {
    navigation.navigate('Product', { id: product.ItemCode });
  }, [navigation, product.ItemCode]);
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <OptimizedImage
        source={{ uri: getProductImageUrl(product.Image1) }}
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={2}>
        {product.ItemName}
      </Text>
      <Text style={styles.price}>
        {formatPrice(product.NewPrice)}
      </Text>
    </TouchableOpacity>
  );
});
```

### Memory Management

#### Component Cleanup
```typescript
// Custom hook for cleanup
const useCleanup = (cleanup: () => void) => {
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
};

// Example usage in component
const ProductScreen = () => {
  const [data, setData] = useState(null);
  const abortController = useRef(new AbortController());
  
  useCleanup(() => {
    // Cancel ongoing requests
    abortController.current.abort();
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products', {
          signal: abortController.current.signal,
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    };
    
    fetchData();
  }, []);
  
  return <ProductView data={data} />;
};
```

### Performance Monitoring

#### Performance Metrics
```typescript
// Performance monitoring utility
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  
  startTiming(key: string): void {
    this.metrics.set(key, {
      startTime: performance.now(),
      endTime: null,
      duration: null,
    });
  }
  
  endTiming(key: string): number | null {
    const metric = this.metrics.get(key);
    if (!metric) return null;
    
    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    this.metrics.set(key, {
      ...metric,
      endTime,
      duration,
    });
    
    // Log performance metrics
    console.log(`Performance [${key}]: ${duration.toFixed(2)}ms`);
    
    return duration;
  }
  
  getMetrics(): Record<string, PerformanceMetric> {
    return Object.fromEntries(this.metrics);
  }
  
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Usage in components
const usePerformanceTracking = (screenName: string) => {
  const monitor = useRef(new PerformanceMonitor());
  
  useEffect(() => {
    monitor.current.startTiming(`${screenName}_load`);
    
    return () => {
      monitor.current.endTiming(`${screenName}_load`);
    };
  }, [screenName]);
  
  return monitor.current;
};
```

---

## Deployment Guide

### Build Configuration

#### EAS Build Setup
```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium",
        "simulator": true
      },
      "android": {
        "resourceClass": "medium",
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium",
        "autoIncrement": "buildNumber"
      },
      "android": {
        "resourceClass": "medium",
        "autoIncrement": "versionCode"
      },
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

#### App Configuration
```json
// app.json
{
  "expo": {
    "name": "SouqMaria",
    "slug": "souqmaria-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "scheme": "souqmaria",
    "primaryColor": "#007AFF",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.souqmaria.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses camera to scan barcodes for product search",
        "NSLocationWhenInUseUsageDescription": "This app uses location to provide delivery estimates"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.souqmaria.app",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "CAMERA"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-image",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow SouqMaria to access your camera for barcode scanning"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Environment Configuration

#### Production Environment Variables
```env
# Production .env
NODE_ENV=production
API_BASE_URL=https://api.souqmaria.com/api/MerpecWebApi/
COMPANY_ID=3044
LOCATION_ID=304401HO
SALESMAN_ID=3044SMOL

# Image URLs
CATEGORY_IMAGE_BASE_URL=https://erp.merpec.com/Upload/HomePage_Category/3044/
PRODUCT_IMAGE_BASE_URL=https://erp.merpec.com/Upload/CompanyLogo/3044/
BANNER_IMAGE_BASE_URL=https://erp.merpec.com/Upload/Banner/

# App Configuration
APP_VERSION=1.0.0
DEBUG_MODE=false
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true

# Performance
API_TIMEOUT=30000
CACHE_TTL_CRITICAL=3600000
CACHE_TTL_STANDARD=1800000
```

### Build Scripts

#### Production Build Script
```bash
#!/bin/bash
# scripts/build-production.sh

set -e

echo "🚀 Starting SouqMaria Production Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    print_error "app.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required tools are installed
print_status "Checking required tools..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

if ! command -v eas &> /dev/null; then
    print_error "EAS CLI is not installed. Run: npm install -g eas-cli"
    exit 1
fi

print_success "All required tools are installed"

# Install dependencies
print_status "Installing dependencies..."
npm ci
print_success "Dependencies installed"

# Run linting
print_status "Running linting..."
npm run lint
print_success "Linting passed"

# Run type checking
print_status "Running type checking..."
npm run type-check
print_success "Type checking passed"

# Run tests
print_status "Running tests..."
npm test
print_success "Tests passed"

# Run Expo doctor
print_status "Running Expo doctor..."
npx expo-doctor
print_success "Expo doctor checks passed"

# Build for production
PLATFORM=${1:-all}

case $PLATFORM in
    ios)
        print_status "Building for iOS..."
        eas build --platform ios --profile production
        ;;
    android)
        print_status "Building for Android..."
        eas build --platform android --profile production
        ;;
    all)
        print_status "Building for all platforms..."
        eas build --platform all --profile production
        ;;
    *)
        print_error "Invalid platform. Use: ios, android, or all"
        exit 1
        ;;
esac

print_success "Production build completed successfully!"
```

### Pre-deployment Testing

#### Testing Script
```bash
#!/bin/bash
# scripts/pre-deployment-test.sh

set -e

echo "🧪 Starting SouqMaria Pre-Deployment Testing..."

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running: $test_name"
    
    if eval "$test_command"; then
        print_success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

run_warning_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running: $test_name"
    
    if eval "$test_command"; then
        print_success "$test_name"
        ((TESTS_PASSED++))
    else
        print_warning "$test_name"
        ((TESTS_WARNED++))
    fi
}

# Core functionality tests
run_test "Dependency Check" "npm audit --audit-level moderate"
run_test "TypeScript Compilation" "npx tsc --noEmit"
run_test "ESLint Check" "npm run lint"
run_test "Unit Tests" "npm test"

# API connectivity tests
run_test "API Health Check" "curl -f -s https://api.souqmaria.com/api/MerpecWebApi/ > /dev/null"

# Performance tests
run_warning_test "Bundle Size Check" "npx expo export && du -sh dist"

# Security tests
run_test "Security Audit" "npm audit --audit-level high"

# Configuration tests
run_test "Environment Variables" "[ -f .env ] && echo 'Environment file exists'"
run_test "App Configuration" "npx expo config --type public > /dev/null"

# Asset tests
run_test "Asset Validation" "[ -f assets/icon.png ] && [ -f assets/splash.png ]"

# Print summary
echo ""
echo "📊 Test Summary:"
echo "✅ Passed: $TESTS_PASSED"
echo "❌ Failed: $TESTS_FAILED"
echo "⚠️  Warnings: $TESTS_WARNED"

if [ $TESTS_FAILED -gt 0 ]; then
    print_error "Some tests failed. Please fix the issues before deployment."
    exit 1
else
    print_success "All critical tests passed! Ready for deployment."
    exit 0
fi
```

### App Store Deployment

#### iOS App Store Checklist
- [ ] App icons (1024x1024 for App Store, various sizes for app)
- [ ] Screenshots for all supported device sizes
- [ ] App Store description and keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Age rating and content descriptions
- [ ] In-app purchase setup (if applicable)
- [ ] TestFlight beta testing completed
- [ ] App Store Connect metadata complete

#### Google Play Store Checklist
- [ ] App icons (512x512 for Play Store, various sizes for app)
- [ ] Screenshots for phones and tablets
- [ ] Feature graphic (1024x500)
- [ ] App description and short description
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target audience and content settings
- [ ] Internal testing completed
- [ ] Play Console metadata complete

### Deployment Commands

#### Build Commands
```bash
# Development build
eas build --profile development --platform all

# Preview build
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Build specific platform
eas build --profile production --platform ios
eas build --profile production --platform android
```

#### Submission Commands
```bash
# Submit to App Store
eas submit --platform ios --profile production

# Submit to Google Play
eas submit --platform android --profile production

# Submit to both stores
eas submit --platform all --profile production
```

---

## Testing Strategy

### Testing Pyramid

#### Unit Testing (70%)
**Framework**: Jest + React Native Testing Library

**Test Coverage Areas**:
- Utility functions
- Store actions and reducers
- Component logic
- API service functions
- Data transformations

**Example Unit Test**:
```typescript
// __tests__/utils/price-formatter.test.ts
import { formatPrice } from '../src/utils/price-formatter';

describe('formatPrice', () => {
  it('should format price with KWD currency', () => {
    expect(formatPrice(25.5)).toBe('25.500 KWD');
  });
  
  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('0.000 KWD');
  });
  
  it('should handle decimal prices', () => {
    expect(formatPrice(99.99)).toBe('99.990 KWD');
  });
});
```

#### Integration Testing (20%)
**Framework**: Jest + React Native Testing Library

**Test Coverage Areas**:
- API integration
- Store integration with components
- Navigation flows
- Form submissions

**Example Integration Test**:
```typescript
// __tests__/integration/cart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CartScreen } from '../src/app/(shop)/cart';
import { useCartStore } from '../src/store/cart-store';

// Mock the store
jest.mock('../src/store/cart-store');

describe('Cart Integration', () => {
  beforeEach(() => {
    (useCartStore as jest.Mock).mockReturnValue({
      items: [
        {
          CartID: 1,
          ProductName: 'iPhone 14',
          Price: 999,
          Quantity: 1,
          SubTotal: 999,
        },
      ],
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      getCartTotal: () => 999,
    });
  });
  
  it('should update quantity when plus button is pressed', async () => {
    const mockUpdateQuantity = jest.fn();
    (useCartStore as jest.Mock).mockReturnValue({
      items: [/* ... */],
      updateQuantity: mockUpdateQuantity,
      // ... other methods
    });
    
    const { getByTestId } = render(<CartScreen />);
    
    fireEvent.press(getByTestId('quantity-plus-1'));
    
    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 2);
    });
  });
});
```

#### End-to-End Testing (10%)
**Framework**: Detox

**Test Coverage Areas**:
- Critical user journeys
- Cross-platform compatibility
- Performance benchmarks

**Example E2E Test**:
```typescript
// e2e/checkout-flow.e2e.js
describe('Checkout Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('should complete guest checkout successfully', async () => {
    // Navigate to product
    await element(by.id('category-mobile')).tap();
    await element(by.id('product-item-0')).tap();
    
    // Add to cart
    await element(by.id('add-to-cart-button')).tap();
    await element(by.text('View Cart')).tap();
    
    // Proceed to checkout
    await element(by.id('checkout-button')).tap();
    
    // Fill guest information
    await element(by.id('guest-name-input')).typeText('John Doe');
    await element(by.id('guest-email-input')).typeText('john@example.com');
    await element(by.id('guest-mobile-input')).typeText('12345678');
    
    // Continue with address
    await element(by.id('continue-button')).tap();
    
    // Fill address
    await element(by.id('block-input')).typeText('1');
    await element(by.id('street-input')).typeText('Main Street');
    await element(by.id('house-input')).typeText('123');
    
    // Place order
    await element(by.id('place-order-button')).tap();
    
    // Verify success
    await expect(element(by.text('Order Placed Successfully'))).toBeVisible();
  });
});
```

### API Testing

#### API Test Suite
```typescript
// __tests__/api/auth.test.ts
import { loginUser, registerUser } from '../src/utils/api-service';

describe('Authentication API', () => {
  it('should login with valid credentials', async () => {
    const credentials = {
      UserName: 'test@example.com',
      Password: 'password123',
      CompanyId: 3044,
    };
    
    const response = await loginUser(credentials);
    
    expect(response.StatusCode).toBe(200);
    expect(response.ResponseCode).toBe('2');
    expect(response.Data).toHaveProperty('UserId');
  });
  
  it('should handle invalid credentials', async () => {
    const credentials = {
      UserName: 'invalid@example.com',
      Password: 'wrongpassword',
      CompanyId: 3044,
    };
    
    const response = await loginUser(credentials);
    
    expect(response.StatusCode).toBe(200);
    expect(response.ResponseCode).toBe('-2');
    expect(response.Message).toContain('Invalid');
  });
});
```

### Performance Testing

#### Performance Benchmarks
```typescript
// __tests__/performance/list-performance.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ProductList } from '../src/components/ProductList';

describe('ProductList Performance', () => {
  it('should render 1000 items within performance budget', async () => {
    const products = Array.from({ length: 1000 }, (_, i) => ({
      ItemCode: `ITEM${i}`,
      ItemName: `Product ${i}`,
      NewPrice: 99.99,
      Image1: 'test-image.jpg',
    }));
    
    const startTime = performance.now();
    
    render(<ProductList products={products} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
});
```

### Test Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

#### Test Setup
```typescript
// jest-setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock Zustand stores
jest.mock('./src/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

// Global test utilities
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Build Issues

**Issue**: Metro bundler fails to start
```bash
Error: ENOSPC: System limit for number of file watchers reached
```

**Solution**:
```bash
# Increase file watcher limit on Linux
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Clear Metro cache
npx expo start --clear
```

**Issue**: TypeScript compilation errors
```bash
Error: Cannot find module '@types/react-native'
```

**Solution**:
```bash
# Reinstall TypeScript dependencies
npm install --save-dev @types/react @types/react-native typescript

# Clear TypeScript cache
npx tsc --build --clean
```

#### Runtime Issues

**Issue**: App crashes on startup
```bash
Invariant Violation: "main" has not been registered
```

**Solution**:
```typescript
// Check app.json configuration
{
  "expo": {
    "main": "node_modules/expo/AppEntry.js"
  }
}

// Ensure proper app entry point
// App.tsx or index.js should be properly configured
```

**Issue**: Network requests failing
```bash
Network request failed
```

**Solution**:
```typescript
// Check network security configuration for Android
// android/app/src/main/res/xml/network_security_config.xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">api.souqmaria.com</domain>
    </domain-config>
</network-security-config>

// Add to AndroidManifest.xml
<application
  android:networkSecurityConfig="@xml/network_security_config">
```

#### Performance Issues

**Issue**: Slow list scrolling
```typescript
// Solution: Optimize FlatList props
<FlatList
  data={items}
  renderItem={renderItem}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  initialNumToRender={6}
  windowSize={5}
  getItemLayout={getItemLayout} // If item height is fixed
/>
```

**Issue**: Memory leaks
```typescript
// Solution: Proper cleanup in useEffect
useEffect(() => {
  const subscription = someObservable.subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

#### API Issues

**Issue**: CORS errors in development
```typescript
// Solution: Use proxy or configure API server
// Or use device/simulator instead of web browser
```

**Issue**: Authentication token expiry
```typescript
// Solution: Implement token refresh logic
const apiRequest = async (url: string, options: RequestInit) => {
  let response = await fetch(url, options);
  
  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry original request
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getNewToken()}`,
        },
      });
    }
  }
  
  return response;
};
```

### Debug Tools

#### React Native Debugger Setup
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Or download from GitHub releases
# https://github.com/jhen0409/react-native-debugger/releases
```

#### Flipper Integration
```typescript
// Add Flipper plugins for debugging
// Install Flipper desktop app
// Add network inspector, layout inspector, etc.
```

#### Performance Profiling
```typescript
// Use React DevTools Profiler
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Render performance:', { id, phase, actualDuration });
};

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList />
</Profiler>
```

### Logging and Monitoring

#### Production Logging
```typescript
// Implement structured logging
class Logger {
  static info(message: string, extra?: any) {
    if (__DEV__) {
      console.log(`[INFO] ${message}`, extra);
    } else {
      // Send to logging service
      this.sendToLoggingService('info', message, extra);
    }
  }
  
  static error(message: string, error?: Error) {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // Send to error tracking service
      this.sendToErrorTracking(message, error);
    }
  }
  
  private static sendToLoggingService(level: string, message: string, extra?: any) {
    // Implement logging service integration
  }
  
  private static sendToErrorTracking(message: string, error?: Error) {
    // Implement error tracking service integration
  }
}
```

#### Crash Reporting
```typescript
// Implement crash reporting
import crashlytics from '@react-native-firebase/crashlytics';

// Log non-fatal errors
crashlytics().recordError(new Error('Something went wrong'));

// Set user attributes
crashlytics().setUserId(userId);
crashlytics().setAttributes({
  role: 'customer',
  region: 'kuwait',
});
```

---

This completes the comprehensive SouqMaria Mobile Application Developer Documentation. This document provides everything a professional developer needs to understand, develop, deploy, and maintain the application successfully.

