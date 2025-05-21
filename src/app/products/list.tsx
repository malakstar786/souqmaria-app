import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../../theme';
import {
  getAllProductsDirectly,
  AllProductsDirectResponse,
  SearchItem,
} from '../../utils/api-service';
import ProductCard from '../../components/ProductCard';
import useAuthStore from '../../store/auth-store';
import useSearchStore from '../../store/search-store';
import { RESPONSE_CODES, COMMON_PARAMS as API_COMMON_PARAMS, CULTURE_IDS } from '../../utils/api-config';

const { width } = Dimensions.get('window');
const PRODUCT_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/CompanyLogo/3044/';
const HEADER_AND_FILTER_HEIGHT = 180;

export default function ProductListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    name?: string;
    homePageCatSrNo?: string;
    pageCode?: string;
    category?: string;
    subCategory?: string;
    searchName?: string;
  }>();
  const { user } = useAuthStore();
  const cultureId = CULTURE_IDS.ENGLISH;

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [localSearchText, setLocalSearchText] = useState(params.searchName || '');
  
  // Use a ref to track if initial load has happened
  const initialLoadDone = useRef(false);
  
  // Store params in a ref to compare without triggering re-renders
  const paramsRef = useRef({
    homePageCatSrNo: params.homePageCatSrNo,
    pageCode: params.pageCode,
    category: params.category,
    searchName: params.searchName,
    subCategory: params.subCategory
  });

  const { clearSearchResults } = useSearchStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const screenTitle = params.name || (params.searchName ? `Search: "${params.searchName}"` : 'Products');

  // Update local search text when params change
  useEffect(() => {
    if (params.searchName && params.searchName !== localSearchText) {
      setLocalSearchText(params.searchName);
    }
  }, [params.searchName, localSearchText]);

  // Check if params have changed
  const haveParamsChanged = useCallback(() => {
    const prevParams = paramsRef.current;
    
    const hasChanged = 
      prevParams.homePageCatSrNo !== params.homePageCatSrNo ||
      prevParams.pageCode !== params.pageCode ||
      prevParams.category !== params.category ||
      prevParams.searchName !== params.searchName ||
      prevParams.subCategory !== params.subCategory;
    
    if (hasChanged) {
      // Update the ref with current params
      paramsRef.current = {
        homePageCatSrNo: params.homePageCatSrNo,
        pageCode: params.pageCode,
        category: params.category,
        searchName: params.searchName,
        subCategory: params.subCategory
      };
    }
    
    return hasChanged;
  }, [params.homePageCatSrNo, params.pageCode, params.category, params.searchName, params.subCategory]);

  const loadProducts = useCallback(async () => {
    // Skip if we already loaded products and nothing has changed
    if (initialLoadDone.current && !haveParamsChanged() && allProducts.length > 0) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log('loadProducts triggered with params:', params);
    
    try {
      let apiParams: any;
      if (params.pageCode === 'Srch' && params.searchName) {
        apiParams = {
          PageCode: 'Srch',
          SearchName: params.searchName,
          Category: '',
          SubCategory: '',
          HomePageCatSrNo: '',
          CultureId: cultureId,
          UserId: user?.UserID || user?.id || '',
          Company: API_COMMON_PARAMS.Company,
        };
        console.log('Fetching products with Search params:', apiParams);
      } else if (params.homePageCatSrNo && params.pageCode) {
        apiParams = {
          PageCode: params.pageCode,
          HomePageCatSrNo: params.homePageCatSrNo,
          Category: '',
          SubCategory: '',
          SearchName: '',
          CultureId: cultureId,
          UserId: user?.UserID || user?.id || '',
          Company: API_COMMON_PARAMS.Company,
        };
        console.log('Fetching products with HomePageCatSrNo params:', apiParams);
      } else if (params.pageCode === 'MN' && params.category) {
        apiParams = {
          PageCode: params.pageCode,
          Category: params.category,
          SubCategory: params.subCategory || '',
          SearchName: '',
          HomePageCatSrNo: '',
          CultureId: cultureId,
          UserId: user?.UserID || user?.id || '',
          Company: API_COMMON_PARAMS.Company,
        };
        console.log('Fetching products with Menu params:', apiParams);
      } else {
        const errorMsg = 'Missing required parameters for fetching products';
        console.log('API parameter error:', errorMsg, params);
        setError(errorMsg);
        setIsLoading(false);
        setAllProducts([]);
        setFilteredProducts([]);
        return;
      }

      const productListResponse: AllProductsDirectResponse = await getAllProductsDirectly(apiParams);
      console.log('Product List API response:', {
        responseCode: productListResponse.ResponseCode,
        message: productListResponse.Message,
        hasData: productListResponse.List ? true : false,
        listType: Array.isArray(productListResponse.List) ? 'Array' : typeof productListResponse.List,
        count: productListResponse.List ? 
          (Array.isArray(productListResponse.List) ? productListResponse.List.length : 
           (typeof productListResponse.List === 'object' && productListResponse.List !== null && 'Productlist' in productListResponse.List ? (productListResponse.List as any).Productlist.length : 'N/A')) 
          : 0
      });

      let productArray: any[] = [];
      if (productListResponse.ResponseCode === RESPONSE_CODES.SUCCESS || String(productListResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS_ALT)) {
        if (productListResponse.List && Array.isArray(productListResponse.List)) {
          productArray = productListResponse.List;
        } else if (
          productListResponse.List &&
          typeof productListResponse.List === 'object' &&
          productListResponse.List !== null &&
          'Productlist' in productListResponse.List &&
          Array.isArray((productListResponse.List as any).Productlist)
        ) {
          productArray = (productListResponse.List as any).Productlist;
        }
      } else {
        setError(productListResponse.Message || 'Failed to load products.');
        console.error('Product list API error:', productListResponse.Message);
      }
      
      const mappedProducts = productArray.map((item) => ({
        ItemCode: item.Item_XCode,
        ItemName: item.Item_XName,
        OldPrice: item.OldPrice,
        Price: item.NewPrice,
        ImageUrl: item.Item_Image1 ? `${PRODUCT_IMAGE_BASE_URL}${item.Item_Image1}` : undefined,
      }));
      
      setAllProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
      initialLoadDone.current = true;

    } catch (e: any) {
      const errorMsg = e.message || 'An unexpected error occurred';
      console.error('API error in loadProducts:', errorMsg, e);
      setError(errorMsg);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  // Use a stable reference to params by picking specific properties, not the entire params object
  }, [
    cultureId, 
    user, 
    params.homePageCatSrNo, 
    params.pageCode, 
    params.category,
    params.searchName,
    params.subCategory
  ]);

  // Only load products on initial render or when URL params change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleLocalSearchTextChange = (text: string) => {
    setLocalSearchText(text);
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    clearSearchResults();
    const trimmedQuery = localSearchText.trim();
    if (trimmedQuery && trimmedQuery !== params.searchName) {
      router.setParams({ 
          name: `Search: "${trimmedQuery}"`, 
          pageCode: 'Srch', 
          searchName: trimmedQuery, 
          homePageCatSrNo: undefined,
          category: undefined,
          subCategory: undefined,
      });
    }
  };

  const handleProductPress = (product: any) => {
    router.push(`/product/${product.ItemCode}`);
  };

  if (isLoading && filteredProducts.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </SafeAreaView>
    );
  }

  if (error && filteredProducts.length === 0) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadProducts}
          accessibilityRole="button"
          accessibilityLabel="Retry loading products"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.lightBlue} barStyle="dark-content" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <FontAwesome name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color={colors.blue} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Products"
              placeholderTextColor={colors.textGray}
              value={localSearchText}
              onChangeText={handleLocalSearchTextChange}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              accessibilityRole="search"
              accessibilityLabel="Search products"
            />
          </View>
          
          <Link href="/(shop)/cart" asChild>
            <TouchableOpacity 
              style={styles.cartButton}
              accessibilityRole="button"
              accessibilityLabel="View cart"
            >
              <FontAwesome name="shopping-cart" size={20} color={colors.black} />
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.filterContainer}>
          <View style={styles.filterButtonsRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Sort By</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Price</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Brand</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.resultsText}>
            {filteredProducts.length > 0 
              ? `${filteredProducts.length} Result${filteredProducts.length === 1 ? '' : 's'} Found` 
              : (isLoading ? 'Loading...' : 'No Results Found')}
          </Text>
        </View>
        
        <View style={styles.productsContainer}>
          {isLoading && filteredProducts.length === 0 ? (
            <View style={styles.fullScreenLoaderOrEmptyContainer}>
              <ActivityIndicator size="large" color={colors.blue} />
            </View>
          ) : !isLoading && filteredProducts.length === 0 ? (
            <View style={styles.fullScreenLoaderOrEmptyContainer}>
              <Text style={styles.noResultsTextLarge}>
                No products found{params.searchName ? ` for "${params.searchName}"` : ''}.
              </Text>
              {error && <Text style={[styles.errorText, {marginTop: spacing.sm}]}>{error}</Text>}
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={({ item }) => (
                <ProductCard product={item} onPress={handleProductPress} />
              )}
              keyExtractor={(item) => item.ItemCode}
              numColumns={2}
              contentContainerStyle={styles.productList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: colors.red,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.blue,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
  },
  retryButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBlue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === 'android' ? spacing.lg : spacing.md,
    zIndex: 10,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    height: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },
  cartButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  filterContainer: {
    backgroundColor: colors.lightBlue,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    zIndex: 5,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  filterButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
  },
  resultsText: {
    fontSize: 13,
    color: colors.textGray,
    marginTop: spacing.xs,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  productList: {
    padding: spacing.sm,
  },
  fullScreenLoaderOrEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  noResultsTextLarge: {
    fontSize: 18,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
}); 