import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography } from '@theme';
import useAllCategoryStore from '../../store/all-category-store';
import CategoryCard from '../../components/CategoryCard';
import useSearchStore from '../../store/search-store';
import { SearchItem } from '../../utils/api-service';
import { debounce } from 'lodash';

const { width } = Dimensions.get('window');
const SEARCH_RESULT_ITEM_HEIGHT = 50;
const HEADER_HEIGHT = 110; // Height of header + search bar

export default function CategoriesScreen() {
  const router = useRouter();
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

  useEffect(() => {
    fetchAllCategories('1', ''); // CultureId '1' for English, empty UserId
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
      // Clear current suggestions and search query in store before navigating
      clearSearchResults(); 
      // setSearchQuery(''); // Keep the query in the input for the new page, or clear based on UX preference

      router.push({
        pathname: '/products/list',
        params: {
          pageCode: 'Srch',
          searchName: trimmedQuery,
          name: trimmedQuery, // For screen title on products/list
        },
      });
    } else {
      // Optionally handle empty search submission, e.g., show a toast or do nothing
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

  const handleCategoryPress = (category: any) => {
    console.log("Navigating to category:", category.CategoryName, "SrNo:", category.SrNo, "HPCType:", category.HPCType);
    router.push({
      pathname: `/products/list`,
      params: { 
        homePageCatSrNo: category.SrNo,
        pageCode: category.HPCType || 'HPC2', // HPC2 as fallback for homepage category type
        name: category.CategoryName 
      }
    });
  };

  const renderCategoryItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.categoryCardContainer}>
      <CategoryCard
        name={item.CategoryName}
        imageUrl={item.imageUrl}
        onPress={() => handleCategoryPress(item)}
      />
    </View>
  );

  const renderSearchResultItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity style={styles.searchResultItem} onPress={() => handleSearchResultPress(item)} activeOpacity={0.7}>
      <FontAwesome name="search" size={16} color={colors.blue} style={styles.searchResultIcon} />
      <Text style={styles.searchResultText}>{item.XName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header with Title and Cart */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Categories</Text>
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
            placeholder="What are you looking for?"
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
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.SrNo}
          numColumns={2}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories found</Text>
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
              <Text style={styles.searchLoadingText}>Searching...</Text>
            </View>
          ) : errorSearch ? (
            <View style={styles.searchErrorContainer}>
              <Text style={styles.searchErrorText}>{errorSearch}</Text>
            </View>
          ) : searchResults.length === 0 && searchQuery.trim().length >= 2 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found for "{searchQuery}"</Text>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 25,
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
    padding: spacing.md,
  },
  categoryCardContainer: {
    width: width / 2,
    padding: spacing.sm,
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