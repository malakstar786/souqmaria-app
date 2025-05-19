import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import useAuthStore from '../../../../store/auth-store';
import useOrderStore from '../../../../store/order-store';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const orderNo = slug as string;
  
  const { user } = useAuthStore();
  const { orderDetails, isLoadingDetails, errorDetails, fetchOrderDetails } = useOrderStore();

  // Fetch order details when the screen loads
  useEffect(() => {
    if ((user?.id || user?.UserID) && orderNo) {
      fetchOrderDetails(user.id || user.UserID as string, orderNo);
    }
  }, [user, orderNo]);

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
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
  const formatPrice = (price: number): string => {
    if (price === undefined || price === null) return '--';
    return `KD ${parseFloat(price.toString()).toFixed(2)}`;
  };

  // Extract order summary information from the first item (all items have the same order info)
  const orderSummary = orderDetails.length > 0 ? orderDetails[0] : null;

  // Render an individual order item
  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        {item.ImageURL ? (
          <Image 
            source={{ uri: item.ImageURL }} 
            style={styles.itemImage} 
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="image" size={40} color={colors.lightGray} />
          </View>
        )}
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.ProductName}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.Quantity}</Text>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>{formatPrice(item.UnitPrice)}</Text>
          {item.Discount > 0 && (
            <Text style={styles.itemDiscount}>-{formatPrice(item.Discount)}</Text>
          )}
        </View>
        <Text style={styles.itemTotal}>Subtotal: {formatPrice(item.TotalAmount)}</Text>
      </View>
    </View>
  );

  // Render empty state when no order details found
  const renderEmptyOrderDetails = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="exclamation-circle" size={64} color={colors.lightGray} />
      <Text style={styles.emptyText}>No order details found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error message */}
      {errorDetails && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorDetails}</Text>
        </View>
      )}

      {/* Loading indicator */}
      {isLoadingDetails ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      ) : (
        <FlatList
          data={orderDetails}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.ProductID || item.OrderID || ''}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyOrderDetails}
          ListHeaderComponent={orderSummary ? (
            <View style={styles.orderSummary}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>Order #{orderNo}</Text>
                <Text style={styles.orderDate}>
                  {formatDate(orderSummary.OrderDate)}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Order Items</Text>
            </View>
          ) : null}
          ListFooterComponent={orderSummary ? (
            <View style={styles.orderFooter}>
              <View style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Order Status:</Text>
                <Text style={[styles.summaryValue, styles.statusText]}>
                  {orderSummary.Status || 'Processing'}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(orderSummary.SubTotal || 0)}
                </Text>
              </View>
              
              {orderSummary.Discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount:</Text>
                  <Text style={[styles.summaryValue, styles.discountText]}>
                    -{formatPrice(orderSummary.Discount)}
                  </Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Fee:</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(orderSummary.ShippingFee || 0)}
                </Text>
              </View>
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(orderSummary.TotalAmount)}
                </Text>
              </View>
            </View>
          ) : null}
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
    padding: spacing.md,
    backgroundColor: colors.lightBlue,
  },
  backButton: {
    padding: spacing.sm,
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
    padding: spacing.md,
    backgroundColor: '#ffebee',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radii.sm,
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
    marginTop: spacing.md,
    color: colors.textGray,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  orderSummary: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textGray,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.black,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: spacing.xs,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  itemDiscount: {
    fontSize: 14,
    color: colors.red,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderFooter: {
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textGray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusText: {
    color: colors.green,
    fontWeight: 'bold',
  },
  discountText: {
    color: colors.red,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
  },
  emptyContainer: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
  },
}); 