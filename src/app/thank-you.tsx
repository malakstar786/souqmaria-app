import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOrderDetailsForThankYou } from '../utils/api-service';
import useCartStore from '../store/cart-store';
import { useTranslation } from '../utils/translations';
import { useRTL } from '../utils/rtl';
import { colors } from '@theme';

const { width } = Dimensions.get('window');

interface OrderDetails {
  TrackId: string;
  PayStatus: string;
  Total: number;
}

export default function ThankYouScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get cart store functions
  const { regenerateUniqueIdAfterOrder } = useCartStore();
  
  const status = params.status as string;
  const trackId = params.trackId as string;
  const errorMessage = params.errorMessage as string;
  
  const isSuccess = status === 'success';
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log('🎉 Thank You Page - Received params:', { status, trackId, errorMessage });
      
      // If this is a successful order, regenerate unique ID for future orders
      if (isSuccess && trackId && trackId !== 'ORDER_SUCCESS') {
        console.log('🎉 Successful order detected - regenerating unique ID for future orders');
        regenerateUniqueIdAfterOrder();
      }
      
      if (trackId && trackId !== 'ORDER_SUCCESS' && trackId !== 'ORDER_FAILED') {
        try {
          console.log('🎉 Attempting to fetch order details for trackId:', trackId);
          const response = await getOrderDetailsForThankYou(trackId);
          
          console.log('🎉 Order details API response:', JSON.stringify(response, null, 2));
          
          if (response.Data && response.Data.success === 1 && response.Data.row && response.Data.row.length > 0) {
            const orderData = response.Data.row[0];
            console.log('🎉 Found order data:', orderData);
            setOrderDetails({
              TrackId: orderData.TrackId || trackId,
              PayStatus: orderData.PayStatus || 'SUCCESS',
              Total: orderData.Total || 0
            });
          } else {
            console.log('🎉 No order data found, using TrackId as fallback');
            // Use TrackId as fallback if API doesn't return details
            setOrderDetails({
              TrackId: trackId,
              PayStatus: 'SUCCESS',
              Total: 0
            });
          }
        } catch (error) {
          console.error('🎉 Error fetching order details:', error);
          console.log('🎉 Using TrackId as fallback due to error');
          // Fallback to using TrackId
          setOrderDetails({
            TrackId: trackId,
            PayStatus: 'SUCCESS',
            Total: 0
          });
        }
      } else {
        console.log('🎉 No valid TrackId provided, using default values');
        // For generated TrackIds or fallback cases
        setOrderDetails({
          TrackId: trackId || '#234567890000',
          PayStatus: 'SUCCESS',
          Total: 0
        });
      }
      setIsLoading(false);
    };
    
    fetchOrderDetails();
  }, [trackId, isSuccess, regenerateUniqueIdAfterOrder]);
  
  const handleContinueShopping = () => {
    // Navigate to home page for both guest and logged-in users
    router.replace('/(shop)');
  };
  
  const handleTryAgain = () => {
    router.back();
  };
  
  if (isLoading && trackId && trackId !== 'ORDER_SUCCESS' && trackId !== 'ORDER_FAILED') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={[styles.loadingText, { textAlign }]}>{t('thank_you_loading_order_details')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.brandName, { textAlign }]}>Marie Glam</Text>
            <Text style={[styles.brandSubtitle, { textAlign }]}>cosmetics</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('@assets/checkout/order_succesful_image.png')} 
              style={styles.successImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={[styles.successTitle, { textAlign }]}>{t('thank_you_order_successful')}</Text>
          <Text style={[styles.successSubtitle, { textAlign }]}>
            {t('order_confirmation_email')}
          </Text>
          
          <View style={styles.orderCard}>
            <View style={[styles.orderDetailRow, { flexDirection }]}>
              <Text style={[styles.orderDetailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('track_id')}
              </Text>
              <Text style={[styles.orderDetailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
                {orderDetails?.TrackId}
              </Text>
            </View>
            
            <View style={[styles.orderDetailRow, { flexDirection }]}>
              <Text style={[styles.orderDetailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('pay_status')}
              </Text>
              <Text style={[styles.orderDetailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
                {t('thank_you_success')}
              </Text>
            </View>
            
            <View style={[styles.orderDetailRow, { flexDirection }]}>
              <Text style={[styles.orderDetailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('total')}
              </Text>
              <Text style={[styles.orderDetailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
                {orderDetails?.Total ? `${orderDetails.Total.toFixed(3)} ${t('currency')}` : `0.000 ${t('currency')}`}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.contactText, { textAlign }]}>
            {t('order_placed_contact')}{' '}
            <Text style={styles.phoneNumber}>+965-98900952</Text>
          </Text>
          
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
            <Text style={[styles.continueButtonText, { textAlign: 'center' }]}>{t('thank_you_continue_shopping')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.brandName, { textAlign }]}>Marie Glam</Text>
          <Text style={[styles.brandSubtitle, { textAlign }]}>cosmetics</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/checkout/order_failed_image.png')} 
            style={styles.failureImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={[styles.failureTitle, { textAlign }]}>{t('order_failed_title')}</Text>
        <Text style={[styles.failureSubtitle, { textAlign }]}>
          {errorMessage || t('order_failed_message')}
        </Text>
        
        <View style={styles.orderCard}>
          <View style={[styles.orderDetailRow, { flexDirection }]}>
            <Text style={[styles.orderDetailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('track_id')}
            </Text>
            <Text style={[styles.orderDetailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
              #23456789000
            </Text>
          </View>
          
          <View style={[styles.orderDetailRow, { flexDirection }]}>
            <Text style={[styles.orderDetailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('pay_status')}
            </Text>
            <Text style={[styles.orderDetailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
              {t('failed')}
            </Text>
          </View>
          
          <View style={[styles.orderDetailRow, { flexDirection }]}>
            <Text style={[styles.orderDetailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('total')}
            </Text>
            <Text style={[styles.orderDetailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
              5.500 {t('currency')}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
          <Text style={[styles.tryAgainButtonText, { textAlign: 'center' }]}>{t('try_again')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textGray,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  brandSubtitle: {
    fontSize: 14,
    color: colors.textGray,
    fontStyle: 'italic',
  },
  imageContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  successImage: {
    width: width * 0.8,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 225,
  },
  failureImage: {
    width: width * 0.8,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 225,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  failureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.red,
    textAlign: 'center',
    marginBottom: 8,
  },
  failureSubtitle: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: colors.veryLightGray,
    borderRadius: 8,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  orderDetailLabel: {
    fontSize: 14,
    color: colors.textGray,
    flex: 1,
  },
  orderDetailValue: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
    flex: 1,
  },
  contactText: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  phoneNumber: {
    color: colors.blue,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: colors.blue,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tryAgainButton: {
    backgroundColor: colors.red,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  tryAgainButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 