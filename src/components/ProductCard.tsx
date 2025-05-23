import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { colors, spacing, radii, typography } from '@theme';
import { ProductDetail } from '../utils/api-service';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width / 2) - (spacing.md * 1.5);

interface ProductCardProps {
  product: ProductDetail;
  onPress: (product: ProductDetail) => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const imageUrl = product.ImageUrl || 'https://via.placeholder.com/150';
  const name = product.ItemName || 'Product Name';
  const oldPrice = product.OldPrice && product.OldPrice > 0 ? `${product.OldPrice.toFixed(3)} KD` : null;
  const newPrice = product.Price && product.Price > 0 ? `${product.Price.toFixed(3)} KD` : 'N/A';

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)} activeOpacity={0.85} accessibilityRole="button">
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" accessibilityLabel={name} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
        {oldPrice && <Text style={styles.oldPrice}>{oldPrice}</Text>}
        <Text style={styles.newPrice}>{newPrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
  oldPrice: {
    fontSize: 12,
    color: colors.textGray,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
  },
});

export default ProductCard; 