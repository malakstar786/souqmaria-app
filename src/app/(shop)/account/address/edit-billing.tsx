import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, ActivityIndicator, Alert, Switch, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { useAuthStore } from '../../../../store/auth-store';
import useAddressStore, { Address } from '../../../../store/address-store';
import useLocationStore, { LocationItem } from '../../../../store/location-store';
import useCheckoutStore from '../../../../store/checkout-store';
import { useTranslation } from '../../../../utils/translations';
import { useRTL } from '../../../../utils/rtl';

export default function EditBillingAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addressId = Number(params.id);
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  
  const { user } = useAuthStore();
  const { billingAddresses, updateBillingAddress, isLoading, error, clearError } = useAddressStore();
  const { 
    fetchCountries, 
    fetchStates, 
    fetchCities,
    countries,
    states,
    cities,
    isLoading: isLoadingLocations 
  } = useLocationStore();
  const { triggerOrderReviewUpdate } = useCheckoutStore();

  // Current address being edited
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

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
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({});
  const [debugResponse, setDebugResponse] = useState<string | null>(null);

  // UI state for dropdowns
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Find the current address being edited
  useEffect(() => {
    const address = billingAddresses.find(addr => addr.id === addressId);
    if (address) {
      setCurrentAddress(address);
      setFullName(address.fullName);
      setEmail(address.email);
      setMobile(address.mobile);
      setBlock(address.block);
      setStreet(address.street);
      setHouse(address.house);
      setApartment(address.apartment || '');
      setAddress2(address.address2 || '');
      setIsDefault(address.isDefault);
    } else {
      Alert.alert(t('error'), t('address_not_found'), [
        { text: t('ok'), onPress: () => router.back() }
      ]);
    }
  }, [addressId, billingAddresses]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // When countries are loaded and we have the current address, set the country
  useEffect(() => {
    if (currentAddress && countries.length > 0) {
      const addressCountry = countries.find(c => c.XCode.toString() === currentAddress.country);
      if (addressCountry) {
        setCountry(addressCountry);
      }
    }
  }, [currentAddress, countries]);

  // Fetch states when country changes
  useEffect(() => {
    if (country) {
      fetchStates(country.XCode);
    }
  }, [country]);

  // When states are loaded and we have the current address, set the state
  useEffect(() => {
    if (currentAddress && states.length > 0) {
      const addressState = states.find(s => s.XCode.toString() === currentAddress.state);
      if (addressState) {
        setState(addressState);
      }
    }
  }, [currentAddress, states]);

  // Fetch cities when state changes
  useEffect(() => {
    if (state) {
      fetchCities(state.XCode);
    }
  }, [state]);

  // When cities are loaded and we have the current address, set the city
  useEffect(() => {
    if (currentAddress && cities.length > 0) {
      const addressCity = cities.find(c => c.XCode.toString() === currentAddress.city);
      if (addressCity) {
        setCity(addressCity);
      }
    }
  }, [currentAddress, cities]);

  function validate() {
    const errors: {[k: string]: string} = {};
    if (!fullName.trim()) errors.fullName = t('full_name_required');
    if (!email.trim()) errors.email = t('email_required_field');
    if (!mobile.trim()) errors.mobile = t('mobile_required_field');
    if (!country) errors.country = t('country_required');
    if (!state) errors.state = t('state_required');
    if (!city) errors.city = t('city_required');
    if (!block.trim()) errors.block = t('block_required');
    if (!street.trim()) errors.street = t('street_required');
    if (!house.trim()) errors.house = t('house_required');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleUpdate() {
    if (!validate()) return;
    if (!user?.UserID && !user?.id) {
      Alert.alert(t('error'), t('user_not_found'));
      return;
    }

    try {
      const userId = user.UserID || user.id || '';
      const payload = {
        BillingAddressId: addressId,
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
        Command: 'Update', // Required parameter for update
        UserId: userId,
        CompanyId: 3044, // Fixed value as per API docs
        IpAddress: '127.0.0.1', // In a real app, get the actual IP
      };

      console.log('Billing address update payload with userId:', userId);
      
      const success = await updateBillingAddress(payload);

      if (success) {
        setDebugResponse(null); // clear debug error
        clearError();
        // Show success and go to address list screen
        Alert.alert(t('success'), t('billing_address_updated_successfully'), [
          { text: t('ok'), onPress: () => router.replace('/account/address') },
        ]);
        triggerOrderReviewUpdate();
      } else {
        // Show error message and debug info
        setDebugResponse(error || 'Unknown error occurred');
        Alert.alert(t('error'), error || t('failed_to_update_address'));
      }
    } catch (e) {
      console.error('Error updating billing address:', e);
      Alert.alert(t('error'), t('network_error_try_again'));
    }
  }

  // Render dropdown modal for selection
  function renderSelectionModal(
    visible: boolean,
    onClose: () => void,
    items: LocationItem[],
    selectedItem: LocationItem | null,
    onSelect: (item: LocationItem) => void,
    title: string
  ) {
    return (
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
                <FontAwesome name="times" size={20} color={colors.black} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {isLoadingLocations ? (
                <ActivityIndicator color={colors.blue} style={styles.loader} />
              ) : items.length === 0 ? (
                <Text style={[styles.emptyText, { textAlign }]}>{t('no_items_available')}</Text>
              ) : (
                items.map((item) => (
                  <TouchableOpacity
                    key={item.XCode}
                    style={[
                      styles.modalItem,
                      selectedItem?.XCode === item.XCode && styles.selectedItem
                    ]}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      selectedItem?.XCode === item.XCode && styles.selectedItemText
                    ]}>
                      {item.XName}
                    </Text>
                    {selectedItem?.XCode === item.XCode && (
                      <FontAwesome name="check" size={16} color={colors.green} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  // Show loading while fetching address data
  if (!currentAddress || isLoadingLocations) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
        <Text style={[styles.loadingText, { textAlign }]}>{t('loading_address')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('edit_billing_address')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Debug response info, visible only during development */}
        {__DEV__ && debugResponse && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>Error: {debugResponse}</Text>
          </View>
        )}
        
        <TextInput
          style={[styles.input, formErrors.fullName && styles.inputError, { textAlign }]}
          placeholder={t('full_name')}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          textContentType="name"
        />
        {formErrors.fullName && <Text style={[styles.errorText, { textAlign }]}>{formErrors.fullName}</Text>}
        <TextInput
          style={[styles.input, formErrors.email && styles.inputError, { textAlign }]}
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        {formErrors.email && <Text style={[styles.errorText, { textAlign }]}>{formErrors.email}</Text>}
        <TextInput
          style={[styles.input, formErrors.mobile && styles.inputError, { textAlign }]}
          placeholder={t('mobile')}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        {formErrors.mobile && <Text style={[styles.errorText, { textAlign }]}>{formErrors.mobile}</Text>}
        
        {/* Country dropdown */}
        <TouchableOpacity 
          style={[styles.input, formErrors.country && styles.inputError, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} 
          onPress={() => setShowCountryModal(true)}
        >
          <Text style={[country ? styles.inputText : styles.placeholderText, { textAlign }]}>
            {country ? country.XName : t('country')}
          </Text>
          <FontAwesome name="chevron-down" size={14} color={colors.lightGray} />
        </TouchableOpacity>
        {formErrors.country && <Text style={[styles.errorText, { textAlign }]}>{formErrors.country}</Text>}
        
        {/* State dropdown */}
        <TouchableOpacity 
          style={[styles.input, formErrors.state && styles.inputError, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} 
          onPress={() => country ? setShowStateModal(true) : Alert.alert(t('select_country'), t('select_country_first'))}
        >
          <Text style={[state ? styles.inputText : styles.placeholderText, { textAlign }]}>
            {state ? state.XName : t('state')}
          </Text>
          <FontAwesome name="chevron-down" size={14} color={colors.lightGray} />
        </TouchableOpacity>
        {formErrors.state && <Text style={[styles.errorText, { textAlign }]}>{formErrors.state}</Text>}
        
        {/* City dropdown */}
        <TouchableOpacity 
          style={[styles.input, formErrors.city && styles.inputError, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} 
          onPress={() => state ? setShowCityModal(true) : Alert.alert(t('select_state'), t('select_state_first'))}
        >
          <Text style={[city ? styles.inputText : styles.placeholderText, { textAlign }]}>
            {city ? city.XName : t('city')}
          </Text>
          <FontAwesome name="chevron-down" size={14} color={colors.lightGray} />
        </TouchableOpacity>
        {formErrors.city && <Text style={[styles.errorText, { textAlign }]}>{formErrors.city}</Text>}
        
        <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TextInput
            style={[styles.input, styles.inputHalf, formErrors.block && styles.inputError, { textAlign }]}
            placeholder={t('block')}
            value={block}
            onChangeText={setBlock}
            textContentType="none"
            autoComplete="off"
          />
          <TextInput
            style={[styles.input, styles.inputHalf, formErrors.street && styles.inputError, { textAlign }]}
            placeholder={t('street')}
            value={street}
            onChangeText={setStreet}
            textContentType="none"
            autoComplete="off"
          />
        </View>
        <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TextInput
            style={[styles.input, styles.inputHalf, formErrors.house && styles.inputError, { textAlign }]}
            placeholder={t('house_building')}
            value={house}
            onChangeText={setHouse}
            textContentType="none"
            autoComplete="off"
          />
          <TextInput
            style={[styles.input, styles.inputHalf, { textAlign }]}
            placeholder={t('apartment_no_optional')}
            value={apartment}
            onChangeText={setApartment}
            textContentType="none"
            autoComplete="off"
          />
        </View>
        <TextInput
          style={[styles.input, { textAlign }]}
          placeholder={t('address_2_optional')}
          value={address2}
          onChangeText={setAddress2}
          textContentType="none"
          autoComplete="off"
        />
        <View style={[styles.checkboxRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Switch 
            value={isDefault} 
            onValueChange={setIsDefault} 
            trackColor={{ false: colors.lightGray, true: colors.green }}
            thumbColor={colors.white}
          />
          <Text style={[styles.checkboxLabel, { marginLeft: isRTL ? 0 : spacing.md, marginRight: isRTL ? spacing.md : 0, textAlign }]}>{t('set_as_default')}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleUpdate} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{t('update')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Selection Modals */}
      {renderSelectionModal(
        showCountryModal,
        () => setShowCountryModal(false),
        countries,
        country,
        setCountry,
        t('select_country')
      )}
      
      {renderSelectionModal(
        showStateModal,
        () => setShowStateModal(false),
        states,
        state,
        setState,
        t('select_state')
      )}
      
      {renderSelectionModal(
        showCityModal,
        () => setShowCityModal(false),
        cities,
        city,
        setCity,
        t('select_city')
      )}
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
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: spacing.lg,
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
    fontSize: 12,
  },
  inputText: {
    color: colors.black,
    flex: 1,
  },
  placeholderText: {
    color: colors.lightGray,
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkboxLabel: {
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.black,
  },
  saveButton: {
    backgroundColor: colors.blue,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Debug info
  debugContainer: {
    backgroundColor: '#FDE2E2',
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  debugText: {
    color: '#D32F2F',
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 34,
    maxHeight: '70%',
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
    color: colors.blue,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: colors.veryLightGray,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedItemText: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  loader: {
    padding: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    padding: spacing.xl,
    color: colors.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.blue,
    fontSize: 16,
  },
}); 