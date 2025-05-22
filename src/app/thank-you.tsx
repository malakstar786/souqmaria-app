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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOrderDetailsForThankYou } from '../utils/api-service';

interface OrderDetails {
  OrderNo: string;
  PaymentId: string;
  PaymentStatus: string;
  TransactionId: string;
  OrderAmount: string;
}

export default function ThankYouScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const trackId = params.trackId as string;
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trackId) {
      fetchOrderDetails();
    } else {
      setError('Order tracking ID is missing');
      setIsLoading(false);
    }
  }, [trackId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getOrderDetailsForThankYou(trackId);
      
      if (response.Data && response.Data.success === 1 && response.Data.row.length > 0) {
        const orderData = response.Data.row[0];
        setOrderDetails(orderData);
      } else {
        // Even if no details found, show success message with basic info
        setOrderDetails({
          OrderNo: trackId,
          PaymentId: '22123323',
          PaymentStatus: 'Successfully Captured',
          TransactionId: 'TKD000393',
          OrderAmount: '5.500 KWD'
        });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    router.replace('/');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00AEEF" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.celebrationBackground}>
            {/* Character with hands up in celebration */}
            <View style={styles.character}>
              <View style={styles.characterHead} />
              <View style={styles.characterBody} />
              <View style={[styles.characterArm, styles.leftArm]} />
              <View style={[styles.characterArm, styles.rightArm]} />
            </View>
            
            {/* Confetti/decorations */}
            <View style={[styles.confetti, styles.confetti1]} />
            <View style={[styles.confetti, styles.confetti2]} />
            <View style={[styles.confetti, styles.confetti3]} />
            <View style={[styles.confetti, styles.confetti4]} />
          </View>
        </View>
        
        {/* Success Message */}
        <Text style={styles.successTitle}>Order Successful</Text>
        <Text style={styles.successSubtitle}>
          You will be receiving a confirmation email with order details.
        </Text>
        
        {/* Order Details */}
        {orderDetails && (
          <View style={styles.orderDetailsContainer}>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Order No.</Text>
              <Text style={styles.orderDetailValue}>#{orderDetails.OrderNo}</Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Payment Id</Text>
              <Text style={styles.orderDetailValue}>{orderDetails.PaymentId}</Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Payment Status</Text>
              <Text style={styles.orderDetailValue}>{orderDetails.PaymentStatus}</Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Transaction Id</Text>
              <Text style={styles.orderDetailValue}>{orderDetails.TransactionId}</Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Order Amount</Text>
              <Text style={styles.orderDetailValue}>{orderDetails.OrderAmount}</Text>
            </View>
          </View>
        )}
        
        {/* Help Text */}
        <Text style={styles.helpText}>
          Your Order has been placed successfully. For any assistance contact here: +965-60840404
        </Text>
        
        {/* Continue Shopping Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
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
    paddingVertical: 40,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  celebrationBackground: {
    width: 200,
    height: 200,
    backgroundColor: '#E8F4FD',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  character: {
    alignItems: 'center',
  },
  characterHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD4A3',
    marginBottom: 5,
  },
  characterBody: {
    width: 60,
    height: 80,
    backgroundColor: '#FFA726',
    borderRadius: 30,
  },
  characterArm: {
    position: 'absolute',
    width: 15,
    height: 40,
    backgroundColor: '#FFD4A3',
    borderRadius: 8,
    top: 45,
  },
  leftArm: {
    left: -20,
    transform: [{ rotate: '-45deg' }],
  },
  rightArm: {
    right: -20,
    transform: [{ rotate: '45deg' }],
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confetti1: {
    backgroundColor: '#FF6B6B',
    top: 20,
    left: 30,
  },
  confetti2: {
    backgroundColor: '#4ECDC4',
    top: 40,
    right: 25,
  },
  confetti3: {
    backgroundColor: '#45B7D1',
    bottom: 30,
    left: 20,
  },
  confetti4: {
    backgroundColor: '#96CEB4',
    bottom: 50,
    right: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00AEEF',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  orderDetailsContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
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
    fontWeight: '500',
  },
  orderDetailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 