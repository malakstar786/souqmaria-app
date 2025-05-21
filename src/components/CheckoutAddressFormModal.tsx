import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useAuthStore from '../store/auth-store';
import useAddressStore from '../store/address-store';
import useLocationStore from '../store/location-store';

type AddressType = 'billing' | 'shipping';

interface CheckoutAddressFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  addressType: AddressType;
  onSuccess: () => void;
}

const CheckoutAddressFormModal = ({
  isVisible,
  onClose,
  addressType,
  onSuccess
}: CheckoutAddressFormModalProps) => {
  const { user } = useAuthStore();
  const { saveBillingAddress, saveShippingAddress, isLoading: isSavingAddress } = useAddressStore();
  const { 
    countries, 
    states, 
    cities, 
    fetchCountries, 
    fetchStates, 
    fetchCities, 
    isLoading: isLoadingLocations 
  } = useLocationStore();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [block, setBlock] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [address2, setAddress2] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({});
  
  // UI state for ship to different address option (only for billing)
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  
  // UI state for dropdowns
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isVisible) {
      // Reset form fields
      setFullName('');
      setEmail('');
      setMobile('');
      setCountry(null);
      setState(null);
      setCity(null);
      setBlock('');
      setStreet('');
      setHouse('');
      setApartment('');
      setAddress2('');
      setIsDefault(false);
      setFormErrors({});
      setShipToDifferentAddress(false);
      
      // Load countries
      fetchCountries();
    }
  }, [isVisible]);

  // When country changes, fetch states
  useEffect(() => {
    if (country) {
      fetchStates(country.XCode);
    }
  }, [country]);

  // When state changes, fetch cities
  useEffect(() => {
    if (state) {
      fetchCities(state.XCode);
    }
  }, [state]);

  // Form validation
  const validateForm = () => {
    const errors: {[k: string]: string} = {};
    if (!fullName.trim()) errors.fullName = 'Full name required';
    if (!email.trim()) errors.email = 'Email required';
    if (!mobile.trim()) errors.mobile = 'Mobile required';
    if (!country) errors.country = 'Country required';
    if (!state) errors.state = 'State required';
    if (!city) errors.city = 'City required';
    if (!block.trim()) errors.block = 'Block required';
    if (!street.trim()) errors.street = 'Street required';
    if (!house.trim()) errors.house = 'House required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save the address
  const handleSave = async () => {
    if (!validateForm()) return;
    if (!user?.UserID && !user?.id) {
      Alert.alert('Error', 'User information not available. Please login again.');
      return;
    }
    
    try {
      const userId = user.UserID || user.id || '';
      
      if (addressType === 'billing') {
        const payload = {
          BillingAddressId: 0, // 0 for new address
          FullName: fullName.trim(),
          Email: email.trim(),
          Mobile: mobile.trim(),
          Address2: address2.trim(),
          Country: country?.XCode.toString() || '',
          State: state?.XCode.toString() || '',
          City: city?.XCode.toString() || '',
          Block: block.trim(),
          Street: street.trim(),
          House: house.trim(),
          Apartment: apartment.trim(),
          IsDefault: isDefault ? 1 : 0,
          Command: 'Save', // Required parameter as per API docs
          UserId: userId,
          Company: 3044, // Fixed value as per API docs
          IpAddress: '127.0.0.1' // In a real app, get the actual IP
        };
        
        const success = await saveBillingAddress(payload);
        
        if (success) {
          Alert.alert('Success', 'Billing address saved successfully!');
          onSuccess();
          
          if (shipToDifferentAddress) {
            // If user wants to ship to a different address, open the shipping address form
            onClose();
            // The parent component should handle opening the shipping address form
            return;
          }
        } else {
          Alert.alert('Error', 'Failed to save billing address. Please try again.');
        }
      } else {
        // Shipping address
        const payload = {
          ShippingAddressId: 0, // 0 for new address
          FullName: fullName.trim(),
          Email: email.trim(),
          Mobile: mobile.trim(),
          Address2: address2.trim(),
          Country: country?.XCode.toString() || '',
          State: state?.XCode.toString() || '',
          City: city?.XCode.toString() || '',
          Block: block.trim(),
          Street: street.trim(),
          House: house.trim(),
          Apartment: apartment.trim(),
          IsDefault: isDefault ? 1 : 0,
          Command: 'Save', // Required parameter as per API docs
          UserId: userId,
          Company: 3044, // Fixed value as per API docs
          IpAddress: '127.0.0.1' // In a real app, get the actual IP
        };
        
        const success = await saveShippingAddress(payload);
        
        if (success) {
          Alert.alert('Success', 'Shipping address saved successfully!');
          onSuccess();
        } else {
          Alert.alert('Error', 'Failed to save shipping address. Please try again.');
        }
      }
      
      onClose();
    } catch (error) {
      console.error(`Error saving ${addressType} address:`, error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  // Render dropdown option item
  const renderOptionItem = (item: any, selectedItem: any, onItemSelect: (item: any) => void) => (
    <TouchableOpacity
      key={item.XCode}
      style={[
        styles.modalItem,
        selectedItem?.XCode === item.XCode && styles.selectedItem
      ]}
      onPress={() => onItemSelect(item)}
    >
      <Text style={styles.modalItemText}>{item.XName}</Text>
      {selectedItem?.XCode === item.XCode && (
        <FontAwesome name="check" size={16} color="#8DC63F" />
      )}
    </TouchableOpacity>
  );

  // Render dropdown for locations
  const renderDropdownModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    items: any[],
    selectedItem: any,
    onSelect: (item: any) => void
  ) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalList}>
            {isLoadingLocations ? (
              <ActivityIndicator size="large" color="#00AEEF" style={{margin: 20}} />
            ) : items.length === 0 ? (
              <Text style={styles.emptyMessage}>No items available</Text>
            ) : (
              items.map(item => renderOptionItem(item, selectedItem, (item) => {
                onSelect(item);
                onClose();
              }))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {addressType === 'billing' ? 'Add Billing Address' : 'Add Shipping Address'}
            </Text>
            <View style={{width: 40}} />
          </View>

          <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
            <TextInput
              style={[styles.input, formErrors.fullName && styles.inputError]}
              placeholder="Full Name *"
              value={fullName}
              onChangeText={setFullName}
            />
            {formErrors.fullName && <Text style={styles.errorText}>{formErrors.fullName}</Text>}
            
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
            
            <TextInput
              style={[styles.input, formErrors.mobile && styles.inputError]}
              placeholder="Mobile *"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            {formErrors.mobile && <Text style={styles.errorText}>{formErrors.mobile}</Text>}

            {/* Country Dropdown */}
            <TouchableOpacity
              style={[styles.dropdownButton, formErrors.country && styles.inputError]}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={country ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                {country ? country.XName : 'Select Country *'}
              </Text>
              <FontAwesome name="chevron-down" size={12} color="#999" />
            </TouchableOpacity>
            {formErrors.country && <Text style={styles.errorText}>{formErrors.country}</Text>}

            {/* State Dropdown */}
            <TouchableOpacity
              style={[styles.dropdownButton, formErrors.state && styles.inputError]}
              onPress={() => country ? setShowStateModal(true) : Alert.alert('Country Required', 'Please select a country first')}
            >
              <Text style={state ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                {state ? state.XName : 'Select State *'}
              </Text>
              <FontAwesome name="chevron-down" size={12} color="#999" />
            </TouchableOpacity>
            {formErrors.state && <Text style={styles.errorText}>{formErrors.state}</Text>}

            {/* City Dropdown */}
            <TouchableOpacity
              style={[styles.dropdownButton, formErrors.city && styles.inputError]}
              onPress={() => state ? setShowCityModal(true) : Alert.alert('State Required', 'Please select a state first')}
            >
              <Text style={city ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                {city ? city.XName : 'Select City *'}
              </Text>
              <FontAwesome name="chevron-down" size={12} color="#999" />
            </TouchableOpacity>
            {formErrors.city && <Text style={styles.errorText}>{formErrors.city}</Text>}

            {/* Address Fields */}
            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <TextInput
                  style={[styles.input, formErrors.block && styles.inputError]}
                  placeholder="Block *"
                  value={block}
                  onChangeText={setBlock}
                />
                {formErrors.block && <Text style={styles.errorText}>{formErrors.block}</Text>}
              </View>
              
              <View style={styles.halfInputContainer}>
                <TextInput
                  style={[styles.input, formErrors.street && styles.inputError]}
                  placeholder="Street *"
                  value={street}
                  onChangeText={setStreet}
                />
                {formErrors.street && <Text style={styles.errorText}>{formErrors.street}</Text>}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <TextInput
                  style={[styles.input, formErrors.house && styles.inputError]}
                  placeholder="House *"
                  value={house}
                  onChangeText={setHouse}
                />
                {formErrors.house && <Text style={styles.errorText}>{formErrors.house}</Text>}
              </View>
              
              <View style={styles.halfInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Apartment"
                  value={apartment}
                  onChangeText={setApartment}
                />
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Additional Address Info"
              value={address2}
              onChangeText={setAddress2}
            />

            {/* Set as Default Switch */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set as Default Address</Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: '#D9D9D9', true: '#BCDFF5' }}
                thumbColor={isDefault ? '#00AEEF' : '#F4F3F4'}
              />
            </View>

            {/* Ship to Different Address Option - only for billing */}
            {addressType === 'billing' && (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Ship to a Different Address</Text>
                <Switch
                  value={shipToDifferentAddress}
                  onValueChange={setShipToDifferentAddress}
                  trackColor={{ false: '#D9D9D9', true: '#BCDFF5' }}
                  thumbColor={shipToDifferentAddress ? '#00AEEF' : '#F4F3F4'}
                />
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSavingAddress}
            >
              {isSavingAddress ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Address</Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* Country Modal */}
          {renderDropdownModal(
            showCountryModal,
            () => setShowCountryModal(false),
            'Select Country',
            countries,
            country,
            setCountry
          )}

          {/* State Modal */}
          {renderDropdownModal(
            showStateModal,
            () => setShowStateModal(false),
            'Select State',
            states,
            state,
            setState
          )}

          {/* City Modal */}
          {renderDropdownModal(
            showCityModal,
            () => setShowCityModal(false),
            'Select City',
            cities,
            city,
            setCity
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#D9F4FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00AEEF',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  dropdownButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownPlaceholder: {
    color: '#999999',
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: '#000000',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  halfInputContainer: {
    width: '48%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00AEEF',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F5FBFF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000000',
  },
  emptyMessage: {
    padding: 20,
    textAlign: 'center',
    color: '#999999',
  },
});

export default CheckoutAddressFormModal; 