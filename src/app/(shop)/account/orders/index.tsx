import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import useAuthStore from '../../../../store/auth-store';
import useOrderStore from '../../../../store/order-store';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orders, isLoading, error, fetchOrders } = useOrderStore();

  // Fetch orders when the screen loads
  useEffect(() => {
    if (user?.id || user?.UserID) {
      fetchOrders(user.id || user.UserID);
    }
  }, [user]);

  // Handle navigation to order details
  const handleOrderPress = (order) => {
    router.push(`/account/orders/${order.OrderNo}`);
  };

  // Format date to a more readable format (e.g., "Jun 15, 2023")
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? dateString // Return original if parsing fails
      : date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
  };

  // Format currency
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '--';
    return `KD ${parseFloat(price).toFixed(2)}`;
  };

  // Render an individual order card
  const renderOrderItem = ({ item }) => (
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
        <FontAwesome name="chevron-right" size={14} color={colors.gray} />
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
          data={orders}
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
    padding: spacing.medium,
    backgroundColor: colors.lightBlue,
  },
  backButton: {
    padding: spacing.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  placeholder: {
    width: 20, // Same as the back button for alignment
  },
  errorContainer: {
    padding: spacing.medium,
    backgroundColor: '#ffebee',
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    borderRadius: radii.small,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.medium,
    color: colors.gray,
  },
  listContainer: {
    padding: spacing.medium,
    paddingBottom: spacing.large,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.small,
  },
  orderNumber: {
    fontWeight: 'bold',
    color: colors.blue,
    fontSize: 16,
  },
  orderDate: {
    color: colors.gray,
    fontSize: 14,
  },
  orderInfo: {
    marginBottom: spacing.small,
  },
  orderTotal: {
    fontSize: 15,
    marginBottom: 2,
  },
  orderStatus: {
    fontSize: 14,
    color: colors.gray,
  },
  statusText: {
    fontWeight: 'bold',
    color: colors.green,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.small,
    marginTop: spacing.small,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  itemCount: {
    fontSize: 13,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: spacing.medium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray,
  },
  emptySubText: {
    marginTop: spacing.small,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
}); 