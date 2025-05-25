import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography } from '@theme';
import useAllCategoryStore, { Category } from '../../store/all-category-store';
import useSearchStore from '../../store/search-store';
import { SearchItem } from '../../utils/api-service';
import { debounce } from 'lodash';
import { useTranslation } from '../../utils/translations';
import { useRTL } from '../../utils/rtl';

const { width } = Dimensions.get('window');
const SEARCH_RESULT_ITEM_HEIGHT = 50;
const HEADER_HEIGHT = 110; // Height of header + search bar

export default function CategoriesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { 
    categories, 
    isLoading: isLoadingCategories, 
    error: errorCategories, 
    fetchAllCategories 
  } = useAllCategoryStore();
  
  const {
    searchQuery,
    searchResults,
    isLoading: isLoadingSearch,
    error: errorSearch,
    setSearchQuery,
    performSearch,
    clearSearchResults,
  } = useSearchStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Memoize categories to prevent unnecessary re-renders
  const memoizedCategories = useMemo(() => categories, [categories]);

  useEffect(() => {
    fetchAllCategories(); // Use dynamic culture ID from language store
  }, [fetchAllCategories]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 1) {
        performSearch(query);
      } else if (query.trim().length === 0) {
        clearSearchResults();
      }
    }, 500),
    [performSearch, clearSearchResults]
  );

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length > 0) {
      clearSearchResults(); 
      router.push({
        pathname: '/products/list',
        params: {
          pageCode: 'Srch',
          searchName: trimmedQuery,
          name: trimmedQuery,
        },
      });
    } else {
      console.log('Empty search submitted');
    }
  };

  const handleSearchResultPress = (item: SearchItem) => {
    setSearchQuery('');
    clearSearchResults();
    Keyboard.dismiss();
    router.push({ pathname: `/product/${item.XCode}`, params: { name: item.XName } });
  };

  const handleCartPress = () => router.push('/cart');

  const handleCategoryPress = (category: Category) => {
    console.log("Navigating to category:", category.CategoryNameEN, "SrNo:", category.SrNo, "HPCType:", category.HPCType);
    router.push({
      pathname: `/products/list`,
      params: { 
        homePageCatSrNo: category.SrNo,
        pageCode: category.HPCType || 'HPC2',
        name: category.CategoryNameEN 
      }
    });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryCardContainer}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.categoryImage}
        resizeMode="contain"
      />
      <Text style={[styles.categoryTitle, { textAlign: 'center' }]}>{item.CategoryNameEN}</Text>
      <Text style={[styles.categorySubtitle, { textAlign: 'center' }]}>{item.CategoryNameAR}</Text>
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity style={[styles.searchResultItem, { flexDirection }]} onPress={() => handleSearchResultPress(item)} activeOpacity={0.7}>
      <FontAwesome name="search" size={16} color={colors.blue} style={[styles.searchResultIcon, isRTL && { marginLeft: 12, marginRight: 0 }]} />
      <Text style={[styles.searchResultText, { textAlign }]}>{item.XName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header with Title and Cart */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('categories')}</Text>
        <TouchableOpacity onPress={handleCartPress} style={styles.cartButton}>
          <FontAwesome name="shopping-cart" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={18} color={colors.blue} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_placeholder')}
            placeholderTextColor={colors.textGray}
            value={searchQuery}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>
      </View>

      {/* Main Content - Categories Grid */}
      {isLoadingCategories ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : errorCategories ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorCategories}</Text>
        </View>
      ) : (
        <FlatList
          data={memoizedCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.SrNo}
          numColumns={2}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.categoryRow}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={8}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: 180, // Approximate item height
            offset: 180 * Math.floor(index / 2),
            index,
          })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('no_categories_found')}</Text>
            </View>
          }
        />
      )}
      
      {/* Search Results Dropdown */}
      {isSearchFocused && (isLoadingSearch || errorSearch || searchResults.length > 0 || searchQuery.trim().length >= 2) && (
        <View style={[styles.searchResultsContainer, { top: HEADER_HEIGHT }]}>
          {isLoadingSearch ? (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator color={colors.blue} size="small" />
              <Text style={styles.searchLoadingText}>{t('searching')}</Text>
            </View>
          ) : errorSearch ? (
            <View style={styles.searchErrorContainer}>
              <Text style={styles.searchErrorText}>{errorSearch}</Text>
            </View>
          ) : searchResults.length === 0 && searchQuery.trim().length >= 2 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>{t('no_products_found_for')} "{searchQuery}"</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.searchResultsList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              {searchResults.map((item) => (
                <TouchableOpacity 
                  key={item.XCode + item.XName}
                  style={styles.searchResultItem} 
                  onPress={() => handleSearchResultPress(item)} 
                  activeOpacity={0.7}
                >
                  <FontAwesome name="search" size={16} color={colors.blue} style={styles.searchResultIcon} />
                  <Text style={styles.searchResultText}>{item.XName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
  },
  cartButton: {
    padding: spacing.xs,
  },
  searchBarContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: 2.5,
    marginRight: 12,
    marginLeft: 10,
    backgroundColor: colors.veryLightGray,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 60,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.veryLightGray,
    borderRadius: 25,
    borderColor: colors.black,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.black,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
  },
  categoryList: {
    flex: 1,
  },
  categoryListContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCardContainer: {
    width: '48%',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    padding: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: 120,
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  categorySubtitle: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textGray,
    fontSize: 14,
  },
  searchResultsContainer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
    maxHeight: 300,
    overflow: 'hidden',
  },
  searchResultsList: {
    width: '100%',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    height: SEARCH_RESULT_ITEM_HEIGHT,
  },
  searchResultIcon: {
    marginRight: spacing.sm,
    width: 16,
  },
  searchResultText: {
    fontSize: 14,
    color: colors.blue,
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  searchLoadingText: {
    marginLeft: spacing.sm,
    color: colors.blue,
  },
  searchErrorContainer: {
    padding: spacing.md,
  },
  searchErrorText: {
    color: colors.red,
    textAlign: 'center',
  },
  noResultsContainer: {
    padding: spacing.md,
  },
  noResultsText: {
    color: colors.textGray,
    textAlign: 'center',
  }
}); 