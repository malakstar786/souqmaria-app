import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Keyboard,
  Image,
  Platform,
  // Linking, // Uncomment if using Linking for banner press
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@theme';
import CategoryCard from '../../components/CategoryCard';
import useCategoryStore, { Category } from '../../store/category-store';
import useAuthStore from '../../store/auth-store';
import useBannerStore, { Banner } from '../../store/banner-store';
import useAdvertisementStore, { Advertisement } from '../../store/advertisement-store';
import BrowseDrawer from '../../components/browse-drawer';
import useSearchStore from '../../store/search-store';
import { SearchItem } from '../../utils/api-service';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import useCartStore from '../../store/cart-store';
import { useTranslation } from '../../utils/translations';
import { parseBannerUrl, isValidCategoryCode } from '../../utils/url-parser';
import { useBackgroundCachePreload } from '../../utils/rtl';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BANNER_HEIGHT = 350; // Match screenshot
const ADVERTISEMENT_HEIGHT = screenHeight * 0.25; // Advertisement height
const SEARCH_RESULT_ITEM_HEIGHT = 50;
const HEADER_HEIGHT = 70;
const SEARCH_BAR_HEIGHT = 115; // 48px search bar + 16px padding + 16px gap to ensure search bar visibility

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Preload cache for the opposite language in the background
  useBackgroundCachePreload();
  
  const { categories, isLoading: isLoadingCategories, error: errorCategories, fetchCategories } = useCategoryStore();
  const { banners, isLoading: isLoadingBanners, error: errorBanners, fetchBanners } = useBannerStore();
  const { advertisements, isLoading: isLoadingAdvertisements, error: errorAdvertisements, fetchAdvertisements } = useAdvertisementStore();
  const { user } = useAuthStore();
  const { totalItems } = useCartStore();
  const {
    searchQuery,
    searchResults,
    isLoading: isLoadingSearch,
    error: errorSearch,
    setSearchQuery,
    performSearch,
    clearSearchResults,
  } = useSearchStore();
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentAdvertisementIndex, setCurrentAdvertisementIndex] = useState(0);
  const [isBrowseDrawerVisible, setIsBrowseDrawerVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAdvertisements, setShowAdvertisements] = useState(false);
  
  const bannerFlatListRef = useRef<FlatList<Banner>>(null);
  const advertisementFlatListRef = useRef<FlatList<Advertisement>>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const userIdToFetch = user?.UserID || user?.id || '';
    // Remove hardcoded culture ID - let the stores use dynamic culture ID from language store
    fetchCategories(undefined, String(userIdToFetch));
    fetchBanners(undefined, String(userIdToFetch));
    fetchAdvertisements(undefined, String(userIdToFetch));
  }, [user, fetchCategories, fetchBanners, fetchAdvertisements]);

  // Auto-scroll banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % banners.length;
          bannerFlatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
          return nextIndex;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Auto-scroll advertisements
  useEffect(() => {
    if (advertisements.length > 1 && showAdvertisements) {
      const interval = setInterval(() => {
        setCurrentAdvertisementIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % advertisements.length;
          advertisementFlatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
          return nextIndex;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [advertisements, showAdvertisements]);

  const onViewableItemsChangedBanners = useRef(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      setCurrentBannerIndex(viewableItems[0].index);
    }
  }).current;

  const onViewableItemsChangedAdvertisements = useRef(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      setCurrentAdvertisementIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 1) {
        performSearch(query);
      } else if (query.trim().length === 0) {
        clearSearchResults();
      }
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (searchQuery.trim()) {
      router.push({
        pathname: '/products/list',
        params: { 
          pageCode: 'Srch',
          searchName: searchQuery.trim(),
          name: `Search: "${searchQuery.trim()}"` 
        }
      });
      setSearchQuery('');
      clearSearchResults();
      setIsSearchFocused(false);
    }
  };

  const handleSearchResultPress = (item: SearchItem) => {
    setSearchQuery(''); 
    clearSearchResults(); 
    setIsSearchFocused(false);
    Keyboard.dismiss(); 
    router.push({ pathname: `/product/[id]`, params: { id: item.XCode, name: item.XName } });
  };

  const handleCartPress = () => router.push('/(shop)/cart');
  
  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: `/products/list`,
      params: { 
        homePageCatSrNo: category.SrNo,
        pageCode: category.HPCType,
        name: category.CategoryName 
      }
    });
  };

  const handleBannerPress = (tagUrl: string | null) => {
    if (tagUrl) {
      console.log("Banner pressed, TagUrl:", tagUrl);
      
              // Parse the URL to extract category and subcategory codes
        const { categoryCode, subCategoryCode } = parseBannerUrl(tagUrl);
      
      if (categoryCode && isValidCategoryCode(categoryCode)) {
        console.log("Navigating to category:", categoryCode, "subcategory:", subCategoryCode);
        
        // Navigate to products list with Menu page code (MN) as specified in instructions
        router.push({
          pathname: '/products/list',
          params: {
            pageCode: 'MN',
            category: categoryCode,
            subCategory: subCategoryCode || '',
            name: 'Products'
          }
        });
      } else {
        console.log("Invalid or missing category code in banner URL:", tagUrl);
      }
    } else {
      console.log("Banner pressed, no TagUrl.");
    }
  };

  const handleAdvertisementPress = (tagUrl: string | null) => {
    if (tagUrl) {
      console.log("Advertisement pressed, TagUrl:", tagUrl);
    } else {
      console.log("Advertisement pressed, no TagUrl.");
    }
  };

  const handleDrawerOpen = () => setIsBrowseDrawerVisible(true);
  const handleDrawerClose = () => setIsBrowseDrawerVisible(false);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    // Show advertisements when user scrolls past the banner section
    if (contentOffset.y > BANNER_HEIGHT + 200 && !showAdvertisements) {
      setShowAdvertisements(true);
    }
  };

  const renderBannerItem = ({ item }: { item: Banner }) => (
    <TouchableOpacity 
      style={styles.bannerItemContainer} 
      onPress={() => handleBannerPress(item.TagUrl)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderAdvertisementItem = ({ item }: { item: Advertisement }) => (
    <TouchableOpacity 
      style={styles.advertisementItemContainer} 
      onPress={() => handleAdvertisementPress(item.TagUrl)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.advertisementImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity style={styles.searchResultItem} onPress={() => handleSearchResultPress(item)}>
      <FontAwesome name="search" size={16} color={colors.lightGray} style={styles.searchResultIcon} />
      <Text style={styles.searchResultText}>{item.XName}</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItemWrapper}
      onPress={() => handleCategoryPress(item)}
      accessibilityRole="button"
      accessibilityLabel={item.CategoryName}
      activeOpacity={1.85}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.categoryImage}
        resizeMode="contain"
      />
      <Text style={styles.categoryName}>{item.CategoryName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.lightBlue} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleDrawerOpen} style={styles.drawerButton} accessibilityLabel="Open menu" accessibilityRole="button">
          <FontAwesome name="bars" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@assets/logo.png')}
            style={styles.logo} 
            resizeMode="contain"
            accessibilityLabel="Souq Maria Logo"
          />
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress} accessibilityLabel="View cart" accessibilityRole="button">
          <FontAwesome name="shopping-cart" size={24} color={colors.black} />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color={colors.blue} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Products"
            placeholderTextColor={colors.lightGray}
            value={searchQuery}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            onFocus={() => setIsSearchFocused(true)}
            accessibilityLabel="Search products"
            accessibilityRole="search"
          />
        </View>
        
        {/* Search Results Overlay */}
        {isSearchFocused && (isLoadingSearch || errorSearch || searchResults.length > 0 || searchQuery.trim().length >= 2) && (
          <View style={styles.searchResultsContainer}>
            {isLoadingSearch && (
              <View style={styles.searchLoadingContainer}>
                <ActivityIndicator color={colors.blue} size="small" />
                <Text style={styles.searchLoadingText}>{t('searching')}</Text>
              </View>
            )}
            
            {!isLoadingSearch && errorSearch && (
              <View style={styles.searchErrorContainer}>
                <Text style={styles.searchErrorText}>{errorSearch}</Text>
              </View>
            )}
            
            {!isLoadingSearch && !errorSearch && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>{t('no_products_found_for')} "{searchQuery}"</Text>
              </View>
            )}
            
            {!isLoadingSearch && searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResultItem}
                keyExtractor={(item) => item.XCode + item.XName}
                style={styles.searchResultsList}
                keyboardShouldPersistTaps="handled"
                getItemLayout={(data, index) => (
                  { length: SEARCH_RESULT_ITEM_HEIGHT, offset: SEARCH_RESULT_ITEM_HEIGHT * index, index }
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {(!isSearchFocused || (!isLoadingSearch && !errorSearch && searchResults.length === 0)) && (
          <>
            {/* Categories Section */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>{t('shop_by_category')}</Text>
              {isLoadingCategories ? (
                <ActivityIndicator size="small" color={colors.blue} style={styles.loader} />
              ) : errorCategories ? (
                <Text style={styles.errorText}>{errorCategories}</Text>
              ) : categories.length > 0 ? (
                <FlatList
                  data={categories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item, index) => item.SrNo || item.id || String(index)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesHorizontalGrid}
                />
              ) : (
                <Text style={styles.noDataText}>{t('no_categories_found')}</Text>
              )}
            </View>

            {/* Banner Section - Covers bottom half */}
            <View style={styles.bannerSection}>
              {isLoadingBanners ? (
                <View style={styles.bannerLoaderContainer}>
                  <ActivityIndicator size="large" color={colors.blue} />
                </View>
              ) : errorBanners ? (
                <Text style={styles.errorText}>{errorBanners}</Text>
              ) : banners.length > 0 ? (
                <>
                  <FlatList
                    ref={bannerFlatListRef}
                    data={banners}
                    renderItem={renderBannerItem}
                    keyExtractor={(item) => item.Banner_ImageName}
                    horizontal={true}
                    snapToInterval={screenWidth + spacing.lg}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onViewableItemsChanged={onViewableItemsChangedBanners}
                    viewabilityConfig={viewabilityConfig}
                    getItemLayout={(_data, index) => (
                      { length: screenWidth - (spacing.lg * 2), offset: (screenWidth - (spacing.lg * 2)) * index, index }
                    )}
                  />
                  {banners.length > 1 && (
                    <View style={styles.indicators}>
                      {banners.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.indicator,
                            {
                              backgroundColor: index === currentBannerIndex
                                ? '#FFFFFF'
                                : '#D9D9D9',
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              ) : null}
            </View>
            
            {/* Advertisement Section - Shows when scrolled */}
            {showAdvertisements && (
              <View style={styles.advertisementSection}>
                {isLoadingAdvertisements ? (
                  <ActivityIndicator size="large" color={colors.blue} />
                ) : errorAdvertisements ? (
                  <Text style={styles.errorText}>{errorAdvertisements}</Text>
                ) : advertisements.length > 0 ? (
                  <>
                    <FlatList
                      ref={advertisementFlatListRef}
                      data={advertisements}
                      renderItem={renderAdvertisementItem}
                      keyExtractor={(item) => item.id || item.Ads_ImageName}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled
                      onViewableItemsChanged={onViewableItemsChangedAdvertisements}
                      viewabilityConfig={viewabilityConfig}
                                             getItemLayout={(_data, index) => (
                         { length: screenWidth - (spacing.lg * 2), offset: (screenWidth - (spacing.lg * 2)) * index, index }
                       )}
                    />
                    {advertisements.length > 1 && (
                      <View style={styles.indicators}>
                        {advertisements.map((_, index) => (
                          <View
                            key={`ad-indicator-${index}`}
                            style={[
                              styles.indicator,
                              { 
                                backgroundColor: index === currentAdvertisementIndex 
                                  ? colors.blue 
                                  : colors.lightGray 
                              },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </>
                ) : null}
              </View>
            )}
            
            <View style={{ height: spacing.xl * 2 }} />
          </>
        )}
      </ScrollView>

      <BrowseDrawer isVisible={isBrowseDrawerVisible} onClose={handleDrawerClose} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightBlue, // Light blue as per design
    height: HEADER_HEIGHT,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  drawerButton: {
    padding: spacing.sm,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 153,
    height: 50,
  },
  cartButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: colors.lightBlue,
    zIndex: 5,
    position: 'relative', // Add this
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.blue,
    paddingHorizontal: spacing.lg,
    height: 48,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: spacing.md,
    color: colors.blue,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    height: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  categoriesSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.white,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    textAlign: 'left',
  },
  categoriesHorizontalGrid: {
    paddingHorizontal: 10,
  },
  categoryItemWrapper: {
    width: 128,
    height: 110,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: colors.white,
    marginRight: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 4,
    elevation: 2,
    padding: 0,
  },
  categoryImage: {
    width: 126,
    height: 66,
    marginTop: 8,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  categoryName: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
  },
  bannerSection: {
    marginTop: 12,
    marginBottom: 10,
    height: BANNER_HEIGHT,
    backgroundColor: 'transparent',
    marginHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerItemContainer: {
    width: screenWidth - (spacing.lg * 2),
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 0,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  advertisementSection: {
    marginTop: spacing.xl,
    height: ADVERTISEMENT_HEIGHT,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  advertisementItemContainer: {
    width: screenWidth - (spacing.lg * 2),
    height: ADVERTISEMENT_HEIGHT,
  },
  advertisementImage: {
    width: '100%',
    height: '100%',
    borderRadius: radii.lg,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 0,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  searchResultsContainer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    top: '100%', // Change this from dynamic top
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: screenHeight * 0.6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 50,
    zIndex: 50,
    overflow: 'hidden',
  },
  searchResultsList: {
    width: '100%',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    height: SEARCH_RESULT_ITEM_HEIGHT,
    backgroundColor: colors.white,
  },
  searchResultIcon: {
    marginRight: spacing.md,
    width: 16,
  },
  searchResultText: {
    fontSize: 16,
    color: colors.blue,
    flex: 1,
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  searchLoadingText: {
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.blue,
  },
  searchErrorContainer: {
    padding: spacing.lg,
  },
  searchErrorText: {
    color: colors.red,
    textAlign: 'center',
  },
  noResultsContainer: {
    padding: spacing.lg,
  },
  noResultsText: {
    color: colors.textGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loader: {
    marginVertical: spacing.lg,
  },
  errorText: {
    textAlign: 'center',
    color: colors.red,
    marginVertical: spacing.md,
  },
  noDataText: {
    textAlign: 'center',
    color: colors.textGray,
    marginVertical: spacing.lg,
  },
}); 