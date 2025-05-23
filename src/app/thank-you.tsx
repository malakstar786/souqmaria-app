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

const { width } = Dimensions.get('window');

interface OrderDetails {
  TrackId: string;
  PayStatus: string;
  Total: number;
}

export default function ThankYouScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const status = params.status as string;
  const trackId = params.trackId as string;
  const errorMessage = params.errorMessage as string;
  
  const isSuccess = status === 'success';
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log('🎉 Thank You Page - Received params:', { status, trackId, errorMessage });
      
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
  }, [trackId]);
  
  const handleContinueShopping = () => {
    router.push('/(tabs)/home');
  };
  
  const handleTryAgain = () => {
    router.back();
  };
  
  if (isLoading && trackId && trackId !== 'ORDER_SUCCESS' && trackId !== 'ORDER_FAILED') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0063B1" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.brandName}>Marie Glam</Text>
            <Text style={styles.brandSubtitle}>cosmetics</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/order_succesful_image.png')} 
              style={styles.successImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.successTitle}>Order Successful</Text>
          <Text style={styles.successSubtitle}>
            You will be receiving a confirmation email with order details.
          </Text>
          
          <View style={styles.orderCard}>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Track Id</Text>
              <Text style={styles.orderDetailValue}>
                {orderDetails?.TrackId || '#234567890000'}
              </Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Pay Status</Text>
              <Text style={styles.orderDetailValue}>
                {orderDetails?.PayStatus || 'SUCCESS'}
              </Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Total</Text>
              <Text style={styles.orderDetailValue}>
                {orderDetails?.Total ? `${orderDetails.Total.toFixed(3)} KWD` : '0.000 KWD'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.contactText}>
            Your Order has been placed successfully. For any assistance contact here: 
            <Text style={styles.phoneNumber}> +965-60840404</Text>
          </Text>
          
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brandName}>Marie Glam</Text>
          <Text style={styles.brandSubtitle}>cosmetics</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/order_failed_image.png')} 
            style={styles.failureImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.failureTitle}>Oops! Something went wrong.</Text>
        <Text style={styles.failureSubtitle}>
          {errorMessage || 'Your Order was not placed please try again'}
        </Text>
        
        <View style={styles.orderCard}>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Track Id</Text>
            <Text style={styles.orderDetailValue}>#23456789000</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Pay Status</Text>
            <Text style={styles.orderDetailValue}>Failed</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Total</Text>
            <Text style={styles.orderDetailValue}>5.500 KWD</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
          <Text style={styles.tryAgainButtonText}>Try again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#666666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#666666',
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
    color: '#00AEEF',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  failureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 8,
  },
  failureSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  orderDetailLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  orderDetailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  contactText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  phoneNumber: {
    color: '#00AEEF',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tryAgainButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  tryAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 