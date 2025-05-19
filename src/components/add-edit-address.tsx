import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AddressDropdown from './AddressDropdown';
import useLocationStore from '../store/location-store';
import useAuthStore from '../store/auth-store';

interface AddressFormProps {
  isShipping?: boolean;
  addressId?: number;
  onSave: (addressData: any) => void;
  onCancel: () => void;
}

const AddEditAddress: React.FC<AddressFormProps> = ({
  isShipping = false,
  addressId = 0,
  onSave,
  onCancel
}) => {
  const { user } = useAuthStore();
  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    isLoading,
    error,
    fetchCountries,
    selectCountry,
    selectState,
    selectCity,
    resetAll
  } = useLocationStore();

  const [addressData, setAddressData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    block: '',
    street: '',
    house: '',
    apartment: '',
    address2: '',
    isDefault: false
  });

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();

    // Cleanup on unmount
    return () => {
      resetAll();
    };
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!selectedCountry || !selectedState || !selectedCity) {
      return; // Display error message?
    }

    const addressPayload = {
      [isShipping ? 'ShippingAddressId' : 'BillingAddressId']: addressId,
      FullName: addressData.fullName,
      Email: addressData.email,
      Mobile: addressData.mobile,
      Country: selectedCountry.XCode.toString(),
      State: selectedState.XCode.toString(),
      City: selectedCity.XCode.toString(),
      Block: addressData.block,
      Street: addressData.street,
      House: addressData.house,
      Apartment: addressData.apartment,
      Address2: addressData.address2,
      IsDefault: addressData.isDefault ? 1 : 0,
      Command: addressId === 0 ? 'Save' : 'Update',
      UserId: user?.id?.toString() || '',
      CompanyId: 3044,
      IpAddress: ''
    };

    onSave(addressPayload);
  };

  // Show loading state while fetching countries
  if (countries.length === 0 && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00AEEF" />
        <Text style={styles.loadingText}>Loading address form...</Text>
      </View>
    );
  }

  // Show error state if countries failed to load
  if (countries.length === 0 && error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load location data</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchCountries}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {addressId === 0 ? 'Add New' : 'Edit'} {isShipping ? 'Shipping' : 'Billing'} Address
      </Text>
      
      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={addressData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            placeholder="Enter your full name"
            placeholderTextColor="#D9D9D9"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={addressData.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="Enter your email"
            placeholderTextColor="#D9D9D9"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            value={addressData.mobile}
            onChangeText={(value) => handleChange('mobile', value)}
            placeholder="Enter your mobile number"
            placeholderTextColor="#D9D9D9"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      {/* Address Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address Information</Text>
        
        {/* Country, State, City Dropdowns */}
        <AddressDropdown
          label="Country"
          placeholder="Select Country"
          items={countries}
          selectedItem={selectedCountry}
          onSelect={selectCountry}
          isLoading={isLoading}
        />
        
        <AddressDropdown
          label="State/Region"
          placeholder="Select State/Region"
          items={states}
          selectedItem={selectedState}
          onSelect={selectState}
          isLoading={isLoading}
          disabled={!selectedCountry}
        />
        
        <AddressDropdown
          label="City"
          placeholder="Select City"
          items={cities}
          selectedItem={selectedCity}
          onSelect={selectCity}
          isLoading={isLoading}
          disabled={!selectedState}
        />
        
        {/* Other Address Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Block</Text>
          <TextInput
            style={styles.input}
            value={addressData.block}
            onChangeText={(value) => handleChange('block', value)}
            placeholder="Enter block number/name"
            placeholderTextColor="#D9D9D9"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Street</Text>
          <TextInput
            style={styles.input}
            value={addressData.street}
            onChangeText={(value) => handleChange('street', value)}
            placeholder="Enter street name"
            placeholderTextColor="#D9D9D9"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>House/Building</Text>
          <TextInput
            style={styles.input}
            value={addressData.house}
            onChangeText={(value) => handleChange('house', value)}
            placeholder="Enter house/building number"
            placeholderTextColor="#D9D9D9"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Apartment (Optional)</Text>
          <TextInput
            style={styles.input}
            value={addressData.apartment}
            onChangeText={(value) => handleChange('apartment', value)}
            placeholder="Enter apartment number"
            placeholderTextColor="#D9D9D9"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address Line 2 (Optional)</Text>
          <TextInput
            style={styles.input}
            value={addressData.address2}
            onChangeText={(value) => handleChange('address2', value)}
            placeholder="Enter additional address information"
            placeholderTextColor="#D9D9D9"
          />
        </View>
        
        {/* Default Address Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => handleChange('isDefault', !addressData.isDefault)}
        >
          <View style={[styles.checkbox, addressData.isDefault && styles.checkboxChecked]}>
            {addressData.isDefault && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </TouchableOpacity>
      </View>
      
      {/* Form Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!selectedCountry || !selectedState || !selectedCity) && styles.saveButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!selectedCountry || !selectedState || !selectedCity}
        >
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00AEEF',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000000',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    height: 48,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00AEEF',
    borderColor: '#00AEEF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00AEEF',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#00AEEF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default AddEditAddress; 