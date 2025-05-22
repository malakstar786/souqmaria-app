import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import usePromoStore from '../store/promo-store';

const colors = {
  white: '#FFFFFF',
  lightBlue: '#E6F0FA',
  blue: '#0063B1',
  black: '#000000',
  lightGray: '#E0E0E0',
  gray: '#888888',
};

interface PromoCodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPromoCode: (code: string) => void;
}

const PromoCodeModal = ({ isVisible, onClose, onSelectPromoCode }: PromoCodeModalProps) => {
  const { promoCodes, fetchPromoCodes, isFetchingCodes } = usePromoStore();
  
  useEffect(() => {
    if (isVisible) {
      fetchPromoCodes();
    }
  }, [isVisible, fetchPromoCodes]);

  const handleSelectPromoCode = (code: string) => {
    onSelectPromoCode(code);
    onClose();
  };

  const renderPromoItem = ({ item }: { item: { XCode: string; XName: string } }) => (
    <TouchableOpacity
      style={styles.promoItem}
      onPress={() => handleSelectPromoCode(item.XCode)}
    >
      <View style={styles.promoContent}>
        <Text style={styles.promoCode}>{item.XCode}</Text>
        <Text style={styles.promoName}>{item.XName}</Text>
      </View>
      <FontAwesome name="arrow-right" size={18} color={colors.blue} />
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="close" size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.title}>Available Promo Codes</Text>
            <View style={{ width: 20 }} />
          </View>

          {isFetchingCodes ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue} />
              <Text style={styles.loadingText}>Loading promo codes...</Text>
            </View>
          ) : promoCodes.length > 0 ? (
            <FlatList
              data={promoCodes}
              renderItem={renderPromoItem}
              keyExtractor={(item) => item.XCode}
              contentContainerStyle={styles.promoList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No promo codes available at this time</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  closeButton: {
    padding: 8,
  },
  promoList: {
    paddingVertical: 8,
  },
  promoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  promoContent: {
    flex: 1,
  },
  promoCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: 4,
  },
  promoName: {
    fontSize: 14,
    color: colors.gray,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
  },
});

export default PromoCodeModal; 