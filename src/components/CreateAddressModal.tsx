import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth-store';
import useAddressStore from '../store/address-store';
import useLocationStore from '../store/location-store';

// Define select input option type
interface SelectOption {
  value: string;
  label: string;
}

interface CreateAddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  addressType: 'billing' | 'shipping';
  onSuccess: () => void;
}

const CreateAddressModal = ({ 
  isVisible, 
  onClose, 
  addressType, 
  onSuccess 
}: CreateAddressModalProps) => {
  const { user } = useAuthStore();
  const addressStore = useAddressStore();
  const locationStore = useLocationStore();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
  const [state, setState] = useState('');
  const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
  const [city, setCity] = useState('');
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [block, setBlock] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [address2, setAddress2] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // For shipping address option when adding billing address
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  
  // Loading states
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Country dropdown visibility
  const [isCountryDropdownVisible, setIsCountryDropdownVisible] = useState(false);
  const [isStateDropdownVisible, setIsStateDropdownVisible] = useState(false);
  const [isCityDropdownVisible, setIsCityDropdownVisible] = useState(false);
  
  // Load countries when modal opens
  useEffect(() => {
    if (isVisible) {
      loadCountries();
      
      // Pre-fill form with user data if available
      if (user) {
        setFullName(user.fullName || '');
        setEmail(user.email || '');
        setMobile(user.mobile || '');
      }
    }
  }, [isVisible, user]);
  
  // Load states when country changes
  useEffect(() => {
    if (country) {
      loadStates(country);
    } else {
      setStateOptions([]);
      setState('');
    }
  }, [country]);
  
  // Load cities when state changes
  useEffect(() => {
    if (state) {
      loadCities(state);
    } else {
      setCityOptions([]);
      setCity('');
    }
  }, [state]);
  
  // Load countries from API
  const loadCountries = async () => {
    setIsLoadingCountries(true);
    try {
      await locationStore.fetchCountries();
      const countries = locationStore.countries;
      if (countries && countries.length > 0) {
        setCountryOptions(countries.map((c) => ({ 
          value: String(c.XCode), 
          label: c.XName 
        })));
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      Alert.alert('Error', 'Failed to load countries. Please try again.');
    } finally {
      setIsLoadingCountries(false);
    }
  };
  
  // Load states from API
  const loadStates = async (countryCode: string) => {
    setIsLoadingStates(true);
    try {
      await locationStore.fetchStates(Number(countryCode));
      const states = locationStore.states;
      if (states && states.length > 0) {
        setStateOptions(states.map((s) => ({ 
          value: String(s.XCode), 
          label: s.XName 
        })));
      }
    } catch (error) {
      console.error('Error loading states:', error);
      Alert.alert('Error', 'Failed to load states. Please try again.');
    } finally {
      setIsLoadingStates(false);
    }
  };
  
  // Load cities from API
  const loadCities = async (stateCode: string) => {
    setIsLoadingCities(true);
    try {
      await locationStore.fetchCities(Number(stateCode));
      const cities = locationStore.cities;
      if (cities && cities.length > 0) {
        setCityOptions(cities.map((c) => ({ 
          value: String(c.XCode), 
          label: c.XName 
        })));
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      Alert.alert('Error', 'Failed to load cities. Please try again.');
    } finally {
      setIsLoadingCities(false);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!country) newErrors.country = 'Country is required';
    if (!state) newErrors.state = 'State is required';
    if (!city) newErrors.city = 'City is required';
    if (!block.trim()) newErrors.block = 'Block is required';
    if (!street.trim()) newErrors.street = 'Street is required';
    if (!house.trim()) newErrors.house = 'House/Building is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    if (!user || (!user.UserID && !user.id)) {
      Alert.alert('Error', 'User information not available. Please login again.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Use a default IP address since we can't reliably get device IP in React Native
      const ipAddress = '127.0.0.1';
      
      // Get the correct user ID from auth store
      const userId = user.UserID || user.id || '';
      
      const addressData = {
        [addressType === 'billing' ? 'BillingAddressId' : 'ShippingAddressId']: 0, // 0 for new address
        FullName: fullName,
        Email: email,
        Mobile: mobile,
        Country: country,
        State: state,
        City: city,
        Block: block,
        Street: street,
        House: house,
        Apartment: apartment,
        Address2: address2,
        IsDefault: isDefault ? 1 : 0,
        Command: 'Save',
        UserId: userId,
        Company: 3044,
        IpAddress: ipAddress,
      };
      
      console.log(`Saving ${addressType} address with userId:`, userId);
      
      let success = false;
      if (addressType === 'billing') {
        success = await addressStore.saveBillingAddress(addressData);
      } else {
        success = await addressStore.saveShippingAddress(addressData);
      }
      
      if (success) {
        Alert.alert('Success', `${addressType === 'billing' ? 'Billing' : 'Shipping'} address saved successfully.`);
        resetForm();
        onSuccess();
        onClose();
      } else {
        Alert.alert('Error', `Failed to save ${addressType} address. Please try again.`);
      }
    } catch (error) {
      console.error(`Error saving ${addressType} address:`, error);
      Alert.alert('Error', `An error occurred while saving the ${addressType} address.`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFullName(user?.fullName || '');
    setEmail(user?.email || '');
    setMobile(user?.mobile || '');
    setCountry('');
    setState('');
    setCity('');
    setBlock('');
    setStreet('');
    setHouse('');
    setApartment('');
    setAddress2('');
    setIsDefault(false);
    setShipToDifferentAddress(false);
    setErrors({});
  };
  
  // Render dropdown options
  const renderDropdownOptions = (
    options: SelectOption[], 
    selectedValue: string, 
    onSelect: (value: string) => void,
    onClose: () => void
  ) => (
    <View style={styles.dropdownContainer}>
      <ScrollView style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              selectedValue === option.value && styles.selectedOption
            ]}
            onPress={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            <Text style={styles.optionText}>{option.label}</Text>
            {selectedValue === option.value && (
              <FontAwesome name="check" size={16} color="#0063B1" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.closeDropdown} onPress={onClose}>
        <Text style={styles.closeDropdownText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {addressType === 'billing' ? 'Billing' : 'Shipping'} Address
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {/* Form */}
          <ScrollView style={styles.formScrollView}>
            {/* Full Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>
            
            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            
            {/* Mobile */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, errors.mobile && styles.inputError]}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
              />
              {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
            </View>
            
            {/* Country */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Country</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.country && styles.inputError]}
                onPress={() => setIsCountryDropdownVisible(true)}
                disabled={isLoadingCountries}
              >
                <Text style={country ? styles.selectText : styles.placeholderText}>
                  {country ? countryOptions.find(c => c.value === country)?.label || country : 'Select Country'}
                </Text>
                {isLoadingCountries ? (
                  <ActivityIndicator size="small" color="#0063B1" />
                ) : (
                  <FontAwesome name="chevron-down" size={16} color="#999" />
                )}
              </TouchableOpacity>
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            </View>
            
            {/* State */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.state && styles.inputError]}
                onPress={() => country && setIsStateDropdownVisible(true)}
                disabled={!country || isLoadingStates}
              >
                <Text style={state ? styles.selectText : styles.placeholderText}>
                  {state ? stateOptions.find(s => s.value === state)?.label || state : 'Select State'}
                </Text>
                {isLoadingStates ? (
                  <ActivityIndicator size="small" color="#0063B1" />
                ) : (
                  <FontAwesome name="chevron-down" size={16} color="#999" />
                )}
              </TouchableOpacity>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>
            
            {/* City */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>City</Text>
              <TouchableOpacity
                style={[styles.selectInput, errors.city && styles.inputError]}
                onPress={() => state && setIsCityDropdownVisible(true)}
                disabled={!state || isLoadingCities}
              >
                <Text style={city ? styles.selectText : styles.placeholderText}>
                  {city ? cityOptions.find(c => c.value === city)?.label || city : 'Select City'}
                </Text>
                {isLoadingCities ? (
                  <ActivityIndicator size="small" color="#0063B1" />
                ) : (
                  <FontAwesome name="chevron-down" size={16} color="#999" />
                )}
              </TouchableOpacity>
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>
            
            {/* Block */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Block</Text>
              <TextInput
                style={[styles.input, errors.block && styles.inputError]}
                value={block}
                onChangeText={setBlock}
                placeholder="Enter block"
              />
              {errors.block && <Text style={styles.errorText}>{errors.block}</Text>}
            </View>
            
            {/* Street */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Street</Text>
              <TextInput
                style={[styles.input, errors.street && styles.inputError]}
                value={street}
                onChangeText={setStreet}
                placeholder="Enter street"
              />
              {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
            </View>
            
            {/* House/Building */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>House/Building</Text>
              <TextInput
                style={[styles.input, errors.house && styles.inputError]}
                value={house}
                onChangeText={setHouse}
                placeholder="Enter house/building"
              />
              {errors.house && <Text style={styles.errorText}>{errors.house}</Text>}
            </View>
            
            {/* Apartment */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Apartment No.</Text>
              <TextInput
                style={styles.input}
                value={apartment}
                onChangeText={setApartment}
                placeholder="Enter apartment number (optional)"
              />
            </View>
            
            {/* Address Line */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Address Line (optional)</Text>
              <TextInput
                style={styles.input}
                value={address2}
                onChangeText={setAddress2}
                placeholder="Enter additional address details"
                multiline
              />
            </View>
            
            {/* Set as default */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set as default</Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: "#d9d9d9", true: "#0063B1" }}
                thumbColor={"#f4f3f4"}
              />
            </View>
            
            {/* Ship to different address option (only for billing address) */}
            {addressType === 'billing' && (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Ship to different address?</Text>
                <Switch
                  value={shipToDifferentAddress}
                  onValueChange={setShipToDifferentAddress}
                  trackColor={{ false: "#d9d9d9", true: "#0063B1" }}
                  thumbColor={"#f4f3f4"}
                />
              </View>
            )}
          </ScrollView>
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Country Dropdown */}
      {isCountryDropdownVisible && (
        <Modal
          visible={isCountryDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsCountryDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setIsCountryDropdownVisible(false)}
          >
            {renderDropdownOptions(
              countryOptions,
              country,
              setCountry,
              () => setIsCountryDropdownVisible(false)
            )}
          </TouchableOpacity>
        </Modal>
      )}
      
      {/* State Dropdown */}
      {isStateDropdownVisible && (
        <Modal
          visible={isStateDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsStateDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setIsStateDropdownVisible(false)}
          >
            {renderDropdownOptions(
              stateOptions,
              state,
              setState,
              () => setIsStateDropdownVisible(false)
            )}
          </TouchableOpacity>
        </Modal>
      )}
      
      {/* City Dropdown */}
      {isCityDropdownVisible && (
        <Modal
          visible={isCityDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsCityDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setIsCityDropdownVisible(false)}
          >
            {renderDropdownOptions(
              cityOptions,
              city,
              setCity,
              () => setIsCityDropdownVisible(false)
            )}
          </TouchableOpacity>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0063B1',
  },
  closeButton: {
    padding: 5,
  },
  formScrollView: {
    paddingHorizontal: 15,
    maxHeight: '80%',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 3,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#eee',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#0063B1',
    borderLeftWidth: 0.5,
    borderLeftColor: '#eee',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    fontSize: 16,
  },
  closeDropdown: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f5f5f5',
  },
  closeDropdownText: {
    fontSize: 16,
    color: '#0063B1',
    fontWeight: 'bold',
  },
});

export default CreateAddressModal; 