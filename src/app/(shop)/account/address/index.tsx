import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAuthStore from '../../../../store/auth-store';
import useAddressStore, { Address } from '../../../../store/address-store';

export default function AddressScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    billingAddresses, 
    shippingAddresses, 
    isLoading, 
    error, 
    deleteBillingAddress,
    deleteShippingAddress,
    fetchUserAddresses
  } = useAddressStore();
  
  // Load addresses on mount
  useEffect(() => {
    if (user?.UserID || user?.id) {
      const userId = user.UserID || user.id || '';
      fetchUserAddresses(userId);
    }
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
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            if (!user?.UserID && !user?.id) return;
            
            const userId = user.UserID || user.id || '';
            
            try {
              if (isShipping) {
                await deleteShippingAddress(addressId, userId);
                // The address store is already refreshing the list after deletion
                // so we don't need to show a success alert or manually refresh
              } else {
                await deleteBillingAddress(addressId, userId);
                // Same here, the store handles the refresh
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const renderAddressItem = ({ item, isShipping }: { item: Address, isShipping: boolean }) => (
    <View style={styles.addressCard}>
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
      
      <Text style={styles.addressName}>{item.fullName}</Text>
      <Text style={styles.addressDetail}>{item.email}</Text>
      <Text style={styles.addressDetail}>{item.mobile}</Text>
      <Text style={styles.addressDetail}>
        {item.block}, {item.street}, {item.house}
        {item.apartment ? `, ${item.apartment}` : ''}
      </Text>
      <Text style={styles.addressDetail}>
        {item.cityName}, {item.stateName}, {item.countryName}
      </Text>
      
      <View style={styles.addressActions}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => handleEditAddress(item, isShipping)}
        >
          <Ionicons name="pencil" size={16} color="#8DC63F" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteAddress(item.id, isShipping)}
        >
          <Ionicons name="trash" size={16} color="#FF0000" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Display loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AEEF" />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace('/account')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#00AEEF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 28 }} />
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
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Shipping Addresses FIRST for visibility */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Addresses</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddAddress(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {shippingAddresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No shipping addresses found</Text>
              <TouchableOpacity 
                style={styles.addEmptyButton}
                onPress={() => handleAddAddress(true)}
              >
                <Text style={styles.addEmptyButtonText}>Add Shipping Address</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Billing Addresses</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddAddress(false)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {billingAddresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No billing addresses found</Text>
              <TouchableOpacity 
                style={styles.addEmptyButton}
                onPress={() => handleAddAddress(false)}
              >
                <Text style={styles.addEmptyButtonText}>Add Billing Address</Text>
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
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
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