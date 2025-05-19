import React, { useEffect } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import CategoryCard from '../../components/CategoryCard';
import useCategoryStore from '../../store/category-store';
import useAuthStore from '../../store/auth-store';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  const { user } = useAuthStore();

  // Fetch categories when component mounts or user changes
  useEffect(() => {
    const userIdToFetch = user?.UserID || user?.id || '';
    fetchCategories('1', String(userIdToFetch));
  }, [user]);

  // Handle search press
  const handleSearchPress = () => {
    router.push('/search');
  };

  // Handle cart press
  const handleCartPress = () => {
    router.push('/cart');
  };

  const handleCategoryPress = (categoryCode: string) => {
    console.log("Category pressed, code:", categoryCode);
  };

  // Placeholder for featured banner items
  const featuredItems = [
    {
      id: '1',
      title: 'WIRED AND WIRELESS',
      subtitle: 'HEADPHONES & SPEAKERS',
      buttonText: 'SHOP NOW',
      imageComponent: () => (
        <View style={styles.bannerIconContainer}>
          <FontAwesome name="headphones" size={60} color={colors.blue} />
        </View>
      ),
      color: colors.lightBlue,
      textColor: colors.black,
    },
    {
      id: '2',
      title: 'TABLET',
      subtitle: 'APPLE iPADS',
      buttonText: 'SHOP NOW',
      imageComponent: () => (
        <View style={styles.bannerIconContainer}>
          <FontAwesome name="tablet" size={60} color={colors.blue} />
        </View>
      ),
      color: colors.veryLightGray,
      textColor: colors.black,
    },
  ];

  // Render banner item
  const renderBannerItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.bannerItem,
        { backgroundColor: item.color },
      ]}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerTextContainer}>
          <Text style={[styles.bannerTitle, { color: item.textColor }]}>
            {item.title}
          </Text>
          <Text style={[styles.bannerSubtitle, { color: item.textColor }]}>
            {item.subtitle}
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.push('/categories')}
          >
            <Text style={styles.shopNowButtonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
        {item.imageComponent()}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBlue} />
      
      {/* Header with logo and cart */}
      <View style={styles.header}>
        <Image 
          source={require('@assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <FontAwesome name="shopping-cart" size={24} color={colors.black} />
          {/* Cart badge would go here */}
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchBarContainer}
        onPress={handleSearchPress}
        activeOpacity={0.8}
      >
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color={colors.blue} style={styles.searchIcon} />
          <Text style={styles.searchText}>Search Products</Text>
        </View>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Shop By Category Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shop By Category</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.blue} style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : categories.length > 0 ? (
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesListContainer}
            >
              {categories.map((category) => (
                <CategoryCard 
                  key={category.SrNo}
                  name={category.CategoryName}
                  imageUrl={category.imageUrl}
                  onPress={() => handleCategoryPress(category.SrNo)}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No categories found.</Text>
          )}
        </View>

        {/* Featured Banners Carousel */}
        <View style={styles.sectionContainer}>
          <FlatList
            data={featuredItems}
            renderItem={renderBannerItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={styles.bannersContainer}
          />
          
          {/* Carousel indicators */}
          <View style={styles.indicators}>
            {featuredItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: index === 0 ? colors.blue : colors.lightGray },
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Spacer at the bottom if needed */}
        <View style={{ height: spacing.lg }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.lightBlue,
  },
  logo: {
    height: 40,
    width: 120,
  },
  cartButton: {
    padding: spacing.xs,
  },
  searchBarContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: radii.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchText: {
    color: colors.textGray,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: spacing.lg,
  },
  sectionContainer: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  categoriesListContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  bannersContainer: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg - spacing.md,
  },
  bannerItem: {
    width: 300,
    height: 180,
    borderRadius: radii.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: spacing.sm,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  bannerIconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopNowButton: {
    backgroundColor: colors.green,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  shopNowButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loader: {
    marginVertical: spacing.lg,
    alignSelf: 'center',
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  noDataText: {
    color: colors.textGray,
    textAlign: 'center',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
}); 