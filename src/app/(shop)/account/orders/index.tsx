import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../../../../theme';
import useAuthStore from '../../../../store/auth-store';
import useOrderStore from '../../../../store/order-store';

// Define the Order interface based on usage in this component
// It can extend or be similar to StoreOrder if that's appropriate
interface Order {
  OrderID?: string;
  OrderNo: string;
  OrderDate: string;
  TotalAmount?: number | string;
  Status?: string;
  ItemCount?: number;
}

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orders, isLoading, error, fetchOrders } = useOrderStore();

  // Fetch orders when the screen loads
  useEffect(() => {
    const userId = user?.id || user?.UserID;
    if (userId) {
      fetchOrders(userId);
    }
  }, [user, fetchOrders]);

  // Handle navigation to order details
  const handleOrderPress = (order: Order) => {
    router.push(`/account/orders/${order.OrderNo}`);
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

  // Format currency
  const formatPrice = (price: number | string | undefined | null): string => {
    if (price === undefined || price === null) return '--';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '--';
    return `KD ${numericPrice.toFixed(2)}`;
  };

  // Render an individual order card
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.OrderNo}</Text>
        <Text style={styles.orderDate}>{formatDate(item.OrderDate)}</Text>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderTotal}>Total: {formatPrice(item.TotalAmount)}</Text>
        <Text style={styles.orderStatus}>
          Status: <Text style={styles.statusText}>{item.Status || 'Processing'}</Text>
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.itemCount}>
          {item.ItemCount || 0} {item.ItemCount === 1 ? 'item' : 'items'}
        </Text>
        <FontAwesome name="chevron-right" size={14} color={colors.textGray} />
      </View>
    </TouchableOpacity>
  );

  // Render empty state when no orders found
  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="shopping-bag" size={64} color={colors.lightGray} />
      <Text style={styles.emptyText}>No orders found</Text>
      <Text style={styles.emptySubText}>Your order history will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Orders list or loading indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders as Order[]}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.OrderID || item.OrderNo || String(Math.random())}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyOrders}
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightBlue,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight as 'bold',
    color: colors.blue,
  },
  placeholder: {
    width: 20 + spacing.sm * 2,
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
}); 