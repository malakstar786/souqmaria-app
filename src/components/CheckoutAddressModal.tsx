import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '@theme';
import useAuthStore from '../store/auth-store';
import useAddressStore, { Address } from '../store/address-store';

type AddressType = 'billing' | 'shipping';

export interface CheckoutAddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  addressType: AddressType;
  onSelectAddress: (address: Address) => void;
  onAddNew: () => void;
  addresses: Address[];
  selectedAddress: Address | null;
}

const CheckoutAddressModal = ({
  isVisible,
  onClose,
  addressType,
  onSelectAddress,
  onAddNew,
  addresses,
  selectedAddress
}: CheckoutAddressModalProps) => {
  const { user } = useAuthStore();
  const { isLoading, error, fetchUserAddresses } = useAddressStore();

  // Load addresses on mount if none are provided
  useEffect(() => {
    if (isVisible && addresses.length === 0) {
      const userId = user?.UserID || user?.id || '';
      if (userId) {
        console.log(`📍 Loading ${addressType} addresses for user ID:`, userId);
        fetchUserAddresses(userId);
      } else {
        console.log('📍 No user ID available, cannot fetch addresses');
      }
    }
  }, [user, isVisible, addressType, addresses]);

  // Render an address item
  const renderAddressItem = (address: Address, index: number) => (
    <TouchableOpacity
      key={`${addressType}-${address.id}-${index}`}
      style={[
        styles.addressItem,
        selectedAddress?.id === address.id && styles.selectedAddressItem
      ]}
      onPress={() => onSelectAddress(address)}
    >
      {address.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
      
      <Text style={styles.addressName}>{address.fullName}</Text>
      <Text style={styles.addressDetail}>{address.mobile}</Text>
      <Text style={styles.addressDetail}>
        {address.block}, {address.street}, {address.house}
        {address.apartment ? `, ${address.apartment}` : ''}
      </Text>
      <Text style={styles.addressDetail}>
        {address.cityName}, {address.stateName}, {address.countryName}
      </Text>
      
      <View style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select</Text>
        <FontAwesome name="check-circle" size={16} color={colors.green} />
      </View>
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="arrow-left" size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {addressType === 'billing' ? 'Select Billing Address' : 'Select Shipping Address'}
            </Text>
            <View style={styles.rightPlaceholder} />
          </View>

          {/* Add New Address Button */}
          <TouchableOpacity 
            style={styles.addNewButton}
            onPress={onAddNew}
          >
            <FontAwesome name="plus" size={14} color={colors.white} />
            <Text style={styles.addNewButtonText}>
              Add New {addressType === 'billing' ? 'Billing' : 'Shipping'} Address
            </Text>
          </TouchableOpacity>

          {/* Address List */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue} />
              <Text style={styles.loadingText}>Loading addresses...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  const userId = user?.UserID || user?.id || '';
                  if (userId) {
                    console.log(`📍 Retrying ${addressType} address load for user ID:`, userId);
                    fetchUserAddresses(userId);
                  } else {
                    console.log('📍 No user ID available for retry, cannot fetch addresses');
                    Alert.alert('Error', 'Your user profile information could not be found. Please login again.');
                  }
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {addressType === 'billing' ? 'billing' : 'shipping'} addresses found
              </Text>
              <TouchableOpacity 
                style={styles.addEmptyButton}
                onPress={onAddNew}
              >
                <Text style={styles.addEmptyButtonText}>
                  Add New Address
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.addressList}>
              {addresses.map((address, index) => renderAddressItem(address, index))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: colors.lightBlue,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  rightPlaceholder: {
    width: 36,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  addNewButtonText: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  addressList: {
    flex: 1,
    padding: 16,
  },
  addressItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  addressDetail: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 4,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(141, 198, 63, 0.1)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  selectButtonText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textGray,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.red,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textGray,
    marginBottom: 16,
    textAlign: 'center',
  },
  addEmptyButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addEmptyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedAddressItem: {
    backgroundColor: 'rgba(141, 198, 63, 0.1)',
  },
});

export default CheckoutAddressModal; 