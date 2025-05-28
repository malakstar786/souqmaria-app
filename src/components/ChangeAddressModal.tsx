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
import { Address } from '../utils/api-service';
import { useTranslation } from '../utils/translations';
import { useRTL } from '../utils/rtl';

const colors = {
  white: '#FFFFFF',
  lightBlue: '#E6F0FA',
  blue: '#0063B1',
  black: '#000000',
  lightGray: '#E0E0E0',
  gray: '#888888',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface ChangeAddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  addresses: Address[];
  selectedAddressId?: number;
  addressType: 'billing' | 'shipping';
  isLoading?: boolean;
}

const ChangeAddressModal = ({
  isVisible,
  onClose,
  onSelectAddress,
  addresses,
  selectedAddressId,
  addressType,
  isLoading = false,
}: ChangeAddressModalProps) => {
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  const formatAddress = (address: Address) => {
    return (
      <View>
        <Text style={[styles.addressName, { textAlign }]}>{address.FullName}</Text>
        <Text style={[styles.addressDetails, { textAlign }]}>{address.Mobile}</Text>
        <Text style={[styles.addressDetails, { textAlign }]}>
          {address.Block}, {address.Street}, {address.House}
          {address.Apartment ? `, ${address.Apartment}` : ''}
        </Text>
        <Text style={[styles.addressDetails, { textAlign }]}>
          {address.City}, {address.State}, {address.Country}
        </Text>
      </View>
    );
  };

  const renderAddressItem = ({ item }: { item: Address }) => {
    const isSelected = 
      addressType === 'billing' ? 
        item.BillingAddressId === selectedAddressId : 
        item.ShippingAddressId === selectedAddressId;
        
    return (
      <TouchableOpacity
        style={[
          styles.addressItem,
          isSelected && styles.selectedAddressItem
        ]}
        onPress={() => handleSelectAddress(item)}
      >
        {formatAddress(item)}
        {isSelected && (
          <FontAwesome 
            name="check" 
            size={18} 
            color={colors.blue} 
            style={[
              styles.checkIcon, 
              { 
                right: isRTL ? undefined : 16, 
                left: isRTL ? 16 : undefined 
              }
            ]} 
          />
        )}
      </TouchableOpacity>
    );
  };

  const getModalTitle = () => {
    if (addressType === 'billing') {
      return t('change_address'); // Generic change address
    } else {
      return t('change_address'); // Generic change address
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={[styles.header, { flexDirection }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={[styles.title, { textAlign: 'center', flex: 1 }]}>{getModalTitle()}</Text>
            <View style={{ width: 20 }} />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue} />
              <Text style={[styles.loadingText, { textAlign }]}>{t('loading_addresses')}</Text>
            </View>
          ) : addresses.length > 0 ? (
            <FlatList
              data={addresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => 
                addressType === 'billing' ? 
                  `billing-${item.BillingAddressId}` : 
                  `shipping-${item.ShippingAddressId}`
              }
              contentContainerStyle={styles.addressList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { textAlign }]}>{t('no_addresses_found')}</Text>
              <TouchableOpacity style={styles.addButton} onPress={onClose}>
                <Text style={[styles.addButtonText, { textAlign }]}>+ {t('add_address')}</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={onClose}
          >
            <Text style={[styles.saveButtonText, { textAlign }]}>{t('save')}</Text>
          </TouchableOpacity>
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
  addressList: {
    paddingVertical: 8,
  },
  addressItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    position: 'relative',
  },
  selectedAddressItem: {
    backgroundColor: colors.lightBlue,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  checkIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    marginBottom: 16,
  },
  addButton: {
    padding: 12,
    backgroundColor: colors.lightBlue,
    borderRadius: 4,
  },
  addButtonText: {
    color: colors.blue,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.blue,
    padding: 12,
    alignItems: 'center',
    margin: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangeAddressModal; 