import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Image, I18nManager } from 'react-native';
import { colors, spacing, radii, typography } from '@theme';
import { ProductDetail } from '../utils/api-service';
import { useTranslation } from '../utils/translations';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width / 2) - (spacing.md * 1.5);

interface ProductCardProps {
  product: ProductDetail & {
    Stock?: number;
    NewArrival?: boolean;
  };
  onPress: (product: ProductDetail) => void;
}

const ProductCard = React.memo(({ product, onPress }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const imageUrl = product.ImageUrl || 'https://via.placeholder.com/150';
  const name = product.ItemName || 'Product Name';
  const isOutOfStock = product.Stock === 0;
  const isNewArrival = product.NewArrival === true;
  
  // Discount logic
  const oldPrice = product.OldPrice || 0;
  const newPrice = product.Price || 0;
  const shouldShowDiscount = oldPrice > 0 && oldPrice > newPrice;
  const discountPercentage = shouldShowDiscount ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)} activeOpacity={0.85} accessibilityRole="button">
      <View style={styles.imageContainer}>
        {isNewArrival && (
          <View style={[styles.newArrivalBadge, isRTL && styles.newArrivalBadgeRTL]}>
            <Text style={styles.newArrivalText}>{t('new_arrival')}</Text>
          </View>
        )}
        {imageUrl && !imageError ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
            resizeMode="contain"
            accessibilityLabel={name}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
        
        {/* Price container with discount logic */}
        <View style={styles.priceContainer}>
          {shouldShowDiscount && (
            <>
              <Text style={styles.oldPrice}>
                {`${oldPrice.toFixed(3)} KD`}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{`${discountPercentage}% OFF`}</Text>
              </View>
            </>
          )}
          <Text style={styles.newPrice}>
            {newPrice > 0 ? `${newPrice.toFixed(3)} KD` : 'N/A'}
          </Text>
        </View>
        
        {isOutOfStock && (
          <Text style={styles.outOfStockText}>{t('out_of_stock')}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '80%',
    height: '80%',
    backgroundColor: colors.borderLight,
    borderRadius: 8,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 2,
    minHeight: 36,
  },
  priceContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  oldPrice: {
    fontSize: 12,
    color: colors.textGray,
    textDecorationLine: 'line-through',
    marginBottom: 6,
  },
  discountBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.md,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
  },
  newArrivalBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  newArrivalBadgeRTL: {
    right: undefined,
    left: spacing.xs,
  },
  newArrivalText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.white,
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.red,
    marginTop: 2,
  },
});

export default ProductCard; 