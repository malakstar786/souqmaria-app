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
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useCheckoutStore, { CheckoutAddress } from '../store/checkout-store';
import { getCheckoutCountries, getCheckoutStates, getCheckoutCities, CheckoutLocationDataResponse } from '../utils/api-service';

// Define our own LocationItem interface to match the component usage
interface LocationItem {
  XCode: number;
  XName: string;
}

interface GuestCheckoutShippingFormProps {
  onComplete: () => void;
}

const GuestCheckoutShippingForm = ({ onComplete }: GuestCheckoutShippingFormProps) => {
  const { 
    billingAddress,
    shippingAddress,
    setShippingAddress,
    saveGuestShippingAddress,
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
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({});

  // Pre-fill from billing address if available
  useEffect(() => {
    if (billingAddress) {
      setFullName(billingAddress.fullName);
      setEmail(billingAddress.email);
      setMobile(billingAddress.mobile);
      // Don't pre-fill location data since it requires API calls
    }
    
    fetchCountries();
  }, [billingAddress]);

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
      console.log('🚢 Fetching countries for shipping...');
      const response = await getCheckoutCountries();
      console.log('🚢 Countries response:', JSON.stringify(response, null, 2));
      
      if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
        // Map API response to our LocationItem structure
        const mappedCountries: LocationItem[] = response.Data.row.map((item) => ({
          XCode: item.XCode,
          XName: item.XName
        }));
        console.log('🚢 Mapped countries:', mappedCountries.length, 'items');
        setCountries(mappedCountries);
      } else {
        console.error('🚢 Failed to fetch countries:', response);
        Alert.alert('Error', 'Failed to fetch countries');
      }
    } catch (error) {
      console.error('🚢 Error fetching countries:', error);
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
        // Map API response to our LocationItem structure
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
        // Map API response to our LocationItem structure
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
    
    // Prepare the shipping address data
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
    
    // Save the shipping address to store
    setShippingAddress(addressData);
    
    // Save the shipping address using the new store function
    console.log('🚢 Saving guest shipping address...');
    const addressSaveSuccess = await saveGuestShippingAddress(addressData);
    
    if (addressSaveSuccess) {
      console.log('✅ Guest shipping address saved successfully');
      // Continue to next step
      onComplete();
    } else {
      Alert.alert('Error', submissionError || 'Failed to save shipping address. Please try again.');
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
          onPress={() => onComplete()}
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping address</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Shipping Address</Text>
          
          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, formErrors.fullName && styles.inputError]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
            {formErrors.fullName && (
              <Text style={styles.errorText}>{formErrors.fullName}</Text>
            )}
          </View>
          
          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
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
            <Text style={styles.label}>Mobile *</Text>
            <TextInput
              style={[styles.input, formErrors.mobile && styles.inputError]}
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter your mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {formErrors.mobile && (
              <Text style={styles.errorText}>{formErrors.mobile}</Text>
            )}
          </View>
          
          {/* Country Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Country *</Text>
            <TouchableOpacity
              style={[styles.dropdown, formErrors.country && styles.inputError]}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={country ? styles.dropdownText : styles.placeholderText}>
                {country ? country.XName : 'Select Country'}
              </Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            {formErrors.country && (
              <Text style={styles.errorText}>{formErrors.country}</Text>
            )}
          </View>
          
          {/* State Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>State *</Text>
            <TouchableOpacity
              style={[styles.dropdown, formErrors.state && styles.inputError]}
              onPress={() => setShowStateModal(true)}
              disabled={!country}
            >
              <Text style={state ? styles.dropdownText : styles.placeholderText}>
                {state ? state.XName : country ? 'Select State' : 'Select Country First'}
              </Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            {formErrors.state && (
              <Text style={styles.errorText}>{formErrors.state}</Text>
            )}
          </View>
          
          {/* City Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity
              style={[styles.dropdown, formErrors.city && styles.inputError]}
              onPress={() => setShowCityModal(true)}
              disabled={!state}
            >
              <Text style={city ? styles.dropdownText : styles.placeholderText}>
                {city ? city.XName : state ? 'Select City' : 'Select State First'}
              </Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            {formErrors.city && (
              <Text style={styles.errorText}>{formErrors.city}</Text>
            )}
          </View>
          
          {/* Block */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Block *</Text>
            <TextInput
              style={[styles.input, formErrors.block && styles.inputError]}
              value={block}
              onChangeText={setBlock}
              placeholder="Enter block"
              placeholderTextColor="#999"
            />
            {formErrors.block && (
              <Text style={styles.errorText}>{formErrors.block}</Text>
            )}
          </View>
          
          {/* Street */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Street *</Text>
            <TextInput
              style={[styles.input, formErrors.street && styles.inputError]}
              value={street}
              onChangeText={setStreet}
              placeholder="Enter street"
              placeholderTextColor="#999"
            />
            {formErrors.street && (
              <Text style={styles.errorText}>{formErrors.street}</Text>
            )}
          </View>
          
          {/* House */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>House *</Text>
            <TextInput
              style={[styles.input, formErrors.house && styles.inputError]}
              value={house}
              onChangeText={setHouse}
              placeholder="Enter house"
              placeholderTextColor="#999"
            />
            {formErrors.house && (
              <Text style={styles.errorText}>{formErrors.house}</Text>
            )}
          </View>
          
          {/* Apartment */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Apartment</Text>
            <TextInput
              style={styles.input}
              value={apartment}
              onChangeText={setApartment}
              placeholder="Enter apartment (optional)"
              placeholderTextColor="#999"
            />
          </View>
          
          {/* Additional Address */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Additional Address Info</Text>
            <TextInput
              style={styles.input}
              value={address2}
              onChangeText={setAddress2}
              placeholder="Enter additional address info (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
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
              <Text style={styles.saveButtonText}>SAVE</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Country Modal */}
      {renderDropdownModal(
        showCountryModal,
        () => setShowCountryModal(false),
        'Select Country',
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
        'Select State',
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
        'Select City',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#00AEEF',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
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
});

export default GuestCheckoutShippingForm; 