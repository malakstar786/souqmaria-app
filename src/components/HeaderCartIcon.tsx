import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useCartStore from '../store/cart-store';

interface HeaderCartIconProps {
  color?: string;
}

const HeaderCartIcon = ({ color = '#000000' }: HeaderCartIconProps) => {
  const router = useRouter();
  const { cartItems, totalItems, fetchCartItems } = useCartStore();
  
  // Ensure we have the latest cart data
  useEffect(() => {
    fetchCartItems();
  }, []);
  
  // Use the totalItems from the store instead of calculating it here
  // This ensures consistency with the cart display

  const handleCartPress = () => {
    router.push('/(shop)/cart');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleCartPress}
      accessibilityLabel="View cart"
      accessibilityRole="button"
    >
      <FontAwesome name="shopping-cart" size={22} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HeaderCartIcon; 