import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAuthStore from '../../../../store/auth-store';
import useAddressStore, { Address } from '../../../../store/address-store';
import { useTranslation } from '../../../../utils/translations';
import { useRTL } from '../../../../utils/rtl';
import { FontAwesome } from '@expo/vector-icons';

export default function AddressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const { user } = useAuthStore();
  const { 
    billingAddresses, 
    shippingAddresses, 
    isLoading, 
    error, 
    deleteBillingAddress,
    deleteShippingAddress,
    fetchUserAddresses,
    clearError
  } = useAddressStore();
  
  // Load addresses on mount
  useEffect(() => {
    if (user?.UserID || user?.id) {
      const userId = user.UserID || user.id || '';
      fetchUserAddresses(userId);
    }
    clearError(); // Always clear error on mount/navigation
  }, [user]);
  
  const handleAddAddress = (isShipping: boolean) => {
    if (isShipping) {
      router.push('/account/address/add-shipping');
    } else {
      router.push('/account/address/add-billing');
    }
  };
  
  const handleEditAddress = (address: Address, isShipping: boolean) => {
    // We'll implement this in the next step
    if (isShipping) {
      router.push({
        pathname: '/account/address/edit-shipping',
        params: { id: address.id }
      });
    } else {
      router.push({
        pathname: '/account/address/edit-billing',
        params: { id: address.id }
      });
    }
  };
  
  const handleDeleteAddress = (addressId: number, isShipping: boolean) => {
    Alert.alert(
      t('confirm_delete'),
      t('delete_address_confirmation'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('delete'), 
          style: "destructive",
          onPress: async () => {
            if (!user?.UserID && !user?.id) return;
            
            const userId = user.UserID || user.id || '';
            
            try {
              let success = false;
              if (isShipping) {
                success = await deleteShippingAddress(addressId, userId);
              } else {
                success = await deleteBillingAddress(addressId, userId);
              }
              if (success) {
                clearError();
                Alert.alert(t('success'), t('address_deleted_successfully'));
              }
                          } catch (error) {
                Alert.alert(t('error'), t('failed_to_delete_address'));
              }
          }
        }
      ]
    );
  };
  
  const renderAddressItem = ({ item, isShipping }: { item: Address, isShipping: boolean }) => (
    <View style={styles.addressCard}>
      {item.isDefault && (
        <View style={[styles.defaultBadge, isRTL ? { left: 8, right: 'auto' } : { right: 8, left: 'auto' }]}>
          <Text style={styles.defaultBadgeText}>{t('address_default')}</Text>
        </View>
      )}
      
      <Text style={[styles.addressName, { textAlign }]}>{item.fullName}</Text>
      <Text style={[styles.addressDetail, { textAlign }]}>{item.email}</Text>
      <Text style={[styles.addressDetail, { textAlign }]}>{item.mobile}</Text>
      
      {/* Use address field if present (from API), otherwise construct from parts */}
      {item.address ? (
        <Text style={[styles.addressDetail, { textAlign }]}>{item.address}</Text>
      ) : (
        <Text style={[styles.addressDetail, { textAlign }]}>
          {item.block ? `Block - ${item.block}` : ''} 
          {item.street ? `, Street - ${item.street}` : ''} 
          {item.house ? `, House/Building - ${item.house}` : ''}
          {item.apartment ? `, Apartment No. - ${item.apartment}` : ''}
        </Text>
      )}
      
      {item.address2 && (
        <Text style={[styles.addressDetail, { textAlign }]}>{item.address2}</Text>
      )}
      
      <Text style={[styles.addressDetail, { textAlign }]}>
        {item.cityName}, {item.stateName}, {item.countryName}
      </Text>
      
      <View style={[styles.addressActions, { flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: isRTL ? 'flex-start' : 'flex-end' }]}>
        <TouchableOpacity 
          style={[styles.editButton, { flexDirection, marginRight: isRTL ? 0 : 16, marginLeft: isRTL ? 16 : 0 }]} 
          onPress={() => handleEditAddress(item, isShipping)}
        >
          <Ionicons name="pencil" size={16} color="#8DC63F" />
          <Text style={[styles.editButtonText, { marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }]}>{t('edit')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, { flexDirection }]} 
          onPress={() => handleDeleteAddress(item.id, isShipping)}
        >
          <Ionicons name="trash" size={16} color="#FF0000" />
          <Text style={[styles.deleteButtonText, { marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }]}>{t('delete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Display loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AEEF" />
        <Text style={styles.loadingText}>{t('loading_addresses')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <View style={[styles.headerRow, { flexDirection }]}>
        <TouchableOpacity onPress={() => router.replace('/account')} style={styles.backButton}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('my_addresses')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Error message if loading addresses failed */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                if (user?.UserID || user?.id) {
                  const userId = user.UserID || user.id || '';
                  fetchUserAddresses(userId);
                }
                clearError();
              }}
            >
              <Text style={styles.retryButtonText}>{t('retry')}</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Shipping Addresses FIRST for visibility */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection }]}>
            <Text style={[styles.sectionTitle, { textAlign }]}>{t('shipping_addresses')}</Text>
            <TouchableOpacity 
              style={[styles.addButton, { flexDirection }]}
              onPress={() => handleAddAddress(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={[styles.addButtonText, { marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }]}>{t('add')}</Text>
            </TouchableOpacity>
          </View>
          {shippingAddresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { textAlign: 'center' }]}>{t('no_shipping_addresses')}</Text>
              <TouchableOpacity 
                style={styles.addEmptyButton}
                onPress={() => handleAddAddress(true)}
              >
                <Text style={[styles.addEmptyButtonText, { textAlign: 'center' }]}>{t('add_shipping_address')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            shippingAddresses.map((item) => (
              <React.Fragment key={`shipping-${item.id}`}>
                {renderAddressItem({ item, isShipping: true })}
              </React.Fragment>
            ))
          )}
        </View>
        {/* Billing Addresses SECOND */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection }]}>
            <Text style={[styles.sectionTitle, { textAlign }]}>{t('billing_addresses')}</Text>
            <TouchableOpacity 
              style={[styles.addButton, { flexDirection }]}
              onPress={() => handleAddAddress(false)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={[styles.addButtonText, { marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }]}>{t('add')}</Text>
            </TouchableOpacity>
          </View>
          {billingAddresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { textAlign: 'center' }]}>{t('no_billing_addresses')}</Text>
              <TouchableOpacity 
                style={styles.addEmptyButton}
                onPress={() => handleAddAddress(false)}
              >
                <Text style={[styles.addEmptyButtonText, { textAlign: 'center' }]}>{t('add_billing_address')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            billingAddresses.map((item) => (
              <React.Fragment key={`billing-${item.id}`}>
                {renderAddressItem({ item, isShipping: false })}
              </React.Fragment>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D9F4FF',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00AEEF',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#00AEEF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
  },
  emptyStateText: {
    color: '#D9D9D9',
    fontSize: 16,
    marginBottom: 12,
  },
  addEmptyButton: {
    backgroundColor: '#00AEEF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addEmptyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  defaultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#8DC63F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 2,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  editButtonText: {
    color: '#8DC63F',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF0000',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#00AEEF',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#00AEEF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 