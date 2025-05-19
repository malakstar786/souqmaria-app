import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { LocationItem } from '../store/location-store';
import { Ionicons } from '@expo/vector-icons';

interface AddressDropdownProps {
  label: string;
  placeholder: string;
  items: LocationItem[];
  selectedItem: LocationItem | null;
  onSelect: (item: LocationItem) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  isLoading = false,
  disabled = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: LocationItem) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[
          styles.dropdown, 
          disabled && styles.disabledDropdown
        ]} 
        onPress={() => !disabled && items.length > 0 && setModalVisible(true)}
        disabled={disabled || items.length === 0}
      >
        <Text style={[
          styles.selectedText,
          !selectedItem && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedItem ? selectedItem.XName : placeholder}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#00AEEF" />
        ) : (
          <Ionicons name="chevron-down" size={20} color={disabled ? "#D9D9D9" : "#000000"} />
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.XCode.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.item, 
                    selectedItem?.XCode === item.XCode && styles.selectedItem
                  ]} 
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{item.XName}</Text>
                  {selectedItem?.XCode === item.XCode && (
                    <Ionicons name="checkmark" size={20} color="#8DC63F" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={styles.list}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000000',
    fontWeight: 'bold',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 48,
  },
  disabledDropdown: {
    backgroundColor: '#F1F1F1',
    borderColor: '#D9D9D9',
  },
  selectedText: {
    color: '#000000',
    fontSize: 16,
  },
  placeholderText: {
    color: '#D9D9D9',
  },
  disabledText: {
    color: '#D9D9D9',
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
    paddingTop: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
  },
  list: {
    maxHeight: '70%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  selectedItem: {
    backgroundColor: '#F5F5F5',
  },
  itemText: {
    fontSize: 16,
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },
});

export default AddressDropdown; 