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
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { 
  getCheckoutCountries, 
  getCheckoutStates, 
  getCheckoutCities, 
  saveBillingAddress, 
  saveShippingAddress,
  SaveBillingAddressPayload,
  SaveShippingAddressPayload 
} from '../utils/api-service';
import useAuthStore from '../store/auth-store';

const colors = {
  white: '#FFFFFF',
  lightBlue: '#E6F0FA',
  blue: '#0063B1',
  black: '#000000',
  lightGray: '#E0E0E0',
  gray: '#888888',
  red: '#FF0000',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};

interface LocationItem {
  XCode: number;
  XName: string;
}

interface AddAddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addressType: 'billing' | 'shipping';
}

const AddAddressModal = ({ isVisible, onClose, onSuccess, addressType }: AddAddressModalProps) => {
  const { user } = useAuthStore();
  
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
  const [isDefault, setIsDefault] = useState(false);
  
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
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isVisible && user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
    }
  }, [isVisible, user]);

  // Fetch countries on component mount
  useEffect(() => {
    if (isVisible) {
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

  // Fetch countries
  const fetchCountries = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await getCheckoutCountries();
      if (response.Data && response.Data.success === 1 && Array.isArray(response.Data.row)) {
        const mappedCountries: LocationItem[] = response.Data.row.map((item) => ({
          XCode: item.XCode,
          XName: item.XName
        }));
        setCountries(mappedCountries);
      } else {
        Alert.alert('Error', 'Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
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
    
    if (!user || !user.UserID) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (addressType === 'billing') {
        const billingAddressPayload: SaveBillingAddressPayload = {
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
          Command: 'Save',
          UserId: user.UserID,
          CompanyId: 3044,
          IpAddress: '127.0.0.1',
        };
        
        const saveResponse = await saveBillingAddress(billingAddressPayload);
        if (saveResponse.ResponseCode === '2') {
          Alert.alert('Success', 'Billing address saved successfully!');
          onSuccess();
          onClose();
        } else {
          Alert.alert('Error', saveResponse.Message || 'Failed to save address. Please try again.');
        }
      } else {
        const shippingAddressPayload: SaveShippingAddressPayload = {
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
          Command: 'Save',
          UserId: user.UserID,
          CompanyId: 3044,
          IpAddress: '127.0.0.1',
        };
        
        const saveResponse = await saveShippingAddress(shippingAddressPayload);
        if (saveResponse.ResponseCode === '2') {
          Alert.alert('Success', 'Shipping address saved successfully!');
          onSuccess();
          onClose();
        } else {
          Alert.alert('Error', saveResponse.Message || 'Failed to save address. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
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
    onClose();
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
        <FontAwesome name="check" size={16} color={colors.blue} />
      )}
    </TouchableOpacity>
  );

  // Render dropdown modal
  const renderDropdownModal = (
    visible: boolean,
    onCloseModal: () => void,
    title: string,
    items: LocationItem[],
    selectedItem: LocationItem | null,
    onSelect: (item: LocationItem) => void
  ) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onCloseModal}>
              <FontAwesome name="times" size={20} color={colors.black} />
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <FontAwesome name="arrow-left" size={20} color={colors.blue} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Add {addressType === 'billing' ? 'Billing' : 'Shipping'} Address
            </Text>
            <View style={{ width: 20 }} />
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={[styles.input, formErrors.fullName && styles.inputError]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
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
                  <FontAwesome name="chevron-down" size={16} color={colors.gray} />
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
                  <FontAwesome name="chevron-down" size={16} color={colors.gray} />
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
                  <FontAwesome name="chevron-down" size={16} color={colors.gray} />
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
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              {/* Set as Default */}
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Set as default address</Text>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setIsDefault(!isDefault)}
                >
                  <View style={[styles.checkbox, isDefault && styles.checkboxSelected]}>
                    {isDefault && <FontAwesome name="check" size={12} color={colors.white} />}
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.disabledButton]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} size="small" />
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginTop: 40, // Account for status bar
  },
  closeButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.black,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.gray,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  checkboxContainer: {
    padding: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.blue,
  },
  saveButton: {
    backgroundColor: colors.blue,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  modalList: {
    padding: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  selectedItem: {
    backgroundColor: colors.lightBlue,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.black,
  },
  noItemsText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    padding: spacing.md,
  },
});

export default AddAddressModal; 