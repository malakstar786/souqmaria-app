import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
  arabicName?: string; // Optional Arabic translation
  imageUrl?: string; // Made imageUrl optional
  onPress: () => void;
}

const CategoryCard = ({ name, arabicName, imageUrl, onPress }: CategoryCardProps) => {
  // Get the appropriate icon for this category, or use default if not found
  const iconName = categoryIcons[name] || categoryIcons.default;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {arabicName && <Text style={styles.arabicName} numberOfLines={1}>{arabicName}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    padding: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    width: '80%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '70%',
    height: '70%',
    backgroundColor: colors.lightGray,
    borderRadius: radii.sm,
  },
  textContainer: {
    width: '100%',
    padding: spacing.xs,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
  arabicName: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default CategoryCard; 