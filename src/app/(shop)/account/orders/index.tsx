import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@theme';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../../store/auth-store';
import useOrderStore from '../../../../store/order-store';
import useLanguageStore from '../../../../store/language-store';
import { useTranslation } from '../../../../utils/translations';
import { useRTL } from '../../../../utils/rtl';

// Define the Order interface based on the actual API response
interface Order {
  OrderId: string;        // Order tracking ID (e.g., "TR00001859")
  OrderOn: string;        // Order date (e.g., "26/05/2025")
  OrderTotal: number;     // Total order amount (e.g., 1.300)
}

export default function OrdersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { user, isLoggedIn } = useAuthStore();
  const { 
    orders, 
    isLoading, 
    error, 
    fetchOrders, 
    searchOrders, 
    clearSearch 
  } = useOrderStore();
  const { currentLanguage } = useLanguageStore();
  
  // Local state for search functionality
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Check if user is logged in - if not, show login prompt
  if (!isLoggedIn || !user) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { flexDirection }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('my_orders_title')}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Login prompt */}
        <View style={styles.loginPromptContainer}>
          <FontAwesome name="user-circle" size={64} color={colors.lightGray} />
          <Text style={[styles.loginPromptTitle, { textAlign }]}>{t('please_log_in')}</Text>
          <Text style={[styles.loginPromptText, { textAlign }]}>
            {t('login_to_view_orders')}
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.loginButtonText}>{t('log_in_sign_up')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Fetch orders when the screen loads
  useEffect(() => {
    console.log('📋 Orders Screen - useEffect triggered');
    console.log('📋 Orders Screen - Full user object:', JSON.stringify(user, null, 2));
    
    const userId = user?.id || user?.UserID;
    console.log('📋 Orders Screen - Final userId to use:', userId);
    
    if (userId) {
      console.log('📋 Orders Screen - Calling fetchOrders with userId:', userId);
      fetchOrders(userId);
    } else {
      console.log('📋 Orders Screen - No userId found, not calling fetchOrders');
    }
  }, [user, fetchOrders]);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    const userId = user?.id || user?.UserID;
    
    if (!userId) return;
    
    if (query.trim() === '') {
      // If search is cleared, fetch all orders
      clearSearch();
      fetchOrders(userId);
    } else {
      // Search for specific order
      searchOrders(userId, query.trim());
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setLocalSearchQuery('');
    const userId = user?.id || user?.UserID;
    if (userId) {
      clearSearch();
      fetchOrders(userId);
    }
  };

  // Handle navigation to order details
  const handleOrderPress = (order: Order) => {
    router.push(`/account/orders/${order.OrderId}`);
  };

  // Format date to a more readable format (e.g., "Jun 15, 2023")
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown Date';
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? dateString 
      : date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
  };

  // Format currency consistently with KWD
  const formatPrice = (price: number | string | undefined | null): string => {
    if (price === undefined || price === null) return '0.000 KWD';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '0.000 KWD';
    return `${numericPrice.toFixed(3)} KWD`;
  };

  // Render an individual order card
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={[styles.orderCard, currentLanguage.isRTL && styles.orderCardRTL]} 
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.orderHeader, currentLanguage.isRTL && styles.orderHeaderRTL]}>
        <Text style={[styles.orderNumber, currentLanguage.isRTL && styles.textRTL]}>
          {t('order_number')}{item.OrderId}
        </Text>
        <Text style={[styles.orderDate, currentLanguage.isRTL && styles.textRTL]}>
          {formatDate(item.OrderOn)}
        </Text>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={[styles.orderTotal, currentLanguage.isRTL && styles.textRTL]}>
          {t('total_amount')}: {formatPrice(item.OrderTotal)}
        </Text>
      </View>
      
      <View style={[styles.orderFooter, currentLanguage.isRTL && styles.orderFooterRTL]}>
        <Text style={[styles.itemCount, currentLanguage.isRTL && styles.textRTL]}>
          {t('view_details')}
        </Text>
        <FontAwesome 
          name={currentLanguage.isRTL ? "chevron-left" : "chevron-right"} 
          size={14} 
          color={colors.textGray} 
        />
      </View>
    </TouchableOpacity>
  );

  // Render empty state when no orders found
  const renderEmptyOrders = () => {
    const isSearchActive = localSearchQuery.trim() !== '';
    
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="shopping-bag" size={64} color={colors.lightGray} />
        <Text style={[styles.emptyText, currentLanguage.isRTL && styles.textRTL]}>
          {isSearchActive ? t('no_orders_match_search') : t('no_orders_found')}
        </Text>
        <Text style={[styles.emptySubText, currentLanguage.isRTL && styles.textRTL]}>
          {isSearchActive ? t('try_different_search') : t('order_history_appears_here')}
        </Text>
        {isSearchActive && (
          <TouchableOpacity style={styles.clearSearchButton} onPress={handleClearSearch}>
            <Text style={styles.clearSearchText}>{t('orders_clear_search')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('my_orders_title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome 
            name="search" 
            size={16} 
            color={colors.textGray} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[styles.searchInput, { textAlign }]}
            placeholder={t('search_orders')}
            value={localSearchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.textGray}
          />
          {localSearchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <FontAwesome name="times" size={16} color={colors.textGray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { textAlign }]}>{error}</Text>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={[styles.loadingText, { textAlign }]}>{t('loading_orders')}</Text>
        </View>
      )}

      {/* Orders list or empty state */}
      {!isLoading && (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => `${item.OrderId}-${Date.now()}`}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyOrders}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: '#ffebee',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radii.md,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    fontSize: typography.body.fontSize,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textGray,
    fontSize: typography.body.fontSize,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontWeight: 'bold',
    color: colors.blue,
    fontSize: 16,
  },
  orderDate: {
    color: colors.textGray,
    fontSize: 14,
  },
  orderInfo: {
    marginBottom: spacing.sm,
  },
  orderTotal: {
    fontSize: 15,
    marginBottom: 2,
    color: colors.text,
  },
  orderStatus: {
    fontSize: 14,
    color: colors.textGray,
  },
  statusText: {
    fontWeight: 'bold',
    color: colors.green,
  },
  statusSuccess: {
    color: colors.green,
  },
  statusPending: {
    color: colors.blue,
  },
  statusDefault: {
    color: colors.textGray,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  itemCount: {
    fontSize: 13,
    color: colors.textGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: typography.title.fontSize,
    fontWeight: 'bold',
    color: colors.textGray,
  },
  emptySubText: {
    marginTop: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.textGray,
    textAlign: 'center',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  loginPromptTitle: {
    marginTop: spacing.md,
    fontSize: typography.title.fontSize,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  loginPromptText: {
    marginTop: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  loginButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: typography.body.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Search styles
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  
  // RTL styles
  textRTL: {
    textAlign: 'right',
  },
  orderCardRTL: {
    // RTL specific card styles if needed
  },
  orderHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  orderFooterRTL: {
    flexDirection: 'row-reverse',
  },
  
  // Clear search button
  clearSearchButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.blue,
    borderRadius: radii.sm,
  },
  clearSearchText: {
    color: colors.white,
    fontSize: typography.body.fontSize,
    textAlign: 'center',
  },
}); 