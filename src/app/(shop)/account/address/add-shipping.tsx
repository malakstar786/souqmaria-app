import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, ActivityIndicator, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii } from '@theme';
import { saveShippingAddress, SaveShippingAddressPayload } from '../../../../utils/api-service';
import { useAuthStore } from '../../../../store/auth-store';
import { useAddressStore } from '../../../../store/address-store';

export default function AddShippingAddressScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { saveShippingAddress, isLoading, error } = useAddressStore();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [block, setBlock] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [address2, setAddress2] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({});

  // TODO: Replace with real dropdown data
  const countryOptions = [{ label: 'Kuwait', value: 'Kuwait' }];
  const stateOptions = [{ label: 'Salmiya', value: 'Salmiya' }];
  const cityOptions = [{ label: '43', value: '43' }];

  function validate() {
    const errors: {[k: string]: string} = {};
    if (!fullName.trim()) errors.fullName = 'Full name required';
    if (!email.trim()) errors.email = 'Email required';
    if (!mobile.trim()) errors.mobile = 'Mobile required';
    if (!country.trim()) errors.country = 'Country required';
    if (!state.trim()) errors.state = 'State required';
    if (!city.trim()) errors.city = 'City required';
    if (!block.trim()) errors.block = 'Block required';
    if (!street.trim()) errors.street = 'Street required';
    if (!house.trim()) errors.house = 'House required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    if (!user?.UserID) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    try {
      const success = await saveShippingAddress({
        ShippingAddressId: 0,
        FullName: fullName.trim(),
        Email: email.trim(),
        Mobile: mobile.trim(),
        Address2: address2.trim(),
        Country: country,
        State: state,
        City: city,
        Block: block.trim(),
        Street: street.trim(),
        House: house.trim(),
        Apartment: apartment.trim(),
        IsDefault: isDefault,
      });

      if (success) {
        Alert.alert('Success', 'Shipping address saved successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', error || 'Failed to save address.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping address</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={[styles.input, formErrors.fullName && styles.inputError]}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          textContentType="name"
        />
        {formErrors.fullName && <Text style={styles.errorText}>{formErrors.fullName}</Text>}
        <TextInput
          style={[styles.input, formErrors.email && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
        <TextInput
          style={[styles.input, formErrors.mobile && styles.inputError]}
          placeholder="Mobile"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        {formErrors.mobile && <Text style={styles.errorText}>{formErrors.mobile}</Text>}
        {/* Country dropdown */}
        <TouchableOpacity style={[styles.input, formErrors.country && styles.inputError]} onPress={() => {}}>
          <Text style={country ? styles.inputText : styles.placeholderText}>{country || 'Country'}</Text>
        </TouchableOpacity>
        {formErrors.country && <Text style={styles.errorText}>{formErrors.country}</Text>}
        {/* State dropdown */}
        <TouchableOpacity style={[styles.input, formErrors.state && styles.inputError]} onPress={() => {}}>
          <Text style={state ? styles.inputText : styles.placeholderText}>{state || 'State'}</Text>
        </TouchableOpacity>
        {formErrors.state && <Text style={styles.errorText}>{formErrors.state}</Text>}
        {/* City dropdown */}
        <TouchableOpacity style={[styles.input, formErrors.city && styles.inputError]} onPress={() => {}}>
          <Text style={city ? styles.inputText : styles.placeholderText}>{city || 'City'}</Text>
        </TouchableOpacity>
        {formErrors.city && <Text style={styles.errorText}>{formErrors.city}</Text>}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf, formErrors.block && styles.inputError]}
            placeholder="Block"
            value={block}
            onChangeText={setBlock}
            textContentType="none"
            autoComplete="off"
          />
          <TextInput
            style={[styles.input, styles.inputHalf, formErrors.street && styles.inputError]}
            placeholder="Street"
            value={street}
            onChangeText={setStreet}
            textContentType="none"
            autoComplete="off"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf, formErrors.house && styles.inputError]}
            placeholder="House"
            value={house}
            onChangeText={setHouse}
            textContentType="none"
            autoComplete="off"
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Apartment No."
            value={apartment}
            onChangeText={setApartment}
            textContentType="none"
            autoComplete="off"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Address 2 (optional)"
          value={address2}
          onChangeText={setAddress2}
          textContentType="none"
          autoComplete="off"
        />
        <View style={styles.checkboxRow}>
          <Switch value={isDefault} onValueChange={setIsDefault} />
          <Text style={styles.checkboxLabel}>Set as default</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveButtonText}>Save</Text>}
        </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  inputText: {
    color: colors.black,
  },
  placeholderText: {
    color: colors.lightGray,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    flex: 0.48,
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
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 