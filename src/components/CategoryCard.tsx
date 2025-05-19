import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@theme';

// Map category names to FontAwesome icon names
const categoryIcons: Record<string, string> = {
  'Mobile': 'mobile',
  'Tablet': 'tablet',
  'Accessories': 'headphones',
  'Speakers & Headphones': 'volume-up',
  'Smart Watches': 'clock-o',
  'Home Appliances': 'home',
  'Electronics Appliances': 'desktop',
  // Default icon as fallback
  'default': 'question-circle',
};

interface CategoryCardProps {
  name: string;
  // code: string; // Assuming SrNo or another unique ID will be used for navigation if needed
  imageUrl?: string;
  onPress?: () => void; // Optional onPress for navigation
}

const CategoryCard = ({ name, imageUrl, onPress }: CategoryCardProps) => {
  const router = useRouter();
  
  // Get the appropriate icon for this category, or use default if not found
  const iconName = categoryIcons[name] || categoryIcons.default;
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default navigation if no specific onPress is provided
      // This might need adjustment based on how you want to navigate from categories
      // For now, let's assume categories on homepage don't navigate directly
      // or the parent component will handle it.
      console.log(`Category pressed: ${name}`);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder} /> // Simple placeholder
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular
    backgroundColor: colors.veryLightGray, // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures image respects border radius
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightGray, // Darker placeholder color
    borderRadius: 20,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.black,
    marginTop: spacing.xs,
  },
});

export default CategoryCard; 