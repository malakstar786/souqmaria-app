import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@theme';
import {
  getFilteredProducts,
  ProductFilterParams,
  ProductFilterResponse,
  FilterOption,
  getAllProductsDirectly,
} from '../../utils/api-service';
import ProductCard from '../../components/ProductCard';
import ProductFilters from '../../components/ProductFilters';
import useAuthStore from '../../store/auth-store';
import useSearchStore from '../../store/search-store';
import useLanguageStore from '../../store/language-store';
import { RESPONSE_CODES, COMMON_PARAMS as API_COMMON_PARAMS, CULTURE_IDS } from '../../utils/api-config';
import { useTranslation } from '../../utils/translations';

const PRODUCT_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/CompanyLogo/3044/';

export default function ProductListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ 
    name?: string;
    homePageCatSrNo?: string;
    pageCode?: string;
    category?: string;
    subCategory?: string;
    searchName?: string;
  }>();
  const { user } = useAuthStore();
  const { getCultureId } = useLanguageStore();
  const cultureId = getCultureId();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [localSearchText, setLocalSearchText] = useState(params.searchName || '');
  
  // Filter state
  const [filterOptions, setFilterOptions] = useState<{
    brands: FilterOption[];
    categories: FilterOption[];
    subCategories: FilterOption[];
    sortOptions: FilterOption[];
    minPrice: number;
    maxPrice: number;
  }>({
    brands: [],
    categories: [],
    subCategories: [],
    sortOptions: [],
    minPrice: 0,
    maxPrice: 1000,
  });
  
  const [activeFilters, setActiveFilters] = useState<{
    brands: string[];
    categories: string[];
    subCategories: string[];
    priceRange: [number, number];
    sortBy: string;
  }>({
    brands: [],
    categories: [],
    subCategories: [],
    priceRange: [0, 1000],
    sortBy: 'Srt_Dflt', // Default sorting
  });
  
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

  // Memoize the product list to avoid unnecessary re-renders
  const memoizedProducts = useMemo(() => filteredProducts, [filteredProducts]);
  
  // Memoize filter options to avoid unnecessary re-renders
  const memoizedFilterOptions = useMemo(() => filterOptions, [filterOptions]);

  const { clearSearchResults } = useSearchStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const screenTitle = params.name || (params.searchName ? `Search: "${params.searchName}"` : 'Products');

  // Update local search text when params change
  useEffect(() => {
    if (params.searchName && params.searchName !== localSearchText) {
      setLocalSearchText(params.searchName);
    }
  }, [params.searchName]);

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

      // Use the correct API for initial load: getAllProductsDirectly (GET endpoint)
      console.log('Using getAllProductsDirectly API for initial category load');
      const directResponse = await getAllProductsDirectly(apiParams);
      console.log('Direct Product API response:', {
        responseCode: directResponse.ResponseCode,
        message: directResponse.Message,
        hasData: directResponse.List ? true : false,
        productCount: directResponse.List?.Productlist?.length || 0,
      });

      if (String(directResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS) || 
          String(directResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS_ALT)) {
        
        // Map products to the correct format from direct API response
        // The API returns List as an object containing Productlist array, not a direct array
        const productArray = directResponse.List?.Productlist || [];
        const mappedProducts = productArray.map((item) => ({
          ItemCode: item.Item_XCode,
          ItemName: item.Item_XName,
          OldPrice: item.OldPrice || 0,
          Price: item.NewPrice,
          ImageUrl: item.Item_Image1 ? `${PRODUCT_IMAGE_BASE_URL}${item.Item_Image1}` : undefined,
        }));
        
        setAllProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        
        // Set filter options from the API response
        setFilterOptions({
          brands: directResponse.List?.li_Brand_List || [],
          categories: directResponse.List?.li_Category_List || [],
          subCategories: directResponse.List?.li_SubCategory_List || [],
          sortOptions: directResponse.List?.li_SortBy_List || [],
          minPrice: directResponse.List?.MinPrice || 0,
          maxPrice: directResponse.List?.MaxPrice || 1000,
        });
        
        // Reset active filters with correct price range
        setActiveFilters({
          brands: [],
          categories: [],
          subCategories: [],
          priceRange: [
            directResponse.List?.MinPrice || 0, 
            directResponse.List?.MaxPrice || 1000
          ],
          sortBy: 'Srt_Dflt', // Default sorting
        });
        
        initialLoadDone.current = true;
      } else {
        // Handle specific error cases
        if (directResponse.ResponseCode === '-4' && directResponse.Message === 'List not Found') {
          // This is a normal case when no products are found
          setAllProducts([]);
          setFilteredProducts([]);
          setError(null); // Don't show error for empty results
          console.log('Direct Product API: No products found for current category');
        } else {
          // Set error message for actual API failures
          setError(directResponse.Message || 'Failed to load products.');
          console.error('Direct Product API error:', directResponse.Message);
        }
      }

    } catch (e: any) {
      const errorMsg = e.message || 'An unexpected error occurred';
      console.error('API error in loadProducts:', errorMsg, e);
      setError(errorMsg);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
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

  const handleApplyFilters = async (filters: {
    brands: string[];
    categories: string[];
    subCategories: string[];
    priceRange: [number, number];
    sortBy: string;
  }) => {
    setIsLoading(true);
    
    try {
      // Prepare filter API parameters
      let apiParams: any = {};
      
      if (params.pageCode === 'Srch' && params.searchName) {
        apiParams = {
          PageCode: 'Srch',
          SearchName: params.searchName,
          Category: '',
          SubCategory: '',
          HomePageCatSrNo: '',
        };
      } else if (params.homePageCatSrNo && params.pageCode) {
        apiParams = {
          PageCode: params.pageCode,
          HomePageCatSrNo: params.homePageCatSrNo,
          Category: '',
          SubCategory: '',
          SearchName: '',
        };
      } else if (params.pageCode === 'MN' && params.category) {
        apiParams = {
          PageCode: params.pageCode,
          Category: params.category,
          SubCategory: params.subCategory || '',
          SearchName: '',
          HomePageCatSrNo: '',
        };
      }
      
      const filterParams: ProductFilterParams = {
        ...apiParams,
        CultureId: cultureId,
        UserId: user?.UserID || user?.id || '',
        Company: API_COMMON_PARAMS.Company,
        Arry_Category: filters.categories,
        Arry_SubCategory: filters.subCategories,
        Arry_Brand: filters.brands,
        Arry_Color: [],
        MinPrice: filters.priceRange[0],
        MaxPrice: filters.priceRange[1],
        SortBy: filters.sortBy,
      };
      
      // Call the filter API
      const filterResponse = await getFilteredProducts(filterParams);
      
      if (String(filterResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS) || 
          String(filterResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS_ALT)) {
        
        // Update active filters
        setActiveFilters(filters);
        
        // Map products to the correct format
        const productArray = filterResponse.List?.Productlist || [];
        const mappedProducts = productArray.map((item) => ({
          ItemCode: item.Item_XCode,
          ItemName: item.Item_XName,
          OldPrice: item.OldPrice,
          Price: item.NewPrice,
          ImageUrl: item.Item_Image1 ? `${PRODUCT_IMAGE_BASE_URL}${item.Item_Image1}` : undefined,
        }));
        
        setFilteredProducts(mappedProducts);
      } else {
        // Handle specific error cases for filters
        if (filterResponse.ResponseCode === '-4' && filterResponse.Message === 'List not Found') {
          // This is a normal case when no products match the filter criteria
          setFilteredProducts([]);
          setError(null); // Don't show error for empty filter results
          console.log('Product filter: No products found for applied filters');
        } else {
          // Set error message for actual API failures
          setError(filterResponse.Message || 'Failed to apply filters.');
          console.error('Product filter API error:', filterResponse.Message);
        }
      }
    } catch (e: any) {
      const errorMsg = e.message || 'An unexpected error occurred while applying filters';
      console.error('API error in handleApplyFilters:', errorMsg, e);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    // Reset active filters to default
    setActiveFilters({
      brands: [],
      categories: [],
      subCategories: [],
      priceRange: [
        filterOptions.minPrice || 0, 
        filterOptions.maxPrice || 1000
      ],
      sortBy: 'Srt_Dflt',
    });
    
    // Load products again without filters
    loadProducts();
  };

  const loadFilterOptions = useCallback(async () => {
    // If we already have filter options, don't reload them
    if (filterOptions.brands.length > 0 || filterOptions.categories.length > 0) {
      return;
    }
    
    try {
      // Prepare filter API parameters to get filter options
      let apiParams: any = {};
      
      if (params.pageCode === 'Srch' && params.searchName) {
        apiParams = {
          PageCode: 'Srch',
          SearchName: params.searchName,
          Category: '',
          SubCategory: '',
          HomePageCatSrNo: '',
        };
      } else if (params.homePageCatSrNo && params.pageCode) {
        apiParams = {
          PageCode: params.pageCode,
          HomePageCatSrNo: params.homePageCatSrNo,
          Category: '',
          SubCategory: '',
          SearchName: '',
        };
      } else if (params.pageCode === 'MN' && params.category) {
        apiParams = {
          PageCode: params.pageCode,
          Category: params.category,
          SubCategory: params.subCategory || '',
          SearchName: '',
          HomePageCatSrNo: '',
        };
      }
      
      const filterParams: ProductFilterParams = {
        ...apiParams,
        CultureId: cultureId,
        UserId: user?.UserID || user?.id || '',
        Company: API_COMMON_PARAMS.Company,
        Arry_Category: [],
        Arry_SubCategory: [],
        Arry_Brand: [],
        Arry_Color: [],
        MinPrice: 0,
        MaxPrice: 1000,
        SortBy: 'Srt_Dflt',
      };
      
      // Call the filter API to get filter options
      const filterResponse = await getFilteredProducts(filterParams);
      
      if (String(filterResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS) || 
          String(filterResponse.ResponseCode) === String(RESPONSE_CODES.SUCCESS_ALT)) {
        
        // Update filter options
        setFilterOptions({
          brands: filterResponse.List?.li_Brand_List || [],
          categories: filterResponse.List?.li_Category_List || [],
          subCategories: filterResponse.List?.li_SubCategory_List || [],
          sortOptions: filterResponse.List?.li_SortBy_List || [],
          minPrice: filterResponse.List?.MinPrice || 0,
          maxPrice: filterResponse.List?.MaxPrice || 1000,
        });
        
        // Update active filters price range to match available range
        setActiveFilters(prev => ({
          ...prev,
          priceRange: [
            filterResponse.List?.MinPrice || 0, 
            filterResponse.List?.MaxPrice || 1000
          ],
        }));
      }
    } catch (e: any) {
      console.error('Error loading filter options:', e);
    }
  }, [
    cultureId, 
    user, 
    params.homePageCatSrNo, 
    params.pageCode, 
    params.category,
    params.searchName,
    params.subCategory,
    filterOptions.brands.length,
    filterOptions.categories.length
  ]);

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
        
        <ProductFilters
          isLoading={isLoading}
          filters={memoizedFilterOptions}
          activeFilters={activeFilters}
          onApplyFilters={handleApplyFilters}
          onReset={handleResetFilters}
          onLoadFilterOptions={loadFilterOptions}
        />
        
        <View style={styles.productsContainer}>
          <Text style={styles.resultsText}>
            {filteredProducts.length > 0 
              ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Result' : 'Results'} Found` 
                              : (isLoading ? t('loading') : t('no_results_found'))}
          </Text>
          
          {isLoading && filteredProducts.length === 0 ? (
            <View style={styles.fullScreenLoaderOrEmptyContainer}>
              <ActivityIndicator size="large" color={colors.blue} />
            </View>
          ) : !isLoading && filteredProducts.length === 0 ? (
            <View style={styles.fullScreenLoaderOrEmptyContainer}>
              <Text style={styles.noResultsTextLarge}>
                {t('no_products_found')}{params.searchName ? ` ${t('no_products_found_for')} "${params.searchName}"` : ''}.
              </Text>
              {error && <Text style={[styles.errorText, {marginTop: spacing.sm}]}>{error}</Text>}
            </View>
          ) : (
            <FlatList
              data={memoizedProducts}
              renderItem={({ item }) => (
                <ProductCard product={item} onPress={handleProductPress} />
              )}
              keyExtractor={(item) => item.ItemCode}
              numColumns={2}
              contentContainerStyle={styles.productList}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={8}
              windowSize={10}
              getItemLayout={(data, index) => ({
                length: 200, // Approximate item height
                offset: 200 * Math.floor(index / 2), // Approximate offset for 2 columns
                index,
              })}
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
  productsContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  resultsText: {
    fontSize: 13,
    color: colors.textGray,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
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