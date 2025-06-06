import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useCheckoutStore, { CheckoutAddress } from '../store/checkout-store';
import { getCheckoutCountries, getCheckoutStates, getCheckoutCities, CheckoutLocationDataResponse } from '../utils/api-service';
import { useTranslation } from '../utils/translations';

// Define our own LocationItem interface to match the component usage
interface LocationItem {
  XCode: number;
  XName: string;
}

interface GuestCheckoutAddressFormProps {
  onComplete: (shipToDifferentAddress: boolean) => void;
}

const GuestCheckoutAddressForm = ({ onComplete }: GuestCheckoutAddressFormProps) => {
  const { t } = useTranslation();
  const { 
    billingAddress, 
    setBillingAddress, 
    useShippingForBilling, 
    setUseShippingForBilling,
    registerGuestUser,
    saveGuestBillingAddress,
    isLoading: isSubmitting,
    error: submissionError,
  } = useCheckoutStore();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState<LocationItem | null>(null);
  const [state, setState] = useState<LocationItem | null>(null);
  const [city, setCity] = useState<LocationItem | null>(null);
  const [block, setBlock] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [address2, setAddress2] = useState('');
  
  // Location data
  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [states, setStates] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // UI state for dropdowns
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  
  // Ship to different address toggle
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({});

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

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

  // Fetch countries
  const fetchCountries = async () => {
    setIsLoadingLocations(true);
    try {
      console.log('🌍 Fetching countries for checkout...');
      const response = await getCheckoutCountries();
      console.log('🌍 Countries response:', JSON.stringify(response, null, 2));
      
      if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
        // Map API response to our LocationItem structure
        const mappedCountries: LocationItem[] = response.Data.row.map((item) => ({
          XCode: item.XCode,
          XName: item.XName
        }));
        console.log('🌍 Mapped countries:', mappedCountries.length, 'items');
        setCountries(mappedCountries);
      } else {
        console.error('🌍 Failed to fetch countries:', response);
        Alert.alert('Error', 'Failed to fetch countries');
      }
    } catch (error) {
      console.error('🌍 Error fetching countries:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch states for a country
  const fetchStates = async (countryId: number) => {
    setIsLoadingLocations(true);
    setState(null);
    setCity(null);
    setStates([]);
    setCities([]);
    
    try {
      const response = await getCheckoutStates(countryId.toString());
      if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
        const mappedStates: LocationItem[] = response.Data.row.map((item) => ({
          XCode: item.XCode,
          XName: item.XName
        }));
        setStates(mappedStates);
      } else {
        Alert.alert('Error', 'Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch cities for a state
  const fetchCities = async (stateId: number) => {
    setIsLoadingLocations(true);
    setCity(null);
    setCities([]);
    
    try {
      const response = await getCheckoutCities(stateId.toString());
      if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
        const mappedCities: LocationItem[] = response.Data.row.map((item) => ({
          XCode: item.XCode,
          XName: item.XName
        }));
        setCities(mappedCities);
      } else {
        Alert.alert('Error', 'Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: {[k: string]: string} = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!mobile.trim()) errors.mobile = 'Mobile number is required';
    if (!country) errors.country = 'Country is required';
    if (!state) errors.state = 'State is required';
    if (!city) errors.city = 'City is required';
    if (!block.trim()) errors.block = 'Block is required';
    if (!street.trim()) errors.street = 'Street is required';
    if (!house.trim()) errors.house = 'House is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email';
    }
    
    // Mobile validation
    const mobileRegex = /^\d{8,15}$/;
    if (mobile.trim() && !mobileRegex.test(mobile.trim())) {
      errors.mobile = 'Please enter a valid mobile number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return;
    
    // Prepare the billing address data
    const addressData: CheckoutAddress = {
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      country,
      state,
      city,
      block: block.trim(),
      street: street.trim(),
      house: house.trim(),
      apartment: apartment.trim(),
      address2: address2.trim(),
    };
    
    // Save the billing address to store
    setBillingAddress(addressData);
    
    // Register as guest user first
    console.log('🧪 Step 1: Registering guest user...');
    const registrationSuccess = await registerGuestUser({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
    });
    
    if (registrationSuccess) {
      // Now save the billing address using the new store function
      console.log('🧪 Step 2: Saving guest billing address...');
      const addressSaveSuccess = await saveGuestBillingAddress(addressData);
      
      if (addressSaveSuccess) {
        console.log('✅ Guest checkout flow completed successfully');
        // Continue to next step based on whether user wants to ship to a different address
        onComplete(shipToDifferentAddress);
      } else {
        Alert.alert('Error', submissionError || 'Failed to save address. Please try again.');
      }
    } else {
      // Show error message
      Alert.alert('Error', submissionError || 'Failed to register. Please try again.');
    }
  };

  // Render dropdown item
  const renderOptionItem = (item: LocationItem, selectedItem: LocationItem | null, onItemSelect: (item: LocationItem) => void) => (
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

  // Render dropdown modal
  const renderDropdownModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    items: LocationItem[],
    selectedItem: LocationItem | null,
    onSelect: (item: LocationItem) => void
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
            {items.length === 0 ? (
              <Text style={styles.noItemsText}>No items available</Text>
            ) : (
              items.map(item => renderOptionItem(item, selectedItem, onSelect))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onComplete(false)}
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('billing_address')}</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, formErrors.fullName && styles.inputError]}
              value={fullName}
              onChangeText={setFullName}
              placeholder={t('full_name')}
              placeholderTextColor="#999"
            />
            {formErrors.fullName && (
              <Text style={styles.errorText}>{formErrors.fullName}</Text>
            )}
          </View>
          
          {/* Email */}
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder={t('email')}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {formErrors.email && (
              <Text style={styles.errorText}>{formErrors.email}</Text>
            )}
          </View>
          
          {/* Mobile */}
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, formErrors.mobile && styles.inputError]}
              value={mobile}
              onChangeText={setMobile}
              placeholder={t('mobile')}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {formErrors.mobile && (
              <Text style={styles.errorText}>{formErrors.mobile}</Text>
            )}
          </View>
          
          {/* Country Dropdown */}
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={[styles.dropdown, formErrors.country && styles.inputError]}
              onPress={() => {
                console.log('🌍 Country dropdown pressed, countries count:', countries.length);
                if (countries.length > 0) {
                  setShowCountryModal(true);
                } else {
                  console.log('🌍 No countries available, fetching again...');
                  fetchCountries();
                }
              }}
              disabled={isLoadingLocations}
            >
              <Text style={country ? styles.dropdownText : styles.placeholderText}>
                {country ? country.XName : t('country')}
              </Text>
              {isLoadingLocations ? (
                <ActivityIndicator size="small" color="#00AEEF" />
              ) : (
                <FontAwesome name="chevron-down" size={16} color="#666" />
              )}
            </TouchableOpacity>
            {formErrors.country && (
              <Text style={styles.errorText}>{formErrors.country}</Text>
            )}
            {countries.length === 0 && !isLoadingLocations && (
              <Text style={styles.infoText}>No countries available. Tap to retry.</Text>
            )}
          </View>
          
          {/* Row for City and Area (State) */}
          <View style={styles.rowContainer}>
            {/* City Dropdown */}
            <View style={[styles.formGroup, styles.halfWidth, { marginRight: 8 }]}>
              <TouchableOpacity
                style={[styles.dropdown, formErrors.city && styles.inputError]}
                onPress={() => setShowCityModal(true)}
                disabled={!state}
              >
                <Text style={city ? styles.dropdownText : styles.placeholderText}>
                  {city ? city.XName : t('city')}
                </Text>
                <FontAwesome name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              {formErrors.city && (
                <Text style={styles.errorText}>{formErrors.city}</Text>
              )}
            </View>
            
            {/* Area (State) Dropdown */}
            <View style={[styles.formGroup, styles.halfWidth, { marginLeft: 8 }]}>
              <TouchableOpacity
                style={[styles.dropdown, formErrors.state && styles.inputError]}
                onPress={() => setShowStateModal(true)}
                disabled={!country}
              >
                <Text style={state ? styles.dropdownText : styles.placeholderText}>
                  {state ? state.XName : t('area')}
                </Text>
                <FontAwesome name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              {formErrors.state && (
                <Text style={styles.errorText}>{formErrors.state}</Text>
              )}
            </View>
          </View>
          
          {/* Row for Block and Street */}
          <View style={styles.rowContainer}>
            {/* Block */}
            <View style={[styles.formGroup, styles.halfWidth, { marginRight: 8 }]}>
              <TextInput
                style={[styles.input, formErrors.block && styles.inputError]}
                value={block}
                onChangeText={setBlock}
                placeholder={t('block')}
                placeholderTextColor="#999"
              />
              {formErrors.block && (
                <Text style={styles.errorText}>{formErrors.block}</Text>
              )}
            </View>
            
            {/* Street */}
            <View style={[styles.formGroup, styles.halfWidth, { marginLeft: 8 }]}>
              <TextInput
                style={[styles.input, formErrors.street && styles.inputError]}
                value={street}
                onChangeText={setStreet}
                placeholder={t('street')}
                placeholderTextColor="#999"
              />
              {formErrors.street && (
                <Text style={styles.errorText}>{formErrors.street}</Text>
              )}
            </View>
          </View>
          
          {/* Row for House/Building and Apartment */}
          <View style={styles.rowContainer}>
            {/* House */}
            <View style={[styles.formGroup, styles.halfWidth, { marginRight: 8 }]}>
              <TextInput
                style={[styles.input, formErrors.house && styles.inputError]}
                value={house}
                onChangeText={setHouse}
                placeholder={t('house_building')}
                placeholderTextColor="#999"
              />
              {formErrors.house && (
                <Text style={styles.errorText}>{formErrors.house}</Text>
              )}
            </View>
            
            {/* Apartment */}
            <View style={[styles.formGroup, styles.halfWidth, { marginLeft: 8 }]}>
              <TextInput
                style={styles.input}
                value={apartment}
                onChangeText={setApartment}
                placeholder={t('apartment_no')}
                placeholderTextColor="#999"
              />
            </View>
          </View>
          
          {/* Address Line 1 */}
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              value={address2}
              onChangeText={setAddress2}
              placeholder={t('address_line_1')}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Checkboxes */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setShipToDifferentAddress(!shipToDifferentAddress)}
            >
              <View style={[styles.checkbox, shipToDifferentAddress && styles.checkboxSelected]}>
                {shipToDifferentAddress && <FontAwesome name="check" size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>{t('ship_to_different_address')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {/* Handle set as default */}}
            >
              <View style={[styles.checkbox, styles.checkboxSelected]}>
                <FontAwesome name="check" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.checkboxLabel}>{t('set_as_default')}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Country Modal */}
      {renderDropdownModal(
        showCountryModal,
        () => setShowCountryModal(false),
        t('select_country'),
        countries,
        country,
        (selected) => {
          setCountry(selected);
          setShowCountryModal(false);
        }
      )}
      
      {/* State Modal */}
      {renderDropdownModal(
        showStateModal,
        () => setShowStateModal(false),
        t('select_state'),
        states,
        state,
        (selected) => {
          setState(selected);
          setShowStateModal(false);
        }
      )}
      
      {/* City Modal */}
      {renderDropdownModal(
        showCityModal,
        () => setShowCityModal(false),
        t('select_city'),
        cities,
        city,
        (selected) => {
          setCity(selected);
          setShowCityModal(false);
        }
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00AEEF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 1,
  },
  checkboxContainer: {
    marginVertical: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00AEEF',
    borderColor: '#00AEEF',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 56,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F5F9FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000000',
  },
  noItemsText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    padding: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    padding: 16,
  },
});

export default GuestCheckoutAddressForm; 