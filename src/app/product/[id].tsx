import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../../theme';
import {
  getProductDetailsByItemCode,
  getSpecialDescriptionListByItemCode,
  addToCart,
  AddToCartParams,
} from '../../utils/api-service';
import { COMMON_PARAMS, CULTURE_IDS, RESPONSE_CODES } from '../../utils/api-config';
import useAuthStore from '../../store/auth-store';

// Define a proper interface for our product
interface ProductDetail {
  ItemCode: string;
  ItemName: string;
  Description: string;
  Image1: string;
  Image2: string;
  Image3: string;
  ImageUrl1?: string;
  ImageUrl2?: string;
  ImageUrl3?: string;
  ProductBrand: string;
  Barcode: string;
  IsWishListItem: boolean;
  StockQty: number;
  OldPrice: number;
  Discount: number;
  NewPrice: number;
  [key: string]: any;
}

// Interface for special description items
interface SpecialDescription {
  Title: string;
  Description: string;
  [key: string]: any;
}

const PRODUCT_IMAGE_BASE_URL = 'https://erp.merpec.com/Upload/CompanyLogo/3044/';
const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const cultureId = CULTURE_IDS.ENGLISH;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [specialDescriptions, setSpecialDescriptions] = useState<SpecialDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // For the success modal after adding to cart
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError('Product ID is missing');
        setIsLoading(false);
        return;
      }

      console.log('Fetching product details for ID:', id);
      setIsLoading(true);
      setError(null);

      try {
        // Fetch product details
        const detailsResponse = await getProductDetailsByItemCode(
          id,
          COMMON_PARAMS.Location,
          cultureId,
          user?.UserID || user?.id || ''
        );
        
        console.log('Product details API response:', {
          status: detailsResponse.StatusCode,
          responseCode: detailsResponse.ResponseCode,
          success: detailsResponse.Data?.success,
          message: detailsResponse.Data?.Message,
          hasData: detailsResponse.Data?.row && detailsResponse.Data.row.length > 0,
        });
        
        if (detailsResponse.Data?.success === 1 && Array.isArray(detailsResponse.Data.row) && detailsResponse.Data.row.length > 0) {
          const productData = detailsResponse.Data.row[0];
          console.log('Product data fields:', Object.keys(productData));
          
          // Format product data using the correct field names from API response
          const formattedProduct: ProductDetail = {
            ...productData,
            // Make sure all required fields from the ProductDetail interface are present
            ItemCode: productData.ItemCode || id,
            ItemName: productData.ItemName || '',
            Description: productData.Description || '',
            Image1: productData.Image1 || '',
            Image2: productData.Image2 || '',
            Image3: productData.Image3 || '',
            ProductBrand: productData.ProductBrand || '',
            Barcode: productData.Barcode || '',
            IsWishListItem: productData.IsWishListItem || false,
            StockQty: productData.StockQty || 0,
            OldPrice: productData.OldPrice || 0,
            Discount: productData.Discount || 0,
            NewPrice: productData.NewPrice || 0,
            // Add the formatted image URLs
            ImageUrl1: productData.Image1 
              ? `${PRODUCT_IMAGE_BASE_URL}${productData.Image1}` 
              : undefined,
            ImageUrl2: productData.Image2 && productData.Image2 !== 'Default.jpg'
              ? `${PRODUCT_IMAGE_BASE_URL}${productData.Image2}`
              : undefined,
            ImageUrl3: productData.Image3 && productData.Image3 !== 'Default.jpg'
              ? `${PRODUCT_IMAGE_BASE_URL}${productData.Image3}`
              : undefined,
          };
          
          console.log('Formatted product image URLs:', {
            image1: formattedProduct.ImageUrl1,
            image2: formattedProduct.ImageUrl2,
            image3: formattedProduct.ImageUrl3
          });
          
          setProduct(formattedProduct);
          
          // Prepare product images array for the slider
          const images = [];
          if (formattedProduct.ImageUrl1) images.push(formattedProduct.ImageUrl1);
          if (formattedProduct.ImageUrl2) images.push(formattedProduct.ImageUrl2);
          if (formattedProduct.ImageUrl3) images.push(formattedProduct.ImageUrl3);
          setProductImages(images);
          
          // Fetch product special descriptions
          const descriptionResponse = await getSpecialDescriptionListByItemCode(
            id, 
            cultureId,
            user?.UserID || user?.id || ''
          );
          
          console.log('Special Description API response:', {
            status: descriptionResponse.StatusCode,
            responseCode: descriptionResponse.ResponseCode,
            success: descriptionResponse.Data?.success,
            message: descriptionResponse.Data?.Message,
            hasData: descriptionResponse.Data?.row && Array.isArray(descriptionResponse.Data.row) && descriptionResponse.Data.row.length > 0,
          });
          
          if (descriptionResponse.Data?.success === 1 && Array.isArray(descriptionResponse.Data.row) && descriptionResponse.Data.row.length > 0) {
            console.log('Special Description items:', descriptionResponse.Data.row.length);
            console.log('First description item fields:', 
              descriptionResponse.Data.row[0] ? Object.keys(descriptionResponse.Data.row[0]) : 'No fields');
            
            setSpecialDescriptions(descriptionResponse.Data.row);
          } else {
            console.log('No special description data found');
          }
        } else {
          setError('Product not found');
        }
      } catch (e: any) {
        console.error('Error fetching product details:', e);
        setError(e.message || 'An error occurred while loading product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, cultureId, user]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
      const uniqueId = `web-${Date.now()}`;
      const params: AddToCartParams = {
        ItemCode: product.ItemCode,
        NewPrice: product.NewPrice || 0,
        OldPrice: product.OldPrice || 0,
        Discount: product.Discount || 0,
        UserId: user?.UserID || user?.id || '',
        UniqueId: uniqueId,
        IpAddress: '127.0.0.1', // Simplified for mobile app
        Company: COMMON_PARAMS.Company,
        Location: COMMON_PARAMS.Location,
        Qty: quantity
      };

      console.log('Adding to cart with params:', params);
      
      const response = await addToCart(params);
      
      console.log('Add to cart response:', response);
      
      if (response.ResponseCode === RESPONSE_CODES.SUCCESS || 
          response.ResponseCode === RESPONSE_CODES.SUCCESS_ALT ||
          response.ResponseCode === '2' || 
          response.ResponseCode === 2) {
        // Success
        setShowSuccessModal(true);
      } else if (response.ResponseCode === 4 || response.ResponseCode === '4') {
        // Updated quantity
        setShowSuccessModal(true);
      } else if (response.ResponseCode === -4 || response.ResponseCode === '-4') {
        // No stock
        Alert.alert('Stock Unavailable', 'Sorry, this product is currently out of stock.');
      } else {
        // Other error
        Alert.alert('Error', response.Message || 'Failed to add item to cart. Please try again.');
      }
    } catch (e: any) {
      console.error('Error adding to cart:', e);
      Alert.alert('Error', e.message || 'An unexpected error occurred');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, user]);

  const handleBuyNow = () => {
    // Implement buy now functionality (outside scope of this implementation)
    Alert.alert('Buy Now', `Feature not yet implemented. Would purchase ${quantity} of ${product?.ItemName}`);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleViewCart = () => {
    setShowSuccessModal(false);
    router.push('/(shop)/cart');
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
  };

  const renderImageItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={styles.productImage}
      resizeMode="contain"
    />
  );

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const slideWidth = width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / slideWidth);
    
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <FontAwesome name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
          
          <Link href="/(shop)/cart" asChild>
            <TouchableOpacity 
              style={styles.cartButton}
              accessibilityRole="button"
              accessibilityLabel="View cart"
            >
              <FontAwesome name="shopping-cart" size={20} color={colors.black} />
              {/* Can add cart badge here if needed */}
            </TouchableOpacity>
          </Link>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Barcode */}
          {product.Barcode && (
            <Text style={styles.barcode}>BARCODE: {product.Barcode}</Text>
          )}
          
          {/* Product Image Slider */}
          {productImages.length > 0 ? (
            <View style={styles.sliderContainer}>
              <FlatList
                ref={flatListRef}
                data={productImages}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              />
              
              {/* Dots Indicator */}
              {productImages.length > 1 && (
                <View style={styles.dotsContainer}>
                  {productImages.map((_, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.dot, 
                        index === activeImageIndex ? styles.activeDot : {}
                      ]} 
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <FontAwesome name="image" size={50} color={colors.lightGray} />
              <Text style={styles.noImageText}>No image available</Text>
            </View>
          )}
          
          {/* Product Information */}
          <View style={styles.productInfo}>
            {/* Product Brand */}
            {product.ProductBrand && (
              <Text style={styles.productBrand}>{product.ProductBrand}</Text>
            )}
            
            {/* Product Name */}
            <Text style={styles.productName}>{product.ItemName}</Text>
            
            {/* Price Section */}
            <View style={styles.priceContainer}>
              {product.OldPrice > 0 && (
                <Text style={styles.oldPrice}>{product.OldPrice.toFixed(2)} KD</Text>
              )}
              <Text style={styles.price}>{product.NewPrice ? product.NewPrice.toFixed(2) : '0.00'} KD</Text>
            </View>
            
            {/* Stock Information - Only show if out of stock */}
            {product.StockQty <= 0 && (
              <Text style={styles.outOfStock}>Out Of Stock</Text>
            )}
            
            {/* Product Description with Read More */}
            {product.Description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>DESCRIPTION</Text>
                <View>
                  <Text style={styles.descriptionText} numberOfLines={isDescriptionExpanded ? undefined : 2}>
                    {product.Description}
                  </Text>
                  {product.Description.length > 100 && (
                    <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                      <Text style={styles.readMoreText}>
                        {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            
            {/* Special Descriptions Section */}
            {specialDescriptions.length > 0 && (
              <View style={styles.specialDescriptionContainer}>
                {specialDescriptions.map((item, index) => (
                  <View key={index} style={styles.specialDescriptionItem}>
                    <Text style={styles.specialDescriptionTitle}>{item.Title}</Text>
                    <Text style={styles.specialDescriptionText}>{item.Description}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          {/* Bottom Action Section */}
          <View style={styles.bottomActionContainer}>
            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <FontAwesome name="minus" size={16} color={colors.black} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={incrementQuantity}
                disabled={product.StockQty <= quantity}
              >
                <FontAwesome name="plus" size={16} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            {/* Buy Now button */}
            <TouchableOpacity 
              style={styles.buyNowButton}
              onPress={handleBuyNow}
              disabled={product.StockQty <= 0}
            >
              <Text style={styles.buyNowText}>BUY NOW</Text>
            </TouchableOpacity>
          </View>
          
          {/* Add To Cart Button */}
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            disabled={isAddingToCart || product.StockQty <= 0}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>ADD TO CART</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
        
        {/* Add to Cart Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FontAwesome name="check-circle" size={50} color={colors.blue} style={styles.successIcon} />
              
              <Text style={styles.modalProductName}>{product.ItemName}</Text>
              <Text style={styles.modalSuccessText}>Added to your cart successfully.</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleViewCart}>
                  <Text style={styles.modalButtonText}>VIEW CART</Text>
                </TouchableOpacity>
                
                <View style={styles.modalDivider} />
                
                <TouchableOpacity style={styles.modalButton} onPress={handleContinueShopping}>
                  <Text style={styles.modalButtonText}>CHECKOUT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.red,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.blue,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  cartButton: {
    padding: spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  barcode: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: spacing.sm,
    marginLeft: spacing.lg,
  },
  sliderContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: colors.white,
  },
  productImage: {
    width,
    height: width * 0.8,
  },
  noImageContainer: {
    width: width,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  noImageText: {
    marginTop: spacing.sm,
    color: colors.textGray,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.blue,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  productInfo: {
    padding: spacing.lg,
  },
  productBrand: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: spacing.xs,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  oldPrice: {
    fontSize: 16,
    color: colors.textGray,
    textDecorationLine: 'line-through',
    marginRight: spacing.md,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
  },
  outOfStock: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.red,
    marginBottom: spacing.md,
  },
  descriptionContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  readMoreText: {
    color: colors.blue,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  specialDescriptionContainer: {
    marginTop: spacing.lg,
  },
  specialDescriptionItem: {
    marginBottom: spacing.md,
  },
  specialDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  specialDescriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomActionContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginHorizontal: spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: colors.black,
    borderRadius: 8,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: '80%',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: spacing.md,
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSuccessText: {
    fontSize: 14,
    color: colors.green,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  modalDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
}); 