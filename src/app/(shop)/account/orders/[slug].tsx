import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, I18nManager, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import useAuthStore from '../../../../store/auth-store';
import useOrderStore from '../../../../store/order-store';
import useLanguageStore from '../../../../store/language-store';
import { useTranslation, useRTL } from '../../../../hooks';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const orderNo = Array.isArray(slug) ? slug[0] : slug;
  
  const { user } = useAuthStore();
  const { orderDetails, isLoadingDetails, errorDetails, fetchOrderDetails, orders } = useOrderStore();
  const { currentLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { isRTL, flexDirection, textAlign } = useRTL();

  // Fetch order details when the screen loads
  useEffect(() => {
    if ((user?.id || user?.UserID) && orderNo) {
      fetchOrderDetails(user.id || user.UserID as string, orderNo);
    }
  }, [user, orderNo]);

  // Format currency
  const formatPrice = (price: number): string => {
    if (price === undefined || price === null) return '--';
    return `${parseFloat(price.toString()).toFixed(3)} ${t('order_total')}`;
  };

  // Extract order summary information from the first item (all items have the same order info)
  const orderSummary = orderDetails.length > 0 ? orderDetails[0] : null;
  
  // Get the total amount from the parent order data (from API)
  const parentOrder = orders.find(order => order.OrderId === orderNo);
  const orderTotalFromAPI = parentOrder?.OrderTotal;

  // Get product image URL
  const getProductImageUrl = (imageName: string): string => {
    if (!imageName) return '';
    return `https://erp.merpec.com/Upload/CompanyLogo/3044/${imageName}`;
  };

  // Render an individual order item
  const renderOrderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        {item.ItemImage ? (
          <Image 
            source={{ uri: getProductImageUrl(item.ItemImage) }} 
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
        <Text style={[styles.itemName, { textAlign }]} numberOfLines={2}>{item.ItemName}</Text>
        <Text style={[styles.itemQuantity, { textAlign }]}>{t('qty')}: {item.Quantity}</Text>
        <View style={[styles.itemPriceRow, { flexDirection }]}>
          <Text style={[styles.itemPrice, { textAlign }]}>{formatPrice(item.ProdPrice)}</Text>
        </View>
        <Text style={[styles.itemTotal, { textAlign }]}>{t('subtotal')}: {formatPrice(item.ProdPrice * item.Quantity)}</Text>
      </View>
    </View>
  );

  // Render empty state when no order details found
  const renderEmptyOrderDetails = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="exclamation-circle" size={64} color={colors.lightGray} />
      <Text style={[styles.emptyText, { textAlign }]}>{t('no_order_details_found')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome 
            name={isRTL ? "arrow-right" : "arrow-left"} 
            size={20} 
            color={colors.black} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>{t('order_details_title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error message */}
      {errorDetails && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isRTL && styles.textRTL]}>{errorDetails}</Text>
        </View>
      )}

      {/* Loading indicator */}
      {isLoadingDetails ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={[styles.loadingText, isRTL && styles.textRTL]}>{t('loading_order_details')}</Text>
        </View>
      ) : (
        <FlatList
          data={orderDetails}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.ItemCode || item.OrderId || 'item'}-${index}-${Date.now()}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyOrderDetails}
          ListHeaderComponent={orderSummary ? (
            <View style={styles.orderSummary}>
              <View style={[styles.orderHeader, isRTL && styles.orderHeaderRTL]}>
                <Text style={[styles.orderTitle, isRTL && styles.textRTL]}>{t('order_number')}{orderNo}</Text>
                <Text style={[styles.orderDate, isRTL && styles.textRTL]}>
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>{t('order_items')}</Text>
            </View>
          ) : null}
          ListFooterComponent={orderSummary ? (
            <View style={styles.orderFooter}>
              <View style={styles.divider} />
              
              <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>{t('order_details_summary')}</Text>
              
              <View style={[styles.totalRow, isRTL && styles.totalRowRTL]}>
                <Text style={[styles.totalLabel, isRTL && styles.textRTL]}>{t('total_items')}:</Text>
                <Text style={[styles.totalValue, isRTL && styles.textRTL]}>
                  {orderDetails.length} {orderDetails.length === 1 ? t('item') : t('items')}
                </Text>
              </View>
              
              <View style={[styles.totalRow, isRTL && styles.totalRowRTL]}>
                <Text style={[styles.totalLabel, isRTL && styles.textRTL]}>{t('total_amount')}:</Text>
                <Text style={[styles.totalValue, isRTL && styles.textRTL]}>
                  {orderTotalFromAPI ? formatPrice(orderTotalFromAPI) : formatPrice(orderDetails.reduce((sum, item) => sum + (item.ProdPrice * item.Quantity), 0))}
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
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 56 : 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
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
    width: 40, // Same as the back button for alignment
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
  orderHeaderRTL: {
    flexDirection: 'row-reverse',
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
    fontSize: 20,
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
  totalRowRTL: {
    flexDirection: 'row-reverse',
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
  // RTL text alignment
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
}); 