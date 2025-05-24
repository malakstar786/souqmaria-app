import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { getPromoCodes, PromoCodeItem } from '../utils/api-service';

interface PromoCodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPromoCode: (code: string) => void;
}

export default function PromoCodeModal({
  isVisible,
  onClose,
  onSelectPromoCode,
}: PromoCodeModalProps) {
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      fetchPromoCodes();
    }
  }, [isVisible]);

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎟️ PROMO CODES MODAL - Fetching promo codes...');
      const response = await getPromoCodes('1');
      
      console.log('🎟️ PROMO CODES MODAL - Response:', JSON.stringify(response, null, 2));
      
      if (response.ResponseCode === '2' && response.Data?.row) {
        setPromoCodes(response.Data.row);
        console.log('🎟️ PROMO CODES MODAL - Found', response.Data.row.length, 'promo codes');
      } else {
        setError('No promo codes are available at the moment');
        setPromoCodes([]);
        console.log('🎟️ PROMO CODES MODAL - No promo codes available');
      }
    } catch (err) {
      console.error('🎟️ PROMO CODES MODAL - Error fetching promo codes:', err);
      setError('Failed to load promo codes. Please try again.');
      setPromoCodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCode = (code: string) => {
    console.log('🎟️ PROMO CODES MODAL - Selected code:', code);
    onSelectPromoCode(code);
    onClose();
  };

  const renderPromoCodeItem = ({ item }: { item: PromoCodeItem }) => (
    <TouchableOpacity
      style={styles.promoCodeItem}
      onPress={() => handleSelectCode(item.XCode)}
    >
      <View style={styles.promoCodeContent}>
        <Text style={styles.promoCodeText}>{item.XCode}</Text>
        <Text style={styles.promoCodeDescription}>{item.XName}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={colors.textGray} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Available Promo Codes</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.blue} />
                <Text style={styles.loadingText}>Loading promo codes...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <FontAwesome name="exclamation-circle" size={48} color={colors.textGray} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchPromoCodes}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : promoCodes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="tag" size={48} color={colors.textGray} />
                <Text style={styles.emptyText}>No promo codes available</Text>
                <Text style={styles.emptySubtext}>Check back later for exclusive offers!</Text>
              </View>
            ) : (
              <FlatList
                data={promoCodes}
                renderItem={renderPromoCodeItem}
                keyExtractor={(item) => item.XCode}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textGray,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textGray,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  promoCodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.veryLightGray,
    padding: spacing.lg,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  promoCodeContent: {
    flex: 1,
  },
  promoCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  promoCodeDescription: {
    fontSize: 14,
    color: colors.textGray,
  },
}); 