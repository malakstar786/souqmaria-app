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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
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
          <Text style={styles.name} numberOfLines={2}>{name}</Text>
          {arabicName && <Text style={styles.arabicName} numberOfLines={1}>{arabicName}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    marginBottom: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
    maxHeight: 60,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: colors.lightGray,
    borderRadius: radii.md,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 16,
  },
  arabicName: {
    fontSize: 10,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default CategoryCard; 