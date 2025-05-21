import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Keyboard,
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
import useSearchStore from '../../store/search-store'; // Import search store
import { SearchItem } from '../../utils/api-service'; // Correct import for SearchItem
import { useRouter } from 'expo-router';
import { debounce } from 'lodash'; // For debouncing search

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BANNER_ASPECT_RATIO = 16 / 9; // Adjust as per your actual banner image aspect ratio
                                  // From the image, it looks wider than tall, maybe 2:1 or 2.5:1
                                  // Let's try a value that looks similar to homepage.png.
                                  // The example image is roughly 390px wide, and banner is ~200px tall. So ~2:1.
const BANNER_HEIGHT = screenWidth / 2.2; // Adjusted for a more visually appealing height
const ADVERTISEMENT_HEIGHT = screenWidth / 3.5; // Example height for ads, adjust as needed
const SEARCH_RESULT_ITEM_HEIGHT = 50;

// Calculate header height for positioning search results
// This is an approximation. For more accuracy, onLayout could be used, or a fixed header height defined.
const HEADER_TOTAL_HEIGHT = 60; // Approximate height of headerTopBar (padding + logo/icon height)
const SEARCH_BAR_AREA_HEIGHT = 70; // Approximate height of searchBarOuterContainer (padding + input height)

export default function HomeScreen() {
  const router = useRouter();
  const { categories, isLoading: isLoadingCategories, error: errorCategories, fetchCategories } = useCategoryStore();
  const { banners, isLoading: isLoadingBanners, error: errorBanners, fetchBanners } = useBannerStore();
  const { advertisements, isLoading: isLoadingAdvertisements, error: errorAdvertisements, fetchAdvertisements } = useAdvertisementStore();
  const { user } = useAuthStore();
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
  const bannerFlatListRef = useRef<FlatList<Banner>>(null);
  const [currentAdvertisementIndex, setCurrentAdvertisementIndex] = useState(0);
  const advertisementFlatListRef = useRef<FlatList<Advertisement>>(null);
  const [isBrowseDrawerVisible, setIsBrowseDrawerVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const userIdToFetch = user?.UserID || user?.id || '';
    const cultureId = '1'; // Assuming English for now

    fetchCategories(cultureId, String(userIdToFetch));
    fetchBanners(cultureId, String(userIdToFetch));
    fetchAdvertisements(cultureId, String(userIdToFetch));
  }, [user, fetchCategories, fetchBanners, fetchAdvertisements]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % banners.length;
          bannerFlatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  useEffect(() => {
    if (advertisements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdvertisementIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % advertisements.length;
          advertisementFlatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
          return nextIndex;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [advertisements]);
  
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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 1) { // Perform search if query is at least 2 chars
        performSearch(query);
      } else if (query.trim().length === 0) {
        clearSearchResults();
      }
    }, 500), // 500ms debounce delay
    [] // Empty dependency array to prevent re-creation of the debounced function on each render
  );

  // Wrap the debounced function call in a useEffect for cleanup
  useEffect(() => {
    return () => {
      // Cancel any pending debounced calls when the component unmounts
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
      // Navigate to products/list page with search parameters
      router.push({
        pathname: '/products/list',
        params: { 
          pageCode: 'Srch',
          searchName: searchQuery.trim(),
          name: `Search: "${searchQuery.trim()}"` 
        }
      });
      // Clear search query and results
      setSearchQuery('');
      clearSearchResults();
    }
  };

  const handleSearchResultPress = (item: SearchItem) => {
    console.log('Search result pressed:', item);
    setSearchQuery(''); 
    clearSearchResults(); 
    Keyboard.dismiss(); 
    router.push({ pathname: `/product/${item.XCode}`, params: { name: item.XName } });
  };

  const handleCartPress = () => router.push('/(shop)/cart');
  const handleCategoryPress = (category: Category) => {
    console.log("Navigating to category:", category.CategoryName, "SrNo:", category.SrNo, "HPCType:", category.HPCType);
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
      // if (tagUrl.startsWith('http')) Linking.openURL(tagUrl);
      // else router.push(tagUrl);
    } else {
      console.log("Banner pressed, no TagUrl.");
    }
  };
  const handleAdvertisementPress = (tagUrl: string | null) => {
    if (tagUrl) {
      console.log("Advertisement pressed, TagUrl:", tagUrl);
      // Logic to handle ad press, e.g., navigate to product or web page
      // if (tagUrl.startsWith('http')) Linking.openURL(tagUrl);
      // else router.push(tagUrl);
    } else {
      console.log("Advertisement pressed, no TagUrl.");
    }
  };
  const handleDrawerOpen = () => {
    setIsBrowseDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setIsBrowseDrawerVisible(false);
  };


  const renderBannerItem = ({ item }: { item: Banner }) => (
    <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => handleBannerPress(item.TagUrl)}
        style={styles.bannerItemContainer}
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
        activeOpacity={0.9} 
        onPress={() => handleAdvertisementPress(item.TagUrl)}
        style={styles.advertisementItemContainer}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.advertisementImage}
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity 
      style={styles.searchResultItem} 
      onPress={() => handleSearchResultPress(item)}
      activeOpacity={0.7}
    >
      <FontAwesome name="search" size={16} color={colors.blue} style={styles.searchResultIcon} />
      <Text style={styles.searchResultText}>{item.XName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBlue} />
      
      <View style={styles.headerTopBar}>
        <TouchableOpacity onPress={handleDrawerOpen} style={styles.drawerButton}>
          <FontAwesome name="bars" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@assets/logo.png')}
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <FontAwesome name="shopping-cart" size={24} color={colors.black} />
          {/* <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View> */}
        </TouchableOpacity>
      </View>
      
      {/* Search Bar - remains visually below headerTopBar but is not inside ScrollView */}
      <View style={styles.searchBarOuterContainer}>
        <View style={styles.searchBarInnerContainer}>
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
            // onBlur={() => setIsSearchFocused(false)} // Controlled by clearing search/pressing item
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled" // Added to ScrollView for better tap handling with keyboard
      >
        {/* Content that scrolls */}
        {(!isSearchFocused || (!isLoadingSearch && !errorSearch && searchResults.length === 0)) && (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Shop By Category</Text>
              {isLoadingCategories ? (
                <ActivityIndicator size="small" color={colors.blue} style={styles.loader} />
              ) : errorCategories ? (
                <Text style={styles.errorText}>{errorCategories}</Text>
              ) : categories.length > 0 ? (
                <FlatList
                  data={categories}
                  renderItem={({ item }) => (
                    <View style={{ width: screenWidth / 3, padding: spacing.xs }}>
                      <CategoryCard 
                        name={item.CategoryName}
                        imageUrl={item.imageUrl}
                        onPress={() => handleCategoryPress(item)}
                      />
                    </View>
                  )}
                  keyExtractor={(item, index) => item.SrNo || item.id || String(index)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesListContainer}
                />
              ) : (
                <Text style={styles.noDataText}>No categories found.</Text>
              )}
            </View>

            <View style={styles.bannerSectionContainer}>
              {isLoadingBanners ? (
                <ActivityIndicator size="large" color={colors.blue} style={styles.loader} />
              ) : errorBanners ? (
                <Text style={styles.errorText}>{errorBanners}</Text>
              ) : banners.length > 0 ? (
                <>
                  <FlatList
                    ref={bannerFlatListRef}
                    data={banners}
                    renderItem={renderBannerItem}
                    keyExtractor={(item) => item.Banner_ImageName}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onViewableItemsChanged={onViewableItemsChangedBanners}
                    viewabilityConfig={viewabilityConfig}
                    getItemLayout={(_data, index) => (
                      { length: screenWidth, offset: screenWidth * index, index }
                    )}
                  />
                  {banners.length > 1 && (
                    <View style={styles.indicators}>
                      {banners.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.indicator,
                            { backgroundColor: index === currentBannerIndex ? colors.blue : colors.lightGray },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <Text style={styles.noDataText}>No banners found.</Text>
              )}
            </View>
            
            <View style={styles.advertisementSectionContainer}>
              {isLoadingAdvertisements ? (
                <ActivityIndicator size="large" color={colors.blue} style={styles.loader} />
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
                      { length: screenWidth, offset: screenWidth * index, index }
                    )}
                  />
                  {advertisements.length > 1 && (
                    <View style={styles.indicators}>
                      {advertisements.map((_, index) => (
                        <View
                          key={`ad-indicator-${index}`}
                          style={[
                            styles.indicator,
                            { backgroundColor: index === currentAdvertisementIndex ? colors.blue : colors.lightGray },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              ) : (
                null 
              )}
            </View>
            
            <View style={{ height: spacing.lg }} />
          </>
        )}
      </ScrollView>

      {/* Search Results Container - Positioned absolutely, outside ScrollView */}
      {isSearchFocused && (isLoadingSearch || errorSearch || searchResults.length > 0 || searchQuery.trim().length >= 2) && (
        <View style={styles.searchResultsContainer}>
          {isLoadingSearch && (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator color={colors.blue} size="small" />
              <Text style={styles.searchLoadingText}>Searching...</Text>
            </View>
          )}
          
          {!isLoadingSearch && errorSearch && (
            <View style={styles.searchErrorContainer}>
              <Text style={styles.searchErrorText}>{errorSearch}</Text>
            </View>
          )}
          
          {!isLoadingSearch && !errorSearch && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found for "{searchQuery}"</Text>
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

      <BrowseDrawer isVisible={isBrowseDrawerVisible} onClose={handleDrawerClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightBlue,
    // zIndex: 1, // Ensure header is below search results if they overlap, but search results will have higher zIndex
  },
  drawerButton: {
    padding: spacing.sm, 
  },
  logoContainer: {
    flex: 1, // Allows logo to be centered if drawer/cart buttons have defined or intrinsic width
    alignItems: 'center', // Center logo horizontally in this container
  },
  logo: {
    width: 150, 
    height: 40, 
  },
  cartButton: {
    padding: spacing.sm,
  },
  searchBarOuterContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.lightBlue, 
    // This View is no longer inside ScrollView, so its zIndex relative to siblings in SafeAreaView
    zIndex: 5, // Higher than ScrollView content, lower than search results dropdown
  },
  searchBarInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg, 
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, 
    shadowColor: colors.black, 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: typography.body.fontSize,
    color: colors.black,
    marginLeft: spacing.sm,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: HEADER_TOTAL_HEIGHT + SEARCH_BAR_AREA_HEIGHT, // Position below header and search bar area
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: screenHeight * 0.7, // Increased to show more results 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 50, // High elevation to ensure it's on top
    zIndex: 50,    // High zIndex
    overflow: 'hidden', // Ensure content doesn't overflow the container
  },
  searchResultsList: {
    width: '100%',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    height: SEARCH_RESULT_ITEM_HEIGHT,
    backgroundColor: colors.white,
  },
  searchResultIcon: {
    marginRight: spacing.md,
    width: 16, // Fixed width for alignment
  },
  searchResultText: {
    fontSize: typography.body.fontSize,
    color: colors.blue, // Changed to blue to match reference image
    flex: 1, // Take up remaining space
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  searchLoadingText: {
    marginLeft: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.blue,
  },
  searchErrorContainer: {
    padding: spacing.md,
  },
  searchErrorText: {
    padding: spacing.md,
    color: colors.red,
    textAlign: 'center',
  },
  noResultsContainer: {
    padding: spacing.md,
  },
  noResultsText: {
    padding: spacing.md,
    color: colors.textGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
    // zIndex: 0, // Ensure ScrollView is below absolutely positioned elements
  },
  scrollContentContainer: {
    paddingBottom: spacing.lg, 
  },
  sectionContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  bannerSectionContainer: {
    marginTop: spacing.lg,
  },
  advertisementSectionContainer: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md, 
    textAlign: 'left', 
  },
  categoriesListContainer: {
    paddingVertical: spacing.xs, 
  },
  bannerItemContainer: {
    width: screenWidth,
    height: BANNER_HEIGHT,
    borderRadius: radii.lg, 
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  advertisementItemContainer: {
    width: screenWidth,
    height: ADVERTISEMENT_HEIGHT,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  advertisementImage: {
    width: '100%',
    height: '100%',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.xs,
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
    marginVertical: spacing.md,
  },
}); 