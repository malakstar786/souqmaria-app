import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Keyboard, Platform, ScrollView as RNScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import useSearchStore from '../store/search-store';
import { SearchItem } from '../utils/api-service';
import { debounce } from 'lodash';

interface SearchBarWithSuggestionsProps {
  placeholder?: string;
  onSubmit: (query: string) => void;
  onSuggestionPress: (item: SearchItem) => void;
  value?: string;
  setValue?: (text: string) => void;
  style?: any;
}

export function SearchBarWithSuggestions({
  placeholder = 'Search Products',
  onSubmit,
  onSuggestionPress,
  value,
  setValue,
  style,
}: SearchBarWithSuggestionsProps) {
  const {
    searchResults,
    isLoading: isLoadingSearch,
    error: errorSearch,
    setSearchQuery,
    performSearch,
    clearSearchResults,
  } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);

  // Local state if not controlled
  const [internalValue, setInternalValue] = useState('');
  const searchText = value !== undefined ? value : internalValue;
  const setSearchText = setValue !== undefined ? setValue : setInternalValue;

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 1) {
        performSearch(query);
      } else if (query.trim().length === 0) {
        clearSearchResults();
      }
    }, 300),
    [performSearch, clearSearchResults]
  );

  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    clearSearchResults();
    const trimmed = searchText.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const handleSuggestionPress = (item: SearchItem) => {
    setSearchText('');
    clearSearchResults();
    Keyboard.dismiss();
    onSuggestionPress(item);
  };

  // Determine if we should show the search results dropdown
  const shouldShowDropdown = isFocused && 
    (isLoadingSearch || errorSearch || 
     searchResults.length > 0 || 
     (searchText.trim().length >= 2 && !isLoadingSearch));

  return (
    <View style={[{ position: 'relative' }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lightGray, borderRadius: 25, paddingHorizontal: spacing.md, height: 40 }}>
        <FontAwesome name="search" size={18} color={colors.blue} style={{ marginRight: spacing.sm }} />
        <TextInput
          style={{ flex: 1, height: 40, fontSize: 14, color: colors.black }}
          placeholder={placeholder}
          placeholderTextColor={colors.textGray}
          value={searchText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Small delay to allow click on suggestion
            setTimeout(() => setIsFocused(false), 200);
          }}
        />
      </View>
      {shouldShowDropdown && (
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 45,
          backgroundColor: colors.white,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.borderLight,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          zIndex: 100,
          maxHeight: 300,
          overflow: 'hidden',
        }}>
          {isLoadingSearch ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md }}>
              <ActivityIndicator color={colors.blue} size="small" />
              <Text style={{ marginLeft: spacing.sm, color: colors.blue }}>Searching...</Text>
            </View>
          ) : errorSearch ? (
            <View style={{ padding: spacing.md }}>
              <Text style={{ color: colors.red, textAlign: 'center' }}>{errorSearch}</Text>
            </View>
          ) : searchResults.length === 0 && searchText.trim().length >= 2 ? (
            <View style={{ padding: spacing.md }}>
              <Text style={{ color: colors.textGray, textAlign: 'center' }}>No products found for "{searchText}"</Text>
            </View>
          ) : (
            <RNScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} style={{ width: '100%' }}>
              {searchResults.map((item) => (
                <TouchableOpacity
                  key={item.XCode + item.XName}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, height: 50 }}
                  onPress={() => handleSuggestionPress(item)}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="search" size={16} color={colors.blue} style={{ marginRight: spacing.sm, width: 16 }} />
                  <Text style={{ fontSize: 14, color: colors.blue }}>{item.XName}</Text>
                </TouchableOpacity>
              ))}
            </RNScrollView>
          )}
        </View>
      )}
    </View>
  );
} 