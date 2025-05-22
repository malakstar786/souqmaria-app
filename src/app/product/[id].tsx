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
  Linking,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import HeaderCartIcon from '../../components/HeaderCartIcon';
import { colors, spacing, radii, typography } from '../../theme';
import {
  getProductDetailsByItemCode,
  getSpecialDescriptionListByItemCode,
  getRelatedProductsListByItemCode,
  addToCart,
  AddToCartParams,
} from '../../utils/api-service';
import { COMMON_PARAMS, CULTURE_IDS, RESPONSE_CODES } from '../../utils/api-config';
import useAuthStore from '../../store/auth-store';
import useCartStore from '../../store/cart-store';

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
  const [specialDescriptions, setSpecialDescriptions] = useState<{Data: string}[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
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

  const { uniqueId } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    } else {
      setError('Product ID is missing');
      setIsLoading(false);
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch product details
      const response = await getProductDetailsByItemCode(
        id as string, 
        COMMON_PARAMS.Location,
        '1', // CultureId
        user?.UserID || '' // UserId
      );
      
      // Handle response
      if (response.StatusCode === 200 && response.Data?.success === 1 && response.Data.row?.length > 0) {
        const productData = response.Data.row[0];
        setProduct(productData);
        
        // Get product images
        const images: string[] = [];
        if (productData.ImageUrl1) images.push(productData.ImageUrl1);
        else if (productData.Image1) images.push(`https://erp.merpec.com/Upload/CompanyLogo/3044/${productData.Image1}`);
        
        if (productData.ImageUrl2) images.push(productData.ImageUrl2);
        else if (productData.Image2) images.push(`https://erp.merpec.com/Upload/CompanyLogo/3044/${productData.Image2}`);
        
        if (productData.ImageUrl3) images.push(productData.ImageUrl3);
        else if (productData.Image3) images.push(`https://erp.merpec.com/Upload/CompanyLogo/3044/${productData.Image3}`);
        
        setProductImages(images);
        
        // Fetch special descriptions
        fetchSpecialDescriptions(id as string);
        
        // Fetch related products
        fetchRelatedProducts(id as string);
      } else {
        setError(response.Message || 'Product not found');
      }
    } catch (e: any) {
      console.error('Error fetching product details:', e);
      setError(e.message || 'An error occurred while fetching product details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecialDescriptions = async (itemCode: string) => {
    try {
      const response = await getSpecialDescriptionListByItemCode(
        itemCode,
        '1', // CultureId
        user?.UserID || '' // UserId
      );
      
      if (response.StatusCode === 200 && response.Data?.success === 1 && response.Data.row?.length > 0) {
        setSpecialDescriptions(response.Data.row);
      }
    } catch (error) {
      console.error('Error fetching special descriptions:', error);
    }
  };
  
  const fetchRelatedProducts = async (itemCode: string) => {
    try {
      const response = await getRelatedProductsListByItemCode(
        itemCode,
        '1', // CultureId
        user?.UserID || '' // UserId
      );
      
      if (response.StatusCode === 200 && response.Data?.success === 1 && response.Data.row?.length > 0) {
        setRelatedProducts(response.Data.row);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
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
      
      console.log('Add to cart params:', JSON.stringify(params, null, 2));
      
      const response = await addToCart(params);
      
      console.log('Add to cart response:', JSON.stringify(response, null, 2));
      
      if (response.ResponseCode === RESPONSE_CODES.SUCCESS || 
          response.ResponseCode === RESPONSE_CODES.SUCCESS_ALT ||
          response.ResponseCode === '2' || 
          response.ResponseCode === 2 ||
          response.ResponseCode === 4 || 
          response.ResponseCode === '4') {
        // Success
        await useCartStore.getState().fetchCartItems(user?.UserID || user?.id || '');
        setShowSuccessModal(true);
      } else if (response.ResponseCode === -4 || response.ResponseCode === '-4') {
        // No stock
        Alert.alert('Stock Unavailable', 'Sorry, this product is currently out of stock.');
      } else {
        // Other error
        Alert.alert('Error', response.Message || 'Failed to add product to cart. Please try again.');
      }
    } catch (e: any) {
      console.error('Error adding to cart:', e);
      Alert.alert('Error', e.message || 'An unexpected error occurred');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, user, uniqueId]);

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

  // Handle WhatsApp order
  const handleOrderOnWhatsApp = useCallback(() => {
    Linking.openURL('https://wa.me/+96598900952');
  }, []);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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
          
          <TouchableOpacity 
            style={styles.cartButton}
            accessibilityRole="button"
            accessibilityLabel="View cart"
            onPress={() => router.push('/(shop)/cart')}
          >
            <HeaderCartIcon color={colors.black} />
          </TouchableOpacity>
        </View>
        
        {/* Main Content Scroll View */}
        <View style={styles.contentContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
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
                  <Text style={styles.sectionTitle}>KEY FEATURES</Text>
                  <View style={styles.featuresList}>
                    {specialDescriptions.map((item, index) => (
                      <View key={index} style={styles.featureItem}>
                        <FontAwesome name="check-circle" size={16} color={colors.blue} style={styles.featureIcon} />
                        <Text style={styles.featureText}>{item.Data}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
            
            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <View style={styles.relatedProductsContainer}>
                <Text style={styles.relatedProductsTitle}>RELATED PRODUCTS</Text>
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.relatedProductsScrollContent}
                >
                  {relatedProducts.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.relatedProductItem}
                      onPress={() => {
                        if (item.ItemCode !== id) {
                          router.push(`/product/${item.ItemCode}`);
                        }
                      }}
                    >
                      <Image 
                        source={{ uri: `https://erp.merpec.com/Upload/CompanyLogo/3044/${item.ItemImage}` }}
                        style={styles.relatedProductImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.relatedProductName} numberOfLines={2}>{item.ItemName}</Text>
                      <Text style={styles.relatedProductPrice}>{item.NewPrice.toFixed(2)} KD</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
        
        {/* Fixed Bottom Action Bar */}
        <View style={styles.fixedBottomContainer}>
          {/* Quantity Selector and Add to Cart Section */}
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
            
            {/* Add To Cart Button (partial width) */}
            <TouchableOpacity 
              style={[styles.addToCartButton, styles.inlineButton]}
              onPress={handleAddToCart}
              disabled={isAddingToCart || product.StockQty <= 0}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>ADD TO CART</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Order on WhatsApp Button (full width) */}
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={handleOrderOnWhatsApp}
          >
            <FontAwesome name="whatsapp" size={20} color={colors.white} style={styles.whatsappIcon} />
            <Text style={styles.whatsappButtonText}>ORDER ON WHATSAPP</Text>
          </TouchableOpacity>
        </View>
        
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
                  <Text style={styles.modalButtonText}>CONTINUE SHOPPING</Text>
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
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
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
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  featuresList: {
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomActionContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  addToCartButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineButton: {
    flex: 1,
  },
  whatsappButton: {
    backgroundColor: '#25D366', // WhatsApp green
    borderRadius: 8,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  whatsappIcon: {
    marginRight: spacing.sm,
  },
  whatsappButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
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
  relatedProductsContainer: {
    padding: spacing.lg,
    backgroundColor: colors.veryLightGray,
  },
  relatedProductsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  relatedProductsScrollContent: {
    paddingBottom: spacing.sm,
  },
  relatedProductItem: {
    width: 150,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  relatedProductImage: {
    width: '100%',
    height: 120,
    marginBottom: spacing.sm,
  },
  relatedProductName: {
    fontSize: 14,
    color: colors.black,
    marginBottom: spacing.xs,
    height: 40,
  },
  relatedProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blue,
  },
  fixedBottomContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
}); 