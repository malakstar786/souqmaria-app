import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { useAuthStore } from '../../../../store/auth-store';
import { useAddressStore, BillingAddress, ShippingAddress } from '../../../../store/address-store';

export default function MyAddressesScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const { 
    billingAddresses, 
    shippingAddresses,
    isLoading, 
    error, 
    deleteBillingAddress,
    deleteShippingAddress
  } = useAddressStore();
  
  const [billingAddressList, setBillingAddressList] = useState<BillingAddress[]>([]);
  const [shippingAddressList, setShippingAddressList] = useState<ShippingAddress[]>([]);
  
  // Update state when store changes
  useEffect(() => {
    setBillingAddressList(billingAddresses);
    setShippingAddressList(shippingAddresses);
  }, [billingAddresses, shippingAddresses]);

  // Check if we have addresses
  const hasBillingAddresses = billingAddressList.length > 0;
  const hasShippingAddresses = shippingAddressList.length > 0;

  // Function to navigate to edit billing address screen
  function handleEditBillingAddress(address: BillingAddress) {
    router.push({
      pathname: '/account/address/edit-billing',
      params: { id: address.BillingAddressId }
    });
  }

  // Function to navigate to edit shipping address screen
  function handleEditShippingAddress(address: ShippingAddress) {
    router.push({
      pathname: '/account/address/edit-shipping',
      params: { id: address.ShippingAddressId }
    });
  }

  // Function to handle billing address deletion
  async function handleDeleteBillingAddress(address: BillingAddress) {
    Alert.alert(
      'Delete Billing Address',
      'Are you sure you want to delete this billing address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBillingAddress(address.BillingAddressId);
            if (success) {
              Alert.alert('Success', 'Billing address deleted successfully');
            }
          }
        }
      ]
    );
  }

  // Function to handle shipping address deletion
  async function handleDeleteShippingAddress(address: ShippingAddress) {
    Alert.alert(
      'Delete Shipping Address',
      'Are you sure you want to delete this shipping address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteShippingAddress(address.ShippingAddressId);
            if (success) {
              Alert.alert('Success', 'Shipping address deleted successfully');
            }
          }
        }
      ]
    );
  }

  // Handlers for add address buttons
  function handleAddBilling() {
    router.push('/account/address/add-billing');
  }
  
  function handleAddShipping() {
    router.push('/account/address/add-shipping');
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Address</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centeredContent}>
          <Text style={styles.notLoggedInText}>Please log in to manage your addresses</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.loginButtonText}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {!isLoading && (
          <>
            {/* Billing Addresses */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Billing Addresses</Text>
            </View>
            
            {!hasBillingAddresses && (
              <TouchableOpacity style={styles.addButton} onPress={handleAddBilling}>
                <Text style={styles.addButtonText}>+ Add Billing Address</Text>
              </TouchableOpacity>
            )}
            
            {hasBillingAddresses && (
              <>
                {billingAddressList.map((address) => (
                  <View key={address.BillingAddressId} style={styles.addressCard}>
                    {address.IsDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                    <Text style={styles.addressType}>Billing Address</Text>
                    <Text style={styles.addressName}>{address.FullName}</Text>
                    <Text style={styles.addressDetail}>
                      {address.Block}, {address.Street}, {address.House}
                      {address.Apartment ? `, ${address.Apartment}` : ''}
                    </Text>
                    <Text style={styles.addressDetail}>
                      {address.City}, {address.State}, {address.Country}
                    </Text>
                    <Text style={styles.addressDetail}>
                      {address.Mobile}
                    </Text>
                    <Text style={styles.addressDetail}>
                      {address.Email}
                    </Text>
                    <View style={styles.addressActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => handleEditBillingAddress(address)}
                      >
                        <FontAwesome name="pencil" size={16} color={colors.green} />
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteBillingAddress(address)}
                      >
                        <FontAwesome name="trash" size={16} color={colors.red} />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity style={[styles.addButton, styles.addButtonSmall]} onPress={handleAddBilling}>
                  <Text style={styles.addButtonText}>+ Add Another Billing Address</Text>
                </TouchableOpacity>
              </>
            )}
            
            {/* Shipping Addresses */}
            <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
              <Text style={styles.sectionTitle}>Shipping Addresses</Text>
            </View>
            
            {!hasShippingAddresses && (
              <TouchableOpacity style={styles.addButton} onPress={handleAddShipping}>
                <Text style={styles.addButtonText}>+ Add Shipping Address</Text>
              </TouchableOpacity>
            )}
            
            {hasShippingAddresses && (
              <>
                {shippingAddressList.map((address) => (
                  <View key={address.ShippingAddressId} style={styles.addressCard}>
                    {address.IsDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                    <Text style={styles.addressType}>Shipping Address</Text>
                    <Text style={styles.addressName}>{address.FullName}</Text>
                    <Text style={styles.addressDetail}>
                      {address.Block}, {address.Street}, {address.House}
                      {address.Apartment ? `, ${address.Apartment}` : ''}
                    </Text>
                    <Text style={styles.addressDetail}>
                      {address.City}, {address.State}, {address.Country}
                    </Text>
                    <Text style={styles.addressDetail}>
                      {address.Mobile}
                    </Text>
                    <Text style={styles.addressDetail}>
                      {address.Email}
                    </Text>
                    <View style={styles.addressActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => handleEditShippingAddress(address)}
                      >
                        <FontAwesome name="pencil" size={16} color={colors.green} />
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteShippingAddress(address)}
                      >
                        <FontAwesome name="trash" size={16} color={colors.red} />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity style={[styles.addButton, styles.addButtonSmall]} onPress={handleAddShipping}>
                  <Text style={styles.addButtonText}>+ Add Another Shipping Address</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  addButton: {
    backgroundColor: colors.veryLightGray,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: '100%',
  },
  addButtonSmall: {
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  addButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.lightGray,
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  addressName: {
    fontSize: 16,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  addressDetail: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  editButtonText: {
    color: colors.green,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.red,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.red,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notLoggedInText: {
    fontSize: 16,
    color: colors.black,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 